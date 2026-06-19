import type { ReactNode } from "react";
import {
  BookIcon,
  HomeIcon,
  KanaIcon,
  ReviewIcon,
  SettingsIcon,
} from "./Icons";

const navItems = [
  { path: "/", label: "首页", icon: HomeIcon },
  { path: "/lessons", label: "课程", icon: BookIcon },
  { path: "/kana", label: "假名", icon: KanaIcon },
  { path: "/review", label: "复习", icon: ReviewIcon },
  { path: "/settings", label: "数据", icon: SettingsIcon },
];

function isActive(route: string, path: string) {
  if (path === "/") return route === "/";
  return route.startsWith(path) || (path === "/lessons" && route.startsWith("/lesson/"));
}

export function Layout({ route, children }: { route: string; children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#/">
          <span className="brand-mark">日</span>
          <span>
            <strong>Nihongo</strong>
            <small>STUDIO</small>
          </span>
        </a>
        <nav className="main-nav" aria-label="主要导航">
          {navItems.map(({ path, label, icon: Icon }) => (
            <a
              key={path}
              href={`#${path}`}
              className={isActive(route, path) ? "active" : ""}
            >
              <Icon />
              <span>{label}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="eyebrow">今日一言</span>
          <strong>少しずつ、毎日。</strong>
          <p>每天一点点。</p>
        </div>
      </aside>
      <main className="main-content">{children}</main>
      <nav className="mobile-nav" aria-label="移动端导航">
        {navItems.map(({ path, label, icon: Icon }) => (
          <a
            key={path}
            href={`#${path}`}
            className={isActive(route, path) ? "active" : ""}
          >
            <Icon />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
