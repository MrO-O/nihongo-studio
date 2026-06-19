import { useMemo, useState } from "react";
import { CheckIcon, CloseIcon, SparkIcon } from "../components/Icons";
import { allKana, kanaRows } from "../content/kana";
import { useLearning } from "../store/LearningContext";

type Script = "hiragana" | "katakana";
type Direction = "kana-romaji" | "romaji-kana";

function sampleOptions(correct: string, pool: string[]) {
  const others = [...new Set(pool.filter((item) => item !== correct))]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return [correct, ...others].sort(() => Math.random() - 0.5);
}

export function KanaPage() {
  const [script, setScript] = useState<Script>("hiragana");
  const [selected, setSelected] = useState<string | null>(null);
  const [direction, setDirection] = useState<Direction>("kana-romaji");
  const [questionIndex, setQuestionIndex] = useState(() => Math.floor(Math.random() * allKana.length));
  const [answer, setAnswer] = useState<string | null>(null);
  const { state, recordKanaAnswer } = useLearning();
  const entry = allKana[questionIndex];

  const options = useMemo(() => {
    const correct = direction === "kana-romaji" ? entry.romaji : entry[script];
    const pool = allKana.map((item) => direction === "kana-romaji" ? item.romaji : item[script]);
    return sampleOptions(correct, pool);
  }, [direction, entry, script]);

  const correctAnswer = direction === "kana-romaji" ? entry.romaji : entry[script];
  const prompt = direction === "kana-romaji" ? entry[script] : entry.romaji;
  const accuracy = state.kanaStats.total
    ? Math.round((state.kanaStats.correct / state.kanaStats.total) * 100)
    : 0;

  const chooseAnswer = (value: string) => {
    if (answer) return;
    setAnswer(value);
    recordKanaAnswer(value === correctAnswer);
  };

  const nextQuestion = () => {
    let next = Math.floor(Math.random() * allKana.length);
    if (next === questionIndex) next = (next + 1) % allKana.length;
    setQuestionIndex(next);
    setAnswer(null);
  };

  return (
    <div className="page">
      <header className="page-header compact-header">
        <div><span className="eyebrow">KANA LAB</span><h1>假名练习室</h1><p>先看清字形，再用短练习建立快速反应。</p></div>
        <div className="kana-score"><strong>{accuracy}%</strong><span>累计正确率 · {state.kanaStats.total} 题</span></div>
      </header>

      <section className="kana-layout">
        <div className="kana-chart-panel">
          <div className="section-heading lesson-section-heading">
            <div><span className="eyebrow">GOJŪON</span><h2>五十音基础表</h2></div>
            <div className="segmented">
              <button className={script === "hiragana" ? "active" : ""} onClick={() => setScript("hiragana")}>平假名</button>
              <button className={script === "katakana" ? "active" : ""} onClick={() => setScript("katakana")}>片假名</button>
            </div>
          </div>
          <p className="panel-intro">点击任意假名查看罗马音。空缺位置是现代日语中不常用的音节。</p>
          <div className="kana-table">
            {kanaRows.map((row, rowIndex) => (
              <div className="kana-row" key={rowIndex}>
                {row.map((kana) => {
                  const glyph = kana[script];
                  return (
                    <button className={selected === glyph ? "active" : ""} onClick={() => setSelected(selected === glyph ? null : glyph)} key={glyph}>
                      <strong>{glyph}</strong>
                      <span>{selected === glyph ? kana.romaji : "·"}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <aside className="kana-quiz">
          <span className="quiz-label"><SparkIcon /> QUICK PRACTICE</span>
          <h2>快速识别</h2>
          <div className="segmented quiz-direction">
            <button className={direction === "kana-romaji" ? "active" : ""} onClick={() => { setDirection("kana-romaji"); setAnswer(null); }}>假名 → 罗马音</button>
            <button className={direction === "romaji-kana" ? "active" : ""} onClick={() => { setDirection("romaji-kana"); setAnswer(null); }}>罗马音 → 假名</button>
          </div>
          <div className="kana-question">{prompt}</div>
          <p>请选择对应答案</p>
          <div className="kana-options">
            {options.map((option) => {
              const stateClass = answer
                ? option === correctAnswer ? "correct" : option === answer ? "wrong" : ""
                : "";
              return <button className={stateClass} onClick={() => chooseAnswer(option)} key={option}>{option}</button>;
            })}
          </div>
          {answer && (
            <div className={`inline-feedback ${answer === correctAnswer ? "success" : "error"}`}>
              {answer === correctAnswer ? <CheckIcon /> : <CloseIcon />}
              <span>{answer === correctAnswer ? "正确，保持这个节奏。" : `正确答案是 ${correctAnswer}。`}</span>
            </div>
          )}
          <button className="button button-primary full-button" onClick={nextQuestion}>{answer ? "下一题" : "换一题"}</button>
        </aside>
      </section>
    </div>
  );
}
