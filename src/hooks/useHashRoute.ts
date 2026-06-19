import { useEffect, useState } from "react";

function currentHash() {
  return window.location.hash.replace(/^#/, "") || "/";
}

export function useHashRoute() {
  const [route, setRoute] = useState(currentHash);

  useEffect(() => {
    const onChange = () => {
      setRoute(currentHash());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export function navigate(path: string) {
  window.location.hash = path;
}
