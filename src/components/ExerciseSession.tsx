import { useState } from "react";
import type { Exercise } from "../types";
import { useLearning } from "../store/LearningContext";
import { ArrowIcon, CheckIcon } from "./Icons";
import { ExerciseRenderer } from "./ExerciseRenderer";

export interface SessionItem {
  lessonId: string;
  lessonTitle: string;
  exercise: Exercise;
}

export function ExerciseSession({
  items,
  completeLessonId,
  onExit,
}: {
  items: SessionItem[];
  completeLessonId?: string;
  onExit?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const { recordExercise, completeLesson } = useLearning();
  const item = items[index];

  if (!items.length) {
    return <div className="empty-state"><h2>没有可练习的题目</h2><p>完成课程练习后，错题会出现在这里。</p></div>;
  }

  const handleSubmit = ({ correct, answer }: { correct: boolean; answer: unknown }) => {
    if (answered) return;
    setAnswered(true);
    if (correct) setScore((current) => current + 1);
    recordExercise(item.lessonId, item.exercise.id, correct, answer);
  };

  const next = () => {
    if (index === items.length - 1) {
      if (completeLessonId) completeLesson(completeLessonId);
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
    setAnswered(false);
  };

  if (finished) {
    const percent = Math.round((score / items.length) * 100);
    return (
      <div className="session-complete">
        <span className="session-complete-icon"><CheckIcon /></span>
        <span className="eyebrow">SESSION COMPLETE</span>
        <h1>{percent >= 80 ? "漂亮地完成了这组练习" : "完成比完美更重要"}</h1>
        <p>本次答对 {score} / {items.length} 题，正确率 {percent}%。错题已自动加入复习中心。</p>
        <div className="session-result-ring"><strong>{percent}%</strong><span>本次正确率</span></div>
        <div className="session-complete-actions">
          <a className="button button-primary" href={completeLessonId ? `#/lesson/${completeLessonId}` : "#/review"}>返回学习页</a>
          {onExit && <button className="button button-secondary" onClick={onExit}>结束复习</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-session">
      <div className="session-topbar">
        <div>
          <span>{item.lessonTitle}</span>
          <strong>{index + 1} / {items.length}</strong>
        </div>
        <div className="session-progress"><span style={{ width: `${((index + (answered ? 1 : 0)) / items.length) * 100}%` }} /></div>
      </div>
      <ExerciseRenderer key={item.exercise.id} exercise={item.exercise} onSubmit={handleSubmit} />
      {answered && <button className="button button-dark next-question" onClick={next}>{index === items.length - 1 ? "查看结果" : "下一题"} <ArrowIcon /></button>}
    </div>
  );
}
