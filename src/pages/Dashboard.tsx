import { lessons } from "../content";
import { useLearning } from "../store/LearningContext";
import { ArrowIcon, BookIcon, HeartIcon, ReviewIcon, SparkIcon } from "../components/Icons";
import { ProgressRing } from "../components/ProgressRing";

function accuracy(correct: number, total: number) {
  return total ? Math.round((correct / total) * 100) : 0;
}

export function Dashboard() {
  const { state } = useLearning();
  const completed = state.completedLessonIds.length;
  const progress = Math.round((completed / lessons.length) * 100);
  const nextLesson =
    lessons.find((lesson) => !state.completedLessonIds.includes(lesson.id)) ??
    lessons.find((lesson) => lesson.id === state.lastLessonId) ??
    lessons[0];
  const reviewWords = Object.values(state.vocabularyStatus).filter(
    (status) => status === "review",
  ).length;

  return (
    <div className="page dashboard-page">
      <header className="page-header dashboard-header">
        <div>
          <span className="eyebrow">学習ダッシュボード</span>
          <h1>继续积累，<br /><em>今天也前进一步。</em></h1>
          <p>从声音到句子，把每个小进步连接起来。</p>
        </div>
        <div className="date-stamp">
          <span>今日</span>
          <strong>{new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric" }).format(new Date())}</strong>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="hero-progress-card">
          <div className="hero-progress-copy">
            <span className="pill">总体学习进度</span>
            <h2>{completed === lessons.length ? "基础单元已完成" : "你的日语旅程正在展开"}</h2>
            <p>已经完成 {completed} / {lessons.length} 个课程单元。</p>
            <a className="button button-primary" href={`#/lesson/${nextLesson.id}`}>
              {state.lastLessonId ? "继续学习" : "开始第一课"} <ArrowIcon />
            </a>
          </div>
          <ProgressRing value={progress} size={144} label="已完成" />
          <span className="hero-kanji" aria-hidden="true">進</span>
        </article>

        <div className="metric-grid">
          <article className="metric-card">
            <span className="metric-icon green"><BookIcon /></span>
            <div><strong>{completed}</strong><span>已完成课程</span></div>
          </article>
          <article className="metric-card">
            <span className="metric-icon coral"><ReviewIcon /></span>
            <div><strong>{state.wrongAnswers.length}</strong><span>待复习错题</span></div>
          </article>
          <article className="metric-card">
            <span className="metric-icon gold"><HeartIcon /></span>
            <div><strong>{state.favoriteWordIds.length}</strong><span>收藏单词</span></div>
          </article>
          <article className="metric-card">
            <span className="metric-icon violet"><SparkIcon /></span>
            <div><strong>{reviewWords}</strong><span>待巩固单词</span></div>
          </article>
        </div>
      </section>

      <section className="dashboard-lower">
        <div className="section-block">
          <div className="section-heading">
            <div><span className="eyebrow">CONTINUE</span><h2>下一步学习</h2></div>
            <a href="#/lessons">查看全部课程 <ArrowIcon /></a>
          </div>
          <a className="continue-card" href={`#/lesson/${nextLesson.id}`}>
            <span className="unit-number" style={{ background: nextLesson.accent }}>
              {String(nextLesson.unit).padStart(2, "0")}
            </span>
            <div className="continue-main">
              <span>UNIT {nextLesson.unit}</span>
              <h3>{nextLesson.title}</h3>
              <p>{nextLesson.subtitle}</p>
            </div>
            <div className="continue-stats">
              <span>{nextLesson.duration}</span>
              <strong>
                {accuracy(
                  state.lessonStats[nextLesson.id]?.correct ?? 0,
                  state.lessonStats[nextLesson.id]?.total ?? 0,
                )}% 正确率
              </strong>
            </div>
            <ArrowIcon className="continue-arrow" />
          </a>
        </div>

        <div className="review-callout">
          <span className="callout-glyph">復</span>
          <span className="eyebrow">SMART REVIEW</span>
          <h2>趁记忆还新鲜</h2>
          <p>
            {state.wrongAnswers.length || reviewWords
              ? `你有 ${state.wrongAnswers.length} 道错题和 ${reviewWords} 个单词等待复习。`
              : "目前没有待复习内容。做几道练习，复习区会自动为你整理。"}
          </p>
          <a className="text-link" href="#/review">进入复习中心 <ArrowIcon /></a>
        </div>
      </section>
    </div>
  );
}
