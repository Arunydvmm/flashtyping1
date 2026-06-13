// Simple word bank for time-based tests
const WORD_BANK = [
  'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'time',
  'space', 'light', 'sound', 'water', 'earth', 'fire', 'wind', 'mountain',
  'river', 'ocean', 'forest', 'desert', 'island', 'valley', 'cloud', 'storm',
  'thunder', 'lightning', 'rainbow', 'sunset', 'sunrise', 'morning', 'evening',
  'night', 'day', 'week', 'month', 'year', 'second', 'minute', 'hour',
  'computer', 'keyboard', 'monitor', 'program', 'function', 'variable',
  'language', 'system', 'network', 'server', 'client', 'database', 'design',
  'develop', 'build', 'create', 'test', 'deploy', 'launch', 'improve',
  'practice', 'speed', 'accuracy', 'focus', 'rhythm', 'finger', 'word',
  'letter', 'sentence', 'paragraph', 'article', 'story', 'idea', 'thought',
];

const LONG_FORMAT_PASSAGES: { id: string; title: string; text: string }[] = [
  {
    id: 'tech-1',
    title: 'On Software and Craft',
    text: `Programming is often described as a craft, and like any craft it rewards patience, repetition, and attention to detail. A skilled developer does not simply write code that works; they write code that can be read, maintained, and extended by others. This requires a habit of naming things clearly, breaking problems into smaller pieces, and testing assumptions early rather than late. Over time, the discipline of writing clean code becomes second nature, much like a musician who no longer thinks about finger placement but simply plays. The same principle applies to typing itself. As your fingers learn the layout of the keyboard, your mind is freed to focus on the words and ideas you are trying to express, rather than the mechanics of producing them.`,
  },
  {
    id: 'nature-1',
    title: 'The Quiet of the Forest',
    text: `Early in the morning, before the rest of the world wakes, the forest holds a particular kind of silence. It is not the absence of sound but the presence of many small sounds layered together: the rustle of leaves, the distant call of a bird, the soft creak of branches shifting in the wind. Walking through this space, one becomes aware of how much of daily life is filled with noise that drowns out these subtler signals. Spending time in such places, even briefly, can reset a person's sense of pace. The mind slows down, thoughts become less urgent, and attention naturally shifts toward the present moment rather than the long list of tasks waiting elsewhere.`,
  },
  {
    id: 'history-1',
    title: 'The Spread of Written Language',
    text: `Long before printing presses or typewriters existed, the spread of written language depended entirely on the patience of scribes. Each manuscript was copied by hand, letter by letter, often taking months or years to complete a single work. Mistakes were inevitable, and over generations, small errors could accumulate into significant differences between copies of the same text. The invention of movable type changed this process dramatically, allowing identical copies to be produced quickly and in large numbers. This shift not only made books more affordable but also helped standardize spelling and grammar across regions, laying the groundwork for the consistent written languages we use today.`,
  },
];

export function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);
  }
  return words.join(' ');
}

/**
 * Returns enough words for a time-based test of the given duration.
 * Over-generates slightly so fast typists don't run out of text.
 */
export function getTimeBasedText(durationSeconds: number): string {
  // Assume up to ~150 WPM => 150 * (5 chars + space) / 60 chars per second
  const estimatedWordsNeeded = Math.ceil((durationSeconds / 60) * 160);
  return generateWords(estimatedWordsNeeded);
}

export function getRandomLongPassage(): { id: string; title: string; text: string } {
  return LONG_FORMAT_PASSAGES[Math.floor(Math.random() * LONG_FORMAT_PASSAGES.length)];
}

export function getLongPassageById(id: string) {
  return LONG_FORMAT_PASSAGES.find((p) => p.id === id) ?? LONG_FORMAT_PASSAGES[0];
}
