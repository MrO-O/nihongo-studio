export type WordStatus = "mastered" | "review";

export interface JapaneseTextSegment {
  text: string;
  reading?: string;
  meaning?: string;
}

export type JapaneseTextContent = string | JapaneseTextSegment | JapaneseTextSegment[];

export interface VocabularyItem {
  id: string;
  japanese: JapaneseTextContent;
  kana: string;
  meaning: string;
  partOfSpeech: string;
  example: JapaneseTextContent;
  exampleMeaning: string;
}

export interface GrammarExample {
  japanese: JapaneseTextContent;
  meaning: string;
}

export interface GrammarPoint {
  id: string;
  title: string;
  structure: JapaneseTextContent;
  explanation: string;
  usage: string;
  examples: GrammarExample[];
}

export interface LessonExample {
  japanese: JapaneseTextContent;
  kana?: string;
  meaning: string;
}

export interface ReadingKeyword {
  term: string;
  reading: string;
  meaning: string;
}

export interface ReadingLine {
  speaker?: string;
  japanese: JapaneseTextContent;
  meaning: string;
  keywords: ReadingKeyword[];
}

export interface ReadingContent {
  title: string;
  intro: string;
  lines: ReadingLine[];
}

interface ExerciseBase {
  id: string;
  prompt: JapaneseTextContent;
  explanation: JapaneseTextContent;
}

export interface MultipleChoiceExercise extends ExerciseBase {
  type: "multiple-choice";
  options: JapaneseTextContent[];
  correctAnswer: JapaneseTextContent;
}

export interface FillBlankExercise extends ExerciseBase {
  type: "fill-blank";
  correctAnswer: string;
  acceptedAnswers?: string[];
  hint?: JapaneseTextContent;
}

export interface OrderSentenceExercise extends ExerciseBase {
  type: "order-sentence";
  parts: JapaneseTextContent[];
  correctOrder: JapaneseTextContent[];
}

export interface MatchingExercise extends ExerciseBase {
  type: "matching";
  pairs: Array<{ left: JapaneseTextContent; right: JapaneseTextContent }>;
}

export interface TrueFalseExercise extends ExerciseBase {
  type: "true-false";
  statement: JapaneseTextContent;
  correctAnswer: boolean;
}

export type Exercise =
  | MultipleChoiceExercise
  | FillBlankExercise
  | OrderSentenceExercise
  | MatchingExercise
  | TrueFalseExercise;

export interface Lesson {
  id: string;
  unit: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  accent: string;
  goals: string[];
  vocabulary: VocabularyItem[];
  grammar: GrammarPoint[];
  examples: LessonExample[];
  reading: ReadingContent;
  exercises: Exercise[];
}

export interface WrongAnswer {
  exerciseId: string;
  lessonId: string;
  submittedAnswer: unknown;
  count: number;
  lastAttemptAt: string;
}

export interface AttemptStats {
  correct: number;
  total: number;
}

export interface LearningState {
  version: 1;
  completedLessonIds: string[];
  lessonStats: Record<string, AttemptStats>;
  wrongAnswers: WrongAnswer[];
  vocabularyStatus: Record<string, WordStatus>;
  favoriteWordIds: string[];
  kanaStats: AttemptStats;
  lastLessonId: string | null;
  showFurigana: boolean;
}

export interface KanaEntry {
  hiragana: string;
  katakana: string;
  romaji: string;
}
