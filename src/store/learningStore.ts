import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  LearningState,
  WordStatus,
  WrongAnswer,
} from "../types";

const STORAGE_KEY = "nihongo-studio-learning-data";
const METADATA_KEY = "nihongo-studio-learning-metadata";

export interface LearningMetadata {
  localUpdatedAt: string | null;
  hasLocalChanges: boolean;
  lastCloudUpdatedAt: string | null;
  lastSyncedAt: string | null;
}

const initialLearningMetadata: LearningMetadata = {
  localUpdatedAt: null,
  hasLocalChanges: false,
  lastCloudUpdatedAt: null,
  lastSyncedAt: null,
};

export const initialLearningState: LearningState = {
  version: 1,
  completedLessonIds: [],
  lessonStats: {},
  wrongAnswers: [],
  vocabularyStatus: {},
  favoriteWordIds: [],
  kanaStats: { correct: 0, total: 0 },
  lastLessonId: null,
  showFurigana: true,
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeLearningState(value: unknown): LearningState | null {
  if (!isObject(value)) return null;

  const completedLessonIds = Array.isArray(value.completedLessonIds)
    ? value.completedLessonIds.filter((item): item is string => typeof item === "string")
    : [];
  const favoriteWordIds = Array.isArray(value.favoriteWordIds)
    ? value.favoriteWordIds.filter((item): item is string => typeof item === "string")
    : [];
  const wrongAnswers = Array.isArray(value.wrongAnswers)
    ? value.wrongAnswers.filter(
        (item): item is WrongAnswer =>
          isObject(item) &&
          typeof item.exerciseId === "string" &&
          typeof item.lessonId === "string" &&
          typeof item.count === "number" &&
          typeof item.lastAttemptAt === "string",
      )
    : [];

  const lessonStats: LearningState["lessonStats"] = {};
  if (isObject(value.lessonStats)) {
    Object.entries(value.lessonStats).forEach(([key, stats]) => {
      if (
        isObject(stats) &&
        typeof stats.correct === "number" &&
        typeof stats.total === "number"
      ) {
        lessonStats[key] = {
          correct: Math.max(0, stats.correct),
          total: Math.max(0, stats.total),
        };
      }
    });
  }

  const vocabularyStatus: LearningState["vocabularyStatus"] = {};
  if (isObject(value.vocabularyStatus)) {
    Object.entries(value.vocabularyStatus).forEach(([key, status]) => {
      if (status === "mastered" || status === "review") {
        vocabularyStatus[key] = status;
      }
    });
  }

  const kanaStats =
    isObject(value.kanaStats) &&
    typeof value.kanaStats.correct === "number" &&
    typeof value.kanaStats.total === "number"
      ? {
          correct: Math.max(0, value.kanaStats.correct),
          total: Math.max(0, value.kanaStats.total),
        }
      : initialLearningState.kanaStats;

  return {
    version: 1,
    completedLessonIds,
    lessonStats,
    wrongAnswers,
    vocabularyStatus,
    favoriteWordIds,
    kanaStats,
    lastLessonId: typeof value.lastLessonId === "string" ? value.lastLessonId : null,
    showFurigana:
      typeof value.showFurigana === "boolean"
        ? value.showFurigana
        : initialLearningState.showFurigana,
  };
}

function loadState(): LearningState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialLearningState;
    return normalizeLearningState(JSON.parse(raw)) ?? initialLearningState;
  } catch {
    return initialLearningState;
  }
}

function loadMetadata(): LearningMetadata {
  try {
    const raw = localStorage.getItem(METADATA_KEY);
    if (!raw) return initialLearningMetadata;
    const value = JSON.parse(raw);
    if (!isObject(value)) return initialLearningMetadata;

    return {
      localUpdatedAt:
        typeof value.localUpdatedAt === "string" ? value.localUpdatedAt : null,
      hasLocalChanges:
        typeof value.hasLocalChanges === "boolean"
          ? value.hasLocalChanges
          : false,
      lastCloudUpdatedAt:
        typeof value.lastCloudUpdatedAt === "string"
          ? value.lastCloudUpdatedAt
          : null,
      lastSyncedAt: typeof value.lastSyncedAt === "string" ? value.lastSyncedAt : null,
    };
  } catch {
    return initialLearningMetadata;
  }
}

export function useLearningStore() {
  const [state, setState] = useState<LearningState>(loadState);
  const [metadata, setMetadata] = useState<LearningMetadata>(loadMetadata);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage may be unavailable in privacy mode; the current session still works.
    }
  }, [state]);

  useEffect(() => {
    try {
      localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
    } catch {
      // Sync metadata is helpful but not required for local learning.
    }
  }, [metadata]);

  const updateState = useCallback(
    (
      updater: LearningState | ((current: LearningState) => LearningState),
      options: { markDirty?: boolean } = {},
    ) => {
      const markDirty = options.markDirty ?? true;
      const updatedAt = new Date().toISOString();

      setState((current) => {
        return typeof updater === "function" ? updater(current) : updater;
      });
      setMetadata((currentMetadata) => ({
        ...currentMetadata,
        localUpdatedAt: updatedAt,
        hasLocalChanges: markDirty ? true : currentMetadata.hasLocalChanges,
      }));
    },
    [],
  );

  const recordExercise = useCallback(
    (lessonId: string, exerciseId: string, correct: boolean, answer: unknown) => {
      updateState((current) => {
        const previousStats = current.lessonStats[lessonId] ?? {
          correct: 0,
          total: 0,
        };
        const otherWrongAnswers = current.wrongAnswers.filter(
          (item) => item.exerciseId !== exerciseId,
        );
        const previousWrong = current.wrongAnswers.find(
          (item) => item.exerciseId === exerciseId,
        );
        const wrongAnswers = correct
          ? otherWrongAnswers
          : [
              ...otherWrongAnswers,
              {
                exerciseId,
                lessonId,
                submittedAnswer: answer,
                count: (previousWrong?.count ?? 0) + 1,
                lastAttemptAt: new Date().toISOString(),
              },
            ];

        return {
          ...current,
          lastLessonId: lessonId,
          lessonStats: {
            ...current.lessonStats,
            [lessonId]: {
              correct: previousStats.correct + (correct ? 1 : 0),
              total: previousStats.total + 1,
            },
          },
          wrongAnswers,
        };
      });
    },
    [updateState],
  );

  const completeLesson = useCallback((lessonId: string) => {
    updateState((current) => ({
      ...current,
      lastLessonId: lessonId,
      completedLessonIds: current.completedLessonIds.includes(lessonId)
        ? current.completedLessonIds
        : [...current.completedLessonIds, lessonId],
    }));
  }, [updateState]);

  const setLastLesson = useCallback((lessonId: string) => {
    updateState((current) => ({ ...current, lastLessonId: lessonId }));
  }, [updateState]);

  const setWordStatus = useCallback((wordId: string, status?: WordStatus) => {
    updateState((current) => {
      const vocabularyStatus = { ...current.vocabularyStatus };
      if (status) vocabularyStatus[wordId] = status;
      else delete vocabularyStatus[wordId];
      return { ...current, vocabularyStatus };
    });
  }, [updateState]);

  const toggleFavorite = useCallback((wordId: string) => {
    updateState((current) => ({
      ...current,
      favoriteWordIds: current.favoriteWordIds.includes(wordId)
        ? current.favoriteWordIds.filter((id) => id !== wordId)
        : [...current.favoriteWordIds, wordId],
    }));
  }, [updateState]);

  const recordKanaAnswer = useCallback((correct: boolean) => {
    updateState((current) => ({
      ...current,
      kanaStats: {
        correct: current.kanaStats.correct + (correct ? 1 : 0),
        total: current.kanaStats.total + 1,
      },
    }));
  }, [updateState]);

  const setShowFurigana = useCallback((showFurigana: boolean) => {
    updateState((current) => ({ ...current, showFurigana }));
  }, [updateState]);

  const removeWrongAnswer = useCallback((exerciseId: string) => {
    updateState((current) => ({
      ...current,
      wrongAnswers: current.wrongAnswers.filter(
        (item) => item.exerciseId !== exerciseId,
      ),
    }));
  }, [updateState]);

  const clearWrongAnswers = useCallback(() => {
    updateState((current) => ({ ...current, wrongAnswers: [] }));
  }, [updateState]);

  const reset = useCallback(() => updateState(initialLearningState), [updateState]);

  const replaceState = useCallback(
    (nextState: LearningState, options: { markDirty?: boolean } = {}) => {
      updateState(nextState, options);
    },
    [updateState],
  );

  const markCloudSynced = useCallback((cloudUpdatedAt: string | null) => {
    const syncedAt = new Date().toISOString();
    setMetadata((current) => ({
      ...current,
      hasLocalChanges: false,
      lastCloudUpdatedAt: cloudUpdatedAt,
      lastSyncedAt: syncedAt,
    }));
  }, []);

  const noteCloudSnapshot = useCallback((cloudUpdatedAt: string | null) => {
    setMetadata((current) => ({
      ...current,
      lastCloudUpdatedAt: cloudUpdatedAt,
    }));
  }, []);

  const importData = useCallback((raw: string) => {
    try {
      const normalized = normalizeLearningState(JSON.parse(raw));
      if (!normalized) return false;
      updateState(normalized);
      return true;
    } catch {
      return false;
    }
  }, [updateState]);

  const exportData = useCallback(() => JSON.stringify(state, null, 2), [state]);

  return useMemo(
    () => ({
      state,
      metadata,
      recordExercise,
      completeLesson,
      setLastLesson,
      setWordStatus,
      toggleFavorite,
      recordKanaAnswer,
      setShowFurigana,
      removeWrongAnswer,
      clearWrongAnswers,
      reset,
      importData,
      exportData,
      replaceState,
      markCloudSynced,
      noteCloudSnapshot,
    }),
    [
      state,
      metadata,
      recordExercise,
      completeLesson,
      setLastLesson,
      setWordStatus,
      toggleFavorite,
      recordKanaAnswer,
      setShowFurigana,
      removeWrongAnswer,
      clearWrongAnswers,
      reset,
      importData,
      exportData,
      replaceState,
      markCloudSynced,
      noteCloudSnapshot,
    ],
  );
}

export type LearningStore = ReturnType<typeof useLearningStore>;
