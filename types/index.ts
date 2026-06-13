export type CharStatus = 'pending' | 'correct' | 'incorrect' | 'current';

export type TestMode = 'time' | 'long';

export interface TestResult {
  id: string;
  user_id: string;
  mode: TestMode;
  duration_setting: number | null;
  text_id: string | null;
  wpm: number;
  raw_wpm: number | null;
  accuracy: number;
  total_chars: number;
  correct_chars: number;
  incorrect_chars: number;
  time_taken: number;
  created_at: string;
}

export interface TestResultInsert {
  mode: TestMode;
  duration_setting?: number | null;
  text_id?: string | null;
  wpm: number;
  raw_wpm?: number | null;
  accuracy: number;
  total_chars: number;
  correct_chars: number;
  incorrect_chars: number;
  time_taken: number;
}

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  totalTyped: number;
  timeElapsed: number;
}

export interface UserSummaryStats {
  avgWpm: number;
  avgAccuracy: number;
  totalHours: number;
  totalTests: number;
}
