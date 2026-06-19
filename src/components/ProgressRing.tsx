export function ProgressRing({
  value,
  size = 116,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div
      className="progress-ring"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(var(--accent) ${safeValue * 3.6}deg, var(--line) 0deg)`,
      }}
      aria-label={`${label ?? "进度"} ${safeValue}%`}
    >
      <div className="progress-ring-inner">
        <strong>{safeValue}%</strong>
        {label && <span>{label}</span>}
      </div>
    </div>
  );
}
