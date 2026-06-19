import type { AttemptStats, LearningState, WrongAnswer } from "../types";
import { initialLearningState } from "../store/learningStore";

function unique(items: string[]) {
  return Array.from(new Set(items));
}

function isEmptyLearningState(state: LearningState) {
  return (
    state.completedLessonIds.length === 0 &&
    Object.keys(state.lessonStats).length === 0 &&
    state.wrongAnswers.length === 0 &&
    Object.keys(state.vocabularyStatus).length === 0 &&
    state.favoriteWordIds.length === 0 &&
    state.kanaStats.correct === 0 &&
    state.kanaStats.total === 0 &&
    state.lastLessonId === null
  );
}

function newerWrongAnswer(a: WrongAnswer, b: WrongAnswer) {
  const aTime = Date.parse(a.lastAttemptAt);
  const bTime = Date.parse(b.lastAttemptAt);
  if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) {
    return aTime > bTime ? a : b;
  }

  return a.count >= b.count ? a : b;
}

function mergeWrongAnswers(
  local: WrongAnswer[],
  cloud: WrongAnswer[],
) {
  const merged = new Map<string, WrongAnswer>();

  [...cloud, ...local].forEach((item) => {
    const existing = merged.get(item.exerciseId);
    merged.set(
      item.exerciseId,
      existing ? newerWrongAnswer(existing, item) : item,
    );
  });

  return Array.from(merged.values()).sort((a, b) =>
    b.lastAttemptAt.localeCompare(a.lastAttemptAt),
  );
}

function betterStats(a: AttemptStats | undefined, b: AttemptStats | undefined) {
  if (!a) return b ?? { correct: 0, total: 0 };
  if (!b) return a;
  if (a.total !== b.total) return a.total > b.total ? a : b;
  return a.correct >= b.correct ? a : b;
}

function mergeLessonStats(
  local: LearningState["lessonStats"],
  cloud: LearningState["lessonStats"],
) {
  const lessonIds = unique([...Object.keys(local), ...Object.keys(cloud)]);
  const merged: LearningState["lessonStats"] = {};

  lessonIds.forEach((lessonId) => {
    merged[lessonId] = betterStats(local[lessonId], cloud[lessonId]);
  });

  return merged;
}

function mergeVocabularyStatus(
  local: LearningState["vocabularyStatus"],
  cloud: LearningState["vocabularyStatus"],
) {
  // Current data has no per-word updatedAt. Keep non-empty cloud values, then let
  // this device win conflicts so a merge never deletes a local word status.
  return { ...cloud, ...local };
}

export function mergeLearningStates(
  localState: LearningState,
  cloudState: LearningState,
) {
  if (isEmptyLearningState(localState) && !isEmptyLearningState(cloudState)) {
    return cloudState;
  }

  if (isEmptyLearningState(cloudState) && !isEmptyLearningState(localState)) {
    return localState;
  }

  return {
    ...initialLearningState,
    completedLessonIds: unique([
      ...cloudState.completedLessonIds,
      ...localState.completedLessonIds,
    ]),
    lessonStats: mergeLessonStats(localState.lessonStats, cloudState.lessonStats),
    wrongAnswers: mergeWrongAnswers(localState.wrongAnswers, cloudState.wrongAnswers),
    vocabularyStatus: mergeVocabularyStatus(
      localState.vocabularyStatus,
      cloudState.vocabularyStatus,
    ),
    favoriteWordIds: unique([
      ...cloudState.favoriteWordIds,
      ...localState.favoriteWordIds,
    ]),
    kanaStats: betterStats(localState.kanaStats, cloudState.kanaStats),
    lastLessonId: localState.lastLessonId ?? cloudState.lastLessonId,
    // Existing settings have no updatedAt, so this v1 merge keeps the current device setting.
    showFurigana: localState.showFurigana,
  };
}
