import { CheckIcon, ChevronIcon } from "../components/Icons";
import { lessons } from "../content";
import { useLearning } from "../store/LearningContext";

export function LessonsPage() {
  const { state } = useLearning();

  return (
    <div className="page">
      <header className="page-header compact-header">
        <div>
          <span className="eyebrow">COURSE PATH</span>
          <h1>基础日语课程</h1>
          <p>按顺序建立声音、句型、指示表达与时间概念。</p>
        </div>
        <span className="large-japanese">学ぶ</span>
      </header>

      <section className="lesson-list">
        {lessons.map((lesson, index) => {
          const completed = state.completedLessonIds.includes(lesson.id);
          const stats = state.lessonStats[lesson.id];
          const accuracy = stats?.total
            ? Math.round((stats.correct / stats.total) * 100)
            : null;
          return (
            <a
              className={`lesson-list-card ${completed ? "completed" : ""}`}
              href={`#/lesson/${lesson.id}`}
              key={lesson.id}
            >
              <div className="lesson-index" style={{ "--lesson-accent": lesson.accent } as React.CSSProperties}>
                {completed ? <CheckIcon /> : String(lesson.unit).padStart(2, "0")}
              </div>
              <div className="lesson-card-content">
                <div className="lesson-card-topline">
                  <span>UNIT {lesson.unit}</span>
                  {completed && <span className="complete-label">已完成</span>}
                </div>
                <h2>{lesson.title}</h2>
                <p>{lesson.subtitle}</p>
                <div className="goal-tags">
                  {lesson.goals.slice(0, 2).map((goal) => <span key={goal}>{goal}</span>)}
                </div>
              </div>
              <div className="lesson-card-meta">
                <span>{lesson.vocabulary.length} 单词 · {lesson.grammar.length} 语法</span>
                <strong>{accuracy === null ? "尚未练习" : `练习正确率 ${accuracy}%`}</strong>
              </div>
              <ChevronIcon className="lesson-chevron" />
              {index < lessons.length - 1 && <span className="lesson-connector" />}
            </a>
          );
        })}
      </section>
    </div>
  );
}
