# Nihongo Studio Content Guide

This guide explains how to add course content without changing the app architecture.

## Lesson Shape

Add lessons in `src/content/unitX.ts` and export a `Lesson`.

Required fields:

```ts
export const unitX: Lesson = {
  id: "unit-x",
  unit: x,
  title: "...",
  subtitle: "...",
  description: "...",
  duration: "约 45 分钟",
  accent: "#hex",
  goals: [],
  vocabulary: [],
  grammar: [],
  examples: [],
  reading: { title: "...", intro: "...", lines: [] },
  exercises: [],
};
```

Then import it in `src/content/index.ts` and add it to `lessons`.

## Furigana Text

Use `JapaneseTextSegment[]` for Japanese text containing kanji.

```ts
[
  { text: "図書館", reading: "としょかん", meaning: "图书馆" },
  { text: "へ" },
  { text: "行きます", reading: "いきます", meaning: "去" },
  { text: "。" }
]
```

The project provides helpers:

```ts
import { jp, p, r } from "./text";

jp(
  r("図書館", "としょかん", "图书馆"),
  p("へ"),
  r("行きます", "いきます", "去"),
  p("。"),
);
```

Rules:

- Every Japanese kanji word needs `reading`.
- `meaning` is optional but recommended for useful words.
- Do not put kanji-bearing Japanese text inside `p(...)`.
- Do not use Chinese pronunciation or pinyin in `reading`.
- If unsure about a reading, rewrite with a simpler known expression.

## Vocabulary

Recommended per lesson: 10 to 14 items.

Each item should include:

- `japanese`: Japanese word or phrase, segmented if it has kanji.
- `kana`: full kana reading.
- `meaning`: concise Chinese meaning.
- `partOfSpeech`: noun, verb, adjective, expression, etc.
- `example`: short original sentence with furigana.
- `exampleMeaning`: Chinese translation.

Prefer common beginner words that support the lesson topic.

## Grammar

Recommended per lesson: 2 to 4 points.

Each grammar point should include:

- `title`: short Chinese label.
- `structure`: pattern, segmented if Japanese contains kanji.
- `explanation`: short Chinese explanation.
- `usage`: practical usage note.
- `examples`: 2 to 3 original examples.

Keep explanations concise. Avoid introducing advanced side topics.

## Examples

Recommended per lesson: 5 to 8 examples.

Examples should:

- Use vocabulary from the current or previous lessons.
- Be natural and short.
- Include furigana for kanji.
- Avoid risky domains such as medical, legal, financial, or investment advice.

## Dialogue / Reading

Each lesson should include one short original dialogue or short text.

For each line:

- `speaker` is optional.
- `japanese` should use segments when kanji appears.
- `meaning` should be a clear Chinese translation.
- `keywords` should list useful terms already present in the line.

Dialogue should sound like simple real learner material, not a list of grammar points.

## Exercises

Recommended per lesson: 10 to 14 exercises.

Allowed types:

- `multiple-choice`
- `fill-blank`
- `order-sentence`
- `matching`
- `true-false`

Exercise rules:

- Keep all prompts and options original.
- Use `JapaneseTextSegment[]` for Japanese with kanji in prompts, options, explanations, and correct answers.
- For `fill-blank`, keep `correctAnswer` simple text because it is typed by the learner.
- Use all or most supported types in each lesson.
- Explanations should be short and teach the key point.

## Content Quality

- Stay beginner-friendly and cumulative.
- Prefer clear, common words over rare kanji or formal expressions.
- Do not overload one lesson with too many new patterns.
- Make Chinese explanations accurate but brief.
- Keep Japanese sentences natural.
- Avoid childish filler and avoid advanced grammar jumps.

## Copyright

- Do not copy textbook dialogues, exercises, word lists, layout, recordings, images, or lesson order in a recognizable way.
- Use only original examples and dialogues.
- It is fine to follow a general learning flow: vocabulary, grammar, examples, dialogue, exercises, review.

## Checklist Before Committing

- Lesson has 10 to 14 vocabulary items.
- Lesson has 2 to 4 grammar points.
- Lesson has 5 to 8 examples.
- Lesson has one original dialogue or reading.
- Lesson has 10 to 14 exercises.
- All Japanese kanji text has furigana.
- No uncertain readings remain.
- No copied textbook content.
- `src/content/index.ts` imports the new unit.
- `npm run build` passes.
