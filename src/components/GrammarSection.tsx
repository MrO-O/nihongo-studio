import type { GrammarPoint, LessonExample } from "../types";
import { JapaneseText } from "./JapaneseText";
import { toPlainText } from "../utils/japaneseText";

export function GrammarSection({
  grammar,
  examples,
}: {
  grammar: GrammarPoint[];
  examples: LessonExample[];
}) {
  return (
    <>
      <section className="lesson-section">
        <div className="section-heading lesson-section-heading">
          <div><span className="eyebrow">GRAMMAR</span><h2>语法要点</h2></div>
        </div>
        <div className="grammar-list">
          {grammar.map((point, index) => (
            <article className="grammar-card" key={point.id}>
              <span className="grammar-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="grammar-main">
                <h3>{point.title}</h3>
                <div className="grammar-structure"><JapaneseText value={point.structure} /></div>
                <p>{point.explanation}</p>
                <div className="usage-note"><strong>使用提示</strong>{point.usage}</div>
              </div>
              <div className="grammar-examples">
                {point.examples.map((example) => (
                  <div key={toPlainText(example.japanese)}>
                    <strong><JapaneseText value={example.japanese} /></strong>
                    <span>{example.meaning}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="lesson-section example-strip-section">
        <div className="section-heading lesson-section-heading">
          <div><span className="eyebrow">EXAMPLES</span><h2>课内例句</h2></div>
        </div>
        <div className="example-list">
          {examples.map((example, index) => (
            <div className="example-row" key={toPlainText(example.japanese)}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><strong><JapaneseText value={example.japanese} /></strong>{example.kana && <small>{example.kana}</small>}</div>
              <p>{example.meaning}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
