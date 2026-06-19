import { useMemo, useState } from "react";
import type { Exercise } from "../types";
import { CheckIcon, CloseIcon } from "./Icons";
import { JapaneseText } from "./JapaneseText";
import { toPlainText } from "../utils/japaneseText";

interface Submission {
  correct: boolean;
  answer: unknown;
}

function normalize(value: string) {
  return value.trim().replace(/\s+/g, "").toLocaleLowerCase();
}

export function ExerciseRenderer({
  exercise,
  onSubmit,
}: {
  exercise: Exercise;
  onSubmit: (submission: Submission) => void;
}) {
  const [choice, setChoice] = useState<string | boolean | null>(null);
  const [text, setText] = useState("");
  const [ordered, setOrdered] = useState<Array<{ value: string; index: number }>>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [result, setResult] = useState<boolean | null>(null);

  const matchingOptions = useMemo(
    () =>
      exercise.type === "matching"
        ? exercise.pairs.map((pair) => pair.right).sort(() => Math.random() - 0.5)
        : [],
    [exercise],
  );

  const submit = () => {
    let correct = false;
    let answer: unknown = null;

    if (exercise.type === "multiple-choice") {
      answer = choice;
      correct = choice === toPlainText(exercise.correctAnswer);
    } else if (exercise.type === "true-false") {
      answer = choice;
      correct = choice === exercise.correctAnswer;
    } else if (exercise.type === "fill-blank") {
      answer = text;
      const accepted = [exercise.correctAnswer, ...(exercise.acceptedAnswers ?? [])];
      correct = accepted.some((item) => normalize(item) === normalize(text));
    } else if (exercise.type === "order-sentence") {
      answer = ordered.map((item) => item.value);
      correct =
        ordered.length === exercise.correctOrder.length &&
        ordered.every((item, index) => item.value === toPlainText(exercise.correctOrder[index]));
    } else if (exercise.type === "matching") {
      answer = matches;
      correct = exercise.pairs.every(
        (pair) => matches[toPlainText(pair.left)] === toPlainText(pair.right),
      );
    }

    setResult(correct);
    onSubmit({ correct, answer });
  };

  const canSubmit =
    exercise.type === "multiple-choice" || exercise.type === "true-false"
      ? choice !== null
      : exercise.type === "fill-blank"
        ? text.trim().length > 0
        : exercise.type === "order-sentence"
          ? ordered.length === exercise.parts.length
          : exercise.pairs.every((pair) => matches[toPlainText(pair.left)]);

  const selectOrderPart = (value: string, index: number) => {
    if (result !== null || ordered.some((item) => item.index === index)) return;
    setOrdered((current) => [...current, { value, index }]);
  };

  const removeOrderPart = (index: number) => {
    if (result !== null) return;
    setOrdered((current) => current.filter((item) => item.index !== index));
  };

  const correctAnswerView = () => {
    if (exercise.type === "true-false") {
      return exercise.correctAnswer ? "正确" : "错误";
    }

    if (exercise.type === "order-sentence") {
      return (
        <>
          {exercise.correctOrder.map((part, index) => (
            <span className="correct-answer-part" key={`${toPlainText(part)}-${index}`}>
              <JapaneseText value={part} />
            </span>
          ))}
        </>
      );
    }

    if (exercise.type === "multiple-choice") {
      return <JapaneseText value={exercise.correctAnswer} />;
    }

    if (exercise.type === "fill-blank") {
      return exercise.correctAnswer;
    }

    return null;
  };

  return (
    <div className="exercise-renderer">
      <div className="exercise-type-label">
        {exercise.type === "multiple-choice" && "选择题"}
        {exercise.type === "fill-blank" && "填空题"}
        {exercise.type === "order-sentence" && "句子排序"}
        {exercise.type === "matching" && "匹配题"}
        {exercise.type === "true-false" && "判断题"}
      </div>
      <h2><JapaneseText value={exercise.prompt} /></h2>

      {exercise.type === "multiple-choice" && (
        <div className="choice-list">
          {exercise.options.map((option, index) => {
            const optionText = toPlainText(option);
            const correctText = toPlainText(exercise.correctAnswer);
            return (
            <button
              key={optionText}
              disabled={result !== null}
              className={[
                choice === optionText ? "selected" : "",
                result !== null && optionText === correctText ? "correct" : "",
                result === false && choice === optionText ? "wrong" : "",
              ].join(" ")}
              onClick={() => setChoice(optionText)}
            >
              <span className="choice-letter">{String.fromCharCode(65 + index)}</span><JapaneseText value={option} />
            </button>
          )})}
        </div>
      )}

      {exercise.type === "true-false" && (
        <>
          <div className="statement-box"><JapaneseText value={exercise.statement} /></div>
          <div className="boolean-options">
            {[true, false].map((value) => (
              <button
                key={String(value)}
                disabled={result !== null}
                className={[
                  choice === value ? "selected" : "",
                  result !== null && value === exercise.correctAnswer ? "correct" : "",
                  result === false && choice === value ? "wrong" : "",
                ].join(" ")}
                onClick={() => setChoice(value)}
              >
                {value ? <CheckIcon /> : <CloseIcon />}
                {value ? "正确" : "错误"}
              </button>
            ))}
          </div>
        </>
      )}

      {exercise.type === "fill-blank" && (
        <div className="fill-area">
          <input
            value={text}
            disabled={result !== null}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && canSubmit && result === null) submit();
            }}
            placeholder="在这里输入答案"
            autoComplete="off"
          />
          {exercise.hint && <span>提示：<JapaneseText value={exercise.hint} /></span>}
        </div>
      )}

      {exercise.type === "order-sentence" && (
        <div className="order-area">
          <div className="order-answer">
            {ordered.length ? ordered.map((item) => (
              <button key={item.index} onClick={() => removeOrderPart(item.index)}>{item.value}</button>
            )) : <span>依次点击下方词块组成句子</span>}
          </div>
          <div className="order-parts">
            {exercise.parts.map((part, index) => {
              const partText = toPlainText(part);
              return (
              <button
                key={`${partText}-${index}`}
                disabled={result !== null || ordered.some((item) => item.index === index)}
                onClick={() => selectOrderPart(partText, index)}
              >
                <JapaneseText value={part} />
              </button>
            )})}
          </div>
        </div>
      )}

      {exercise.type === "matching" && (
        <div className="matching-area">
          {exercise.pairs.map((pair) => (
            <div className="matching-row" key={toPlainText(pair.left)}>
              <strong><JapaneseText value={pair.left} /></strong>
              <span>⇄</span>
              <select
                value={matches[toPlainText(pair.left)] ?? ""}
                disabled={result !== null}
                onChange={(event) => setMatches((current) => ({ ...current, [toPlainText(pair.left)]: event.target.value }))}
              >
                <option value="">选择对应项</option>
                {matchingOptions.map((option) => {
                  const optionText = toPlainText(option);
                  return <option value={optionText} key={optionText}>{optionText}</option>;
                })}
              </select>
            </div>
          ))}
        </div>
      )}

      {result === null ? (
        <button className="button button-primary submit-answer" disabled={!canSubmit} onClick={submit}>提交答案</button>
      ) : (
        <div className={`answer-feedback ${result ? "success" : "error"}`}>
          <span className="feedback-icon">{result ? <CheckIcon /> : <CloseIcon />}</span>
          <div>
            <strong>{result ? "回答正确" : "再看一下这个要点"}</strong>
            <p><JapaneseText value={exercise.explanation} /></p>
            {!result && exercise.type !== "matching" && (
              <span className="correct-answer">
                正确答案：
                {correctAnswerView()}
              </span>
            )}
            {!result && exercise.type === "matching" && (
              <span className="correct-answer">
                正确匹配：
                {exercise.pairs.map((pair, index) => (
                  <span className="correct-answer-part" key={toPlainText(pair.left)}>
                    <JapaneseText value={pair.left} /> → <JapaneseText value={pair.right} />
                    {index < exercise.pairs.length - 1 ? "；" : ""}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
