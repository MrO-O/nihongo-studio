import type { JapaneseTextContent, JapaneseTextSegment } from "../types";
import { useLearning } from "../store/LearningContext";

export function JapaneseText({
  value,
  className,
}: {
  value: JapaneseTextContent;
  className?: string;
}) {
  const { state } = useLearning();

  if (typeof value === "string") {
    return <span className={className}>{value}</span>;
  }

  const segments = Array.isArray(value) ? value : [value];

  return (
    <span className={["japanese-text", className].filter(Boolean).join(" ")}>
      {segments.map((segment, index) => (
        <JapaneseTextToken
          key={`${segment.text}-${index}`}
          segment={segment}
          showFurigana={state.showFurigana}
        />
      ))}
    </span>
  );
}

function JapaneseTextToken({
  segment,
  showFurigana,
}: {
  segment: JapaneseTextSegment;
  showFurigana: boolean;
}) {
  const hasInfo = Boolean(segment.reading || segment.meaning);
  const readable = hasInfo ? (
    <span className="ruby-token" tabIndex={0}>
      <ruby>
        {segment.text}
        {showFurigana && segment.reading && <rt>{segment.reading}</rt>}
      </ruby>
      <span className="ruby-tooltip" role="tooltip">
        <strong>{segment.text}</strong>
        {segment.reading && <span>读音：{segment.reading}</span>}
        {segment.meaning && <span>含义：{segment.meaning}</span>}
      </span>
    </span>
  ) : (
    <span>{segment.text}</span>
  );

  return readable;
}
