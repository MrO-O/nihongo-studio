import { useEffect, useState } from "react";
import { ArrowIcon, CheckIcon } from "../components/Icons";
import { VocabularySection } from "../components/VocabularySection";
import { GrammarSection } from "../components/GrammarSection";
import { ReadingSection } from "../components/ReadingSection";
import { getLesson } from "../content";
import { useLearning } from "../store/LearningContext";

type LessonTab = "overview" | "vocabulary" | "grammar" | "reading";

export function LessonPage({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId);
  const [tab, setTab] = useState<LessonTab>("overview");
  const { state, setLastLesson } = useLearning();

  useEffect(() => {
    if (lesson) setLastLesson(lesson.id);
  }, [lesson, setLastLesson]);

  if (!lesson) {
    return (
      <div className="page centered-state">
        <span className="large-japanese">迷</span>
        <h1>没有找到这个课程</h1>
        <p>课程链接可能已经变化，请返回课程列表重新选择。</p>
        <a className="button button-primary" href="#/lessons">返回课程列表</a>
      </div>
    );
  }

  const completed = state.completedLessonIds.includes(lesson.id);
  const stats = state.lessonStats[lesson.id];
  const accuracy = stats?.total ? Math.round((stats.correct / stats.total) * 100) : null;

  return (
    <div className="page lesson-page">
      <a className="back-link" href="#/lessons">← 返回课程列表</a>
      <header className="lesson-hero" style={{ "--lesson-accent": lesson.accent } as React.CSSProperties}>
        <div className="lesson-hero-number">UNIT<br /><strong>{String(lesson.unit).padStart(2, "0")}</strong></div>
        <div className="lesson-hero-copy">
          <span className="eyebrow">{lesson.duration}</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.subtitle}</p>
          <div className="lesson-hero-meta">
            <span>{lesson.vocabulary.length} 个单词</span>
            <span>{lesson.grammar.length} 个语法点</span>
            <span>{lesson.exercises.length} 道练习</span>
            {accuracy !== null && <strong>{accuracy}% 正确率</strong>}
          </div>
        </div>
        {completed && <span className="lesson-complete-badge"><CheckIcon /> 已完成</span>}
        <span className="lesson-hero-kanji" aria-hidden="true">言</span>
      </header>

      <nav className="lesson-tabs">
        {([
          ["overview", "学习目标"],
          ["vocabulary", "单词"],
          ["grammar", "语法与例句"],
          ["reading", "对话 / 短文"],
        ] as Array<[LessonTab, string]>).map(([value, label]) => (
          <button className={tab === value ? "active" : ""} onClick={() => setTab(value)} key={value}>{label}</button>
        ))}
      </nav>

      {tab === "overview" && (
        <section className="lesson-section overview-section">
          <div className="overview-copy">
            <span className="eyebrow">LESSON OVERVIEW</span>
            <h2>这一课，我们会做到</h2>
            <p>{lesson.description}</p>
          </div>
          <div className="goal-list">
            {lesson.goals.map((goal, index) => (
              <div key={goal}><span>{index + 1}</span><p>{goal}</p><CheckIcon /></div>
            ))}
          </div>
          <div className="overview-next">
            <p>准备好后，从核心单词开始。</p>
            <button className="button button-primary" onClick={() => setTab("vocabulary")}>开始学习 <ArrowIcon /></button>
          </div>
        </section>
      )}
      {tab === "vocabulary" && <VocabularySection words={lesson.vocabulary} />}
      {tab === "grammar" && <GrammarSection grammar={lesson.grammar} examples={lesson.examples} />}
      {tab === "reading" && <ReadingSection reading={lesson.reading} />}

      <section className="practice-banner">
        <div><span className="eyebrow">PRACTICE</span><h2>把理解变成自己的能力</h2><p>完成 {lesson.exercises.length} 道混合题型练习，系统会自动记录正确率和错题。</p></div>
        <a className="button button-light" href={`#/exercise/${lesson.id}`}>{stats?.total ? "再次练习" : "开始练习"} <ArrowIcon /></a>
      </section>
    </div>
  );
}
