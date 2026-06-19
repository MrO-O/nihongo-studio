import { useMemo, useState } from "react";
import { ExerciseSession, type SessionItem } from "../components/ExerciseSession";
import { ArrowIcon, CloseIcon, ReviewIcon, SparkIcon } from "../components/Icons";
import { getExercise, getWord, lessons } from "../content";
import { useLearning } from "../store/LearningContext";
import { JapaneseText } from "../components/JapaneseText";

export function ReviewPage() {
  const { state, removeWrongAnswer, clearWrongAnswers } = useLearning();
  const [filter, setFilter] = useState("all");
  const [session, setSession] = useState<SessionItem[] | null>(null);

  const wrongItems = useMemo(
    () =>
      state.wrongAnswers
        .map((wrong) => {
          const found = getExercise(wrong.exerciseId);
          return found ? { wrong, ...found } : null;
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .filter((item) => filter === "all" || item.lesson.id === filter),
    [state.wrongAnswers, filter],
  );

  const reviewWords = Object.entries(state.vocabularyStatus)
    .filter(([, status]) => status === "review")
    .map(([wordId]) => getWord(wordId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const startWrongSession = () => {
    setSession(
      wrongItems.map(({ lesson, exercise }) => ({
        lessonId: lesson.id,
        lessonTitle: `错题复习 · Unit ${lesson.unit}`,
        exercise,
      })),
    );
  };

  const startRandomSession = () => {
    const all = lessons.flatMap((lesson) =>
      lesson.exercises.map((exercise) => ({
        lessonId: lesson.id,
        lessonTitle: `随机复习 · Unit ${lesson.unit}`,
        exercise,
      })),
    );
    setSession(all.sort(() => Math.random() - 0.5).slice(0, 10));
  };

  if (session) {
    return (
      <div className="page exercise-page">
        <button className="back-link button-as-link" onClick={() => setSession(null)}>← 退出本次复习</button>
        <ExerciseSession items={session} onExit={() => setSession(null)} />
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header compact-header">
        <div><span className="eyebrow">REVIEW CENTER</span><h1>复习中心</h1><p>把容易忘记的内容集中起来，练得更有针对性。</p></div>
        <span className="large-japanese">復習</span>
      </header>

      <section className="review-actions">
        <article className="random-review-card">
          <span><SparkIcon /></span>
          <div><span className="eyebrow">MIXED PRACTICE</span><h2>随机 10 题</h2><p>从全部课程中随机抽取题目，快速检查掌握情况。</p></div>
          <button className="button button-light" onClick={startRandomSession}>开始挑战 <ArrowIcon /></button>
        </article>
        <article className="review-summary-card">
          <div><strong>{state.wrongAnswers.length}</strong><span>错题</span></div>
          <div><strong>{reviewWords.length}</strong><span>待复习单词</span></div>
        </article>
      </section>

      <section className="review-section">
        <div className="section-heading lesson-section-heading">
          <div><span className="eyebrow">MISTAKES</span><h2>错题记录</h2></div>
          <div className="review-controls">
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">全部课程</option>
              {lessons.map((lesson) => <option value={lesson.id} key={lesson.id}>Unit {lesson.unit} · {lesson.title}</option>)}
            </select>
            {wrongItems.length > 0 && <button className="button button-secondary small-button" onClick={startWrongSession}>重练当前错题</button>}
            {state.wrongAnswers.length > 0 && (
              <button
                className="danger-link"
                onClick={() => {
                  if (window.confirm("确定清空全部错题吗？此操作无法撤销。")) clearWrongAnswers();
                }}
              >
                清空全部
              </button>
            )}
          </div>
        </div>

        {wrongItems.length ? (
          <div className="wrong-list">
            {wrongItems.map(({ wrong, lesson, exercise }) => (
              <article className="wrong-card" key={exercise.id}>
                <span className="wrong-icon"><ReviewIcon /></span>
                <div>
                  <span>UNIT {lesson.unit} · 错误 {wrong.count} 次</span>
                  <h3><JapaneseText value={exercise.prompt} /></h3>
                  <p><JapaneseText value={exercise.explanation} /></p>
                </div>
                <button className="icon-button" onClick={() => removeWrongAnswer(exercise.id)} aria-label="清除此错题"><CloseIcon /></button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state"><span>✓</span><h3>{filter === "all" ? "暂时没有错题" : "这个单元没有错题"}</h3><p>继续练习，系统会在这里整理需要再看的题目。</p></div>
        )}
      </section>

      <section className="review-section">
        <div className="section-heading lesson-section-heading">
          <div><span className="eyebrow">VOCABULARY</span><h2>待复习单词</h2></div>
        </div>
        {reviewWords.length ? (
          <div className="review-word-grid">
            {reviewWords.map(({ lesson, word }) => (
              <article key={word.id}>
                <span>UNIT {lesson.unit}</span>
                <h3><JapaneseText value={word.japanese} /></h3>
                <p>{word.kana}</p>
                <strong>{word.meaning}</strong>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state compact-empty"><p>还没有标记“待复习”的单词。</p></div>
        )}
      </section>
    </div>
  );
}
