import { useState } from "react";
import type { VocabularyItem } from "../types";
import { CheckIcon, HeartIcon, ReviewIcon } from "./Icons";
import { useLearning } from "../store/LearningContext";
import { JapaneseText } from "./JapaneseText";

export function VocabularySection({ words }: { words: VocabularyItem[] }) {
  const [showKana, setShowKana] = useState(true);
  const [showMeaning, setShowMeaning] = useState(true);
  const { state, setWordStatus, toggleFavorite } = useLearning();

  return (
    <section className="lesson-section">
      <div className="section-heading lesson-section-heading">
        <div>
          <span className="eyebrow">VOCABULARY</span>
          <h2>核心单词</h2>
        </div>
        <div className="display-toggles">
          <label><input type="checkbox" checked={showKana} onChange={(event) => setShowKana(event.target.checked)} /> 显示假名</label>
          <label><input type="checkbox" checked={showMeaning} onChange={(event) => setShowMeaning(event.target.checked)} /> 显示中文</label>
        </div>
      </div>
      <div className="vocabulary-grid">
        {words.map((word) => {
          const status = state.vocabularyStatus[word.id];
          const favorite = state.favoriteWordIds.includes(word.id);
          return (
            <article className="word-card" key={word.id}>
              <div className="word-card-top">
                <span className="part-of-speech">{word.partOfSpeech}</span>
                <button
                  className={`icon-button favorite-button ${favorite ? "active" : ""}`}
                  onClick={() => toggleFavorite(word.id)}
                  aria-label={favorite ? "取消收藏" : "收藏单词"}
                >
                  <HeartIcon fill={favorite ? "currentColor" : "none"} />
                </button>
              </div>
              <h3><JapaneseText value={word.japanese} /></h3>
              <div className={`word-kana ${showKana ? "" : "masked"}`}>{showKana ? word.kana : "••••"}</div>
              <div className={`word-meaning ${showMeaning ? "" : "masked"}`}>{showMeaning ? word.meaning : "点击上方开关显示"}</div>
              <div className="word-example">
                <p><JapaneseText value={word.example} /></p>
                {showMeaning && <span>{word.exampleMeaning}</span>}
              </div>
              <div className="word-actions">
                <button
                  className={status === "mastered" ? "selected mastered" : ""}
                  onClick={() => setWordStatus(word.id, status === "mastered" ? undefined : "mastered")}
                >
                  <CheckIcon /> 已掌握
                </button>
                <button
                  className={status === "review" ? "selected review" : ""}
                  onClick={() => setWordStatus(word.id, status === "review" ? undefined : "review")}
                >
                  <ReviewIcon /> 待复习
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
