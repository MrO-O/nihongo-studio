import { Layout } from "./components/Layout";
import { useHashRoute } from "./hooks/useHashRoute";
import { Dashboard } from "./pages/Dashboard";
import { LessonsPage } from "./pages/LessonsPage";
import { LessonPage } from "./pages/LessonPage";
import { KanaPage } from "./pages/KanaPage";
import { ExercisePage } from "./pages/ExercisePage";
import { ReviewPage } from "./pages/ReviewPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  const route = useHashRoute();
  let page = <Dashboard />;

  if (route === "/lessons") page = <LessonsPage />;
  else if (route === "/kana") page = <KanaPage />;
  else if (route === "/review") page = <ReviewPage />;
  else if (route === "/settings") page = <SettingsPage />;
  else if (route.startsWith("/lesson/")) {
    page = <LessonPage lessonId={route.split("/")[2] ?? ""} />;
  } else if (route.startsWith("/exercise/")) {
    page = <ExercisePage lessonId={route.split("/")[2] ?? ""} />;
  }

  return <Layout route={route}>{page}</Layout>;
}
