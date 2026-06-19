import { useState } from "react";
import type { ReadingContent } from "../types";
import { ChevronIcon } from "./Icons";
import { JapaneseText } from "./JapaneseText";
import { toPlainText } from "../utils/japaneseText";

export function ReadingSection({ reading }: { reading: ReadingContent }) {
  const [showTranslation, setShowTranslation] = useState(true);
  const [openLines, setOpenLines] = useState<number[]>([]);

  const toggleLine = (index: number) => {
    setOpenLines((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  return (
    <section className="lesson-section reading-section">
      <div className="section-heading lesson-section-heading">
        <div>
          <span className="eyebrow">DIALOGUE</span>
          <h2>{reading.title}</h2>
          <p>{reading.intro}</p>
        </div>
        <label className="translation-switch">
          <input type="checkbox" checked={showTranslation} onChange={(event) => setShowTranslation(event.target.checked)} />
          <span />
          显示翻译
        </label>
      </div>
      <div className="dialogue">
        {reading.lines.map((line, index) => {
          const open = openLines.includes(index);
          return (
            <article className={`dialogue-line ${open ? "open" : ""}`} key={`${toPlainText(line.japanese)}-${index}`}>
              <button className="dialogue-line-main" onClick={() => toggleLine(index)}>
                <span className="speaker">{line.speaker ?? "文"}</span>
                <span className="dialogue-copy">
                  <strong><JapaneseText value={line.japanese} /></strong>
                  {showTranslation && <span>{line.meaning}</span>}
                </span>
                <ChevronIcon />
              </button>
              {open && (
                <div className="keyword-panel">
                  {line.keywords.length ? line.keywords.map((keyword) => (
                    <div key={`${keyword.term}-${keyword.meaning}`}>
                      <strong>
                        <JapaneseText value={[{ text: keyword.term, reading: keyword.reading, meaning: keyword.meaning }]} />
                      </strong>
                      <span>{keyword.reading}</span>
                      <p>{keyword.meaning}</p>
                    </div>
                  )) : <p className="empty-inline">这一句没有额外关键词，试着完整读一遍。</p>}
                </div>
              )}
            </article>
          );
        })}
      </div>
      <p className="reading-hint">点击任意句子，查看关键词解释。</p>
    </section>
  );
}
