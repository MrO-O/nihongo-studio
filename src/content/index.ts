import type { Exercise, Lesson, VocabularyItem } from "../types";
import { unit0 } from "./unit0";
import { unit1 } from "./unit1";
import { unit2 } from "./unit2";
import { unit3 } from "./unit3";
import { unit4 } from "./unit4";
import { unit5 } from "./unit5";
import { unit6 } from "./unit6";
import { unit7 } from "./unit7";
import { unit8 } from "./unit8";
import { unit9 } from "./unit9";
import { unit10 } from "./unit10";
import { withManualFurigana } from "./furigana";

export const lessons: Lesson[] = [
  unit0,
  unit1,
  unit2,
  unit3,
  unit4,
  unit5,
  unit6,
  unit7,
  unit8,
  unit9,
  unit10,
].map(withManualFurigana);

export function getLesson(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getExercise(
  exerciseId: string,
): { lesson: Lesson; exercise: Exercise } | undefined {
  for (const lesson of lessons) {
    const exercise = lesson.exercises.find((item) => item.id === exerciseId);
    if (exercise) return { lesson, exercise };
  }
  return undefined;
}

export function getWord(
  wordId: string,
): { lesson: Lesson; word: VocabularyItem } | undefined {
  for (const lesson of lessons) {
    const word = lesson.vocabulary.find((item) => item.id === wordId);
    if (word) return { lesson, word };
  }
  return undefined;
}
