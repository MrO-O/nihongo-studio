import { ExerciseSession } from "../components/ExerciseSession";
import { getLesson } from "../content";

export function ExercisePage({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId);

  if (!lesson) {
    return <div className="page centered-state"><h1>练习不存在</h1><a className="button button-primary" href="#/lessons">返回课程</a></div>;
  }

  const items = lesson.exercises.map((exercise) => ({
    lessonId: lesson.id,
    lessonTitle: `Unit ${lesson.unit} · ${lesson.title}`,
    exercise,
  }));

  return (
    <div className="page exercise-page">
      <a className="back-link" href={`#/lesson/${lesson.id}`}>← 暂时退出练习</a>
      <ExerciseSession items={items} completeLessonId={lesson.id} />
    </div>
  );
}
