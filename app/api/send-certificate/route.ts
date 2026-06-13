import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limit: 3 certificate emails per user per hour.
// Falls back to allowing requests if Upstash env vars aren't configured
// (so local dev works), but logs a warning — set these in production.
let ratelimit: Ratelimit | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, '1 h'),
    });
  }
} catch {
  ratelimit = null;
}

export async function POST(req: NextRequest) {
  const supabase = createClient();

  // 1. Verify the session server-side — never trust a client-supplied user ID/email
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Rate limit per authenticated user
  if (ratelimit) {
    const { success } = await ratelimit.limit(`cert-email:${user.id}`);
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // 3. Validate input
  const body = await req.json().catch(() => null);
  const testResultId = body?.testResultId;
  if (!testResultId || typeof testResultId !== 'string') {
    return NextResponse.json({ error: 'Missing testResultId' }, { status: 400 });
  }

  // 4. Confirm the test result belongs to this user (RLS also enforces this,
  //    but we check explicitly for a clear error message)
  const { data: result, error: resultError } = await supabase
    .from('test_results')
    .select('wpm, accuracy, created_at')
    .eq('id', testResultId)
    .eq('user_id', user.id)
    .single();

  if (resultError || !result) {
    return NextResponse.json({ error: 'Result not found' }, { status: 404 });
  }

  // 5. Get the user's profile name for the certificate
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single();

  const recipientEmail = profile?.email ?? user.email;
  if (!recipientEmail) {
    return NextResponse.json({ error: 'No email on file' }, { status: 400 });
  }

  // 6. Send via EmailJS REST API using server-only credentials.
  //    Email always goes to the account's own registered address —
  //    never an address supplied in the request body.
  const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        to_email: recipientEmail,
        user_name: profile?.full_name ?? 'Typist',
        wpm: result.wpm,
        accuracy: result.accuracy,
        date: new Date(result.created_at).toLocaleDateString(),
      },
    }),
  });

  if (!emailResponse.ok) {
    const text = await emailResponse.text();
    return NextResponse.json({ error: `Failed to send email: ${text}` }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
