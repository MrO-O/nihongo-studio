import type {
  Exercise,
  JapaneseTextContent,
  JapaneseTextSegment,
  Lesson,
} from "../types";

interface ManualReading {
  text: string;
  reading: string;
  meaning?: string;
}

const manualReadings: ManualReading[] = [
  { text: "ありがとうございます", reading: "ありがとうございます", meaning: "非常感谢" },
  { text: "おはようございます", reading: "おはようございます", meaning: "早上好（礼貌）" },
  { text: "ではありません", reading: "ではありません", meaning: "不是" },
  { text: "入りましょう", reading: "はいりましょう", meaning: "进去吧" },
  { text: "手伝って", reading: "てつだって", meaning: "帮忙" },
  { text: "違います", reading: "ちがいます", meaning: "不是；不对" },
  { text: "日本語", reading: "にほんご", meaning: "日语" },
  { text: "山田", reading: "やまだ", meaning: "山田（姓氏）" },
  { text: "今日", reading: "きょう", meaning: "今天" },
  { text: "早い", reading: "はやい", meaning: "早的" },
  { text: "涼しい", reading: "すずしい", meaning: "凉快的" },
  { text: "明日", reading: "あした", meaning: "明天" },
  { text: "名前", reading: "なまえ", meaning: "名字" },
  { text: "言います", reading: "いいます", meaning: "说" },
  { text: "聞きます", reading: "ききます", meaning: "听" },
  { text: "切手", reading: "きって", meaning: "邮票" },
  { text: "音", reading: "おと", meaning: "声音" },

  { text: "留学生", reading: "りゅうがくせい", meaning: "留学生" },
  { text: "会社員", reading: "かいしゃいん", meaning: "公司职员" },
  { text: "桜大学", reading: "さくらだいがく", meaning: "樱大学" },
  { text: "大学生", reading: "だいがくせい", meaning: "大学生" },
  { text: "情報", reading: "じょうほう", meaning: "信息" },
  { text: "デザイン専攻", reading: "デザインせんこう", meaning: "设计专业" },
  { text: "田中", reading: "たなか", meaning: "田中（姓氏）" },
  { text: "佐藤", reading: "さとう", meaning: "佐藤（姓氏）" },
  { text: "木村", reading: "きむら", meaning: "木村（姓氏）" },
  { text: "高橋", reading: "たかはし", meaning: "高桥（姓氏）" },
  { text: "森美咲", reading: "もりみさき", meaning: "森美咲（姓名）" },
  { text: "趙浩然", reading: "ちょうこうぜん", meaning: "赵浩然（姓名）" },
  { text: "趙", reading: "ちょう", meaning: "赵（姓氏）" },
  { text: "陳", reading: "ちん", meaning: "陈（姓氏）" },
  { text: "周", reading: "しゅう", meaning: "周（姓氏）" },
  { text: "王", reading: "おう", meaning: "王（姓氏）" },
  { text: "林", reading: "はやし", meaning: "林（姓氏）" },
  { text: "建築", reading: "けんちく", meaning: "建筑" },
  { text: "専攻", reading: "せんこう", meaning: "专业" },
  { text: "中国", reading: "ちゅうごく", meaning: "中国" },
  { text: "日本", reading: "にほん", meaning: "日本" },
  { text: "地域", reading: "ちいき", meaning: "地区" },
  { text: "友達", reading: "ともだち", meaning: "朋友" },
  { text: "学生", reading: "がくせい", meaning: "学生" },
  { text: "先生", reading: "せんせい", meaning: "老师" },
  { text: "大学", reading: "だいがく", meaning: "大学" },
  { text: "教室", reading: "きょうしつ", meaning: "教室" },
  { text: "妹", reading: "いもうと", meaning: "妹妹" },
  { text: "父", reading: "ちち", meaning: "父亲" },
  { text: "私", reading: "わたし", meaning: "我" },
  { text: "李", reading: "り", meaning: "李（姓氏）" },
  { text: "冬", reading: "ふゆ", meaning: "冬天" },

  { text: "案内板", reading: "あんないばん", meaning: "指示牌" },
  { text: "忘れ物", reading: "わすれもの", meaning: "遗失物品" },
  { text: "旅行", reading: "りょこう", meaning: "旅行" },
  { text: "写真", reading: "しゃしん", meaning: "照片" },
  { text: "辞書", reading: "じしょ", meaning: "词典" },
  { text: "青い", reading: "あおい", meaning: "蓝色的" },
  { text: "軽い", reading: "かるい", meaning: "轻的" },
  { text: "丈夫", reading: "じょうぶ", meaning: "结实的" },
  { text: "祖父", reading: "そふ", meaning: "祖父" },
  { text: "建物", reading: "たてもの", meaning: "建筑物" },
  { text: "図書館", reading: "としょかん", meaning: "图书馆" },
  { text: "地図", reading: "ちず", meaning: "地图" },
  { text: "店員", reading: "てんいん", meaning: "店员" },
  { text: "小さい", reading: "ちいさい", meaning: "小的" },
  { text: "新しい", reading: "あたらしい", meaning: "新的" },
  { text: "京都", reading: "きょうと", meaning: "京都" },
  { text: "時計", reading: "とけい", meaning: "钟；表" },
  { text: "誰", reading: "だれ", meaning: "谁" },
  { text: "何", reading: "なん", meaning: "什么" },
  { text: "鞄", reading: "かばん", meaning: "包" },
  { text: "傘", reading: "かさ", meaning: "伞" },
  { text: "鍵", reading: "かぎ", meaning: "钥匙" },
  { text: "机", reading: "つくえ", meaning: "桌子" },
  { text: "上", reading: "うえ", meaning: "上面" },
  { text: "本", reading: "ほん", meaning: "书" },
  { text: "駅", reading: "えき", meaning: "车站" },

  { text: "郵便局", reading: "ゆうびんきょく", meaning: "邮局" },
  { text: "休憩室", reading: "きゅうけいしつ", meaning: "休息室" },
  { text: "訪問者", reading: "ほうもんしゃ", meaning: "访客" },
  { text: "市民", reading: "しみん", meaning: "市民" },
  { text: "二階", reading: "にかい", meaning: "二楼" },
  { text: "三階", reading: "さんがい", meaning: "三楼" },
  { text: "一階", reading: "いっかい", meaning: "一楼" },
  { text: "階段", reading: "かいだん", meaning: "楼梯" },
  { text: "受付", reading: "うけつけ", meaning: "接待处" },
  { text: "食堂", reading: "しょくどう", meaning: "食堂" },
  { text: "入口", reading: "いりぐち", meaning: "入口" },
  { text: "出口", reading: "でぐち", meaning: "出口" },
  { text: "銀行", reading: "ぎんこう", meaning: "银行" },
  { text: "隣", reading: "となり", meaning: "旁边" },
  { text: "前", reading: "まえ", meaning: "前面" },
  { text: "中", reading: "なか", meaning: "里面" },
  { text: "近く", reading: "ちかく", meaning: "附近" },
  { text: "小さい書店", reading: "ちいさいしょてん", meaning: "小书店" },
  { text: "書店", reading: "しょてん", meaning: "书店" },
  { text: "混みます", reading: "こみます", meaning: "拥挤" },
  { text: "庭", reading: "にわ", meaning: "院子" },
  { text: "猫", reading: "ねこ", meaning: "猫" },
  { text: "道", reading: "みち", meaning: "道路" },
  { text: "先", reading: "さき", meaning: "前方" },
  { text: "物", reading: "もの", meaning: "物品" },
  { text: "人", reading: "ひと", meaning: "人" },

  { text: "土曜日", reading: "どようび", meaning: "星期六" },
  { text: "昼ご飯", reading: "ひるごはん", meaning: "午饭" },
  { text: "大丈夫", reading: "だいじょうぶ", meaning: "没问题" },
  { text: "何時", reading: "なんじ", meaning: "几点" },
  { text: "午前", reading: "ごぜん", meaning: "上午" },
  { text: "午後", reading: "ごご", meaning: "下午" },
  { text: "九時半", reading: "くじはん", meaning: "九点半" },
  { text: "一時半", reading: "いちじはん", meaning: "一点半" },
  { text: "二時半", reading: "にじはん", meaning: "两点半" },
  { text: "八時十五分", reading: "はちじじゅうごふん", meaning: "八点十五分" },
  { text: "十時十五分", reading: "じゅうじじゅうごふん", meaning: "十点十五分" },
  { text: "午前九時", reading: "ごぜんくじ", meaning: "上午九点" },
  { text: "午前十時", reading: "ごぜんじゅうじ", meaning: "上午十点" },
  { text: "午後二時半", reading: "ごごにじはん", meaning: "下午两点半" },
  { text: "午後三時", reading: "ごごさんじ", meaning: "下午三点" },
  { text: "午後七時", reading: "ごごしちじ", meaning: "下午七点" },
  { text: "十二時", reading: "じゅうにじ", meaning: "十二点" },
  { text: "十一時", reading: "じゅういちじ", meaning: "十一点" },
  { text: "十時半", reading: "じゅうじはん", meaning: "十点半" },
  { text: "十時", reading: "じゅうじ", meaning: "十点" },
  { text: "九時", reading: "くじ", meaning: "九点" },
  { text: "八時", reading: "はちじ", meaning: "八点" },
  { text: "七時", reading: "しちじ", meaning: "七点" },
  { text: "六時", reading: "ろくじ", meaning: "六点" },
  { text: "三時", reading: "さんじ", meaning: "三点" },
  { text: "四点", reading: "よじ", meaning: "四点" },
  { text: "三十分", reading: "さんじゅっぷん", meaning: "三十分钟" },
  { text: "十五分", reading: "じゅうごふん", meaning: "十五分钟" },
  { text: "五分", reading: "ごふん", meaning: "五分钟" },
  { text: "一時間", reading: "いちじかん", meaning: "一小时" },
  { text: "時間", reading: "じかん", meaning: "时间" },
  { text: "会議", reading: "かいぎ", meaning: "会议" },
  { text: "授業", reading: "じゅぎょう", meaning: "课" },
  { text: "約束", reading: "やくそく", meaning: "约定" },
  { text: "勉強", reading: "べんきょう", meaning: "学习" },
  { text: "映画", reading: "えいが", meaning: "电影" },
  { text: "仕事", reading: "しごと", meaning: "工作" },
  { text: "起きます", reading: "おきます", meaning: "起床" },
  { text: "読みます", reading: "よみます", meaning: "阅读" },
  { text: "食べましょう", reading: "たべましょう", meaning: "吃吧" },
  { text: "休み", reading: "やすみ", meaning: "休息" },
  { text: "昼休み", reading: "ひるやすみ", meaning: "午休" },
  { text: "朝", reading: "あさ", meaning: "早晨" },
  { text: "昼", reading: "ひる", meaning: "中午；白天" },
  { text: "夜", reading: "よる", meaning: "夜晚" },
  { text: "半", reading: "はん", meaning: "半" },
  { text: "分", reading: "ふん", meaning: "分钟" },
  { text: "時", reading: "じ", meaning: "点；时" },
  { text: "今", reading: "いま", meaning: "现在" },
];

const sortedReadings = [...manualReadings].sort(
  (a, b) => b.text.length - a.text.length,
);

function hasKana(value: string) {
  return /[\u3040-\u30ff]/.test(value);
}

function shouldAnnotate(text: string, start: number, end: number, reading: ManualReading) {
  if (text === reading.text) return true;
  if (reading.text.length > 1) return true;

  const nearby = text.slice(Math.max(0, start - 2), Math.min(text.length, end + 2));
  return hasKana(nearby) || /[「」（）・、。]/.test(nearby);
}

export function annotateJapanese(value: JapaneseTextContent): JapaneseTextContent {
  if (typeof value !== "string") return value;

  const segments: JapaneseTextSegment[] = [];
  let index = 0;

  while (index < value.length) {
    const match = sortedReadings.find((entry) => {
      if (!value.startsWith(entry.text, index)) return false;
      return shouldAnnotate(value, index, index + entry.text.length, entry);
    });

    if (match) {
      segments.push({
        text: match.text,
        reading: match.reading,
        meaning: match.meaning,
      });
      index += match.text.length;
    } else {
      const previous = segments[segments.length - 1];
      if (previous && !previous.reading && !previous.meaning) {
        previous.text += value[index];
      } else {
        segments.push({ text: value[index] });
      }
      index += 1;
    }
  }

  return segments.some((segment) => segment.reading || segment.meaning) ? segments : value;
}

function annotateExercise(exercise: Exercise): Exercise {
  const base = {
    ...exercise,
    prompt: annotateJapanese(exercise.prompt),
    explanation: annotateJapanese(exercise.explanation),
  };

  if (exercise.type === "multiple-choice") {
    return {
      ...base,
      type: exercise.type,
      options: exercise.options.map(annotateJapanese),
      correctAnswer: annotateJapanese(exercise.correctAnswer),
    };
  }

  if (exercise.type === "fill-blank") {
    return {
      ...base,
      type: exercise.type,
      correctAnswer: exercise.correctAnswer,
      acceptedAnswers: exercise.acceptedAnswers,
      hint: exercise.hint ? annotateJapanese(exercise.hint) : undefined,
    };
  }

  if (exercise.type === "order-sentence") {
    return {
      ...base,
      type: exercise.type,
      parts: exercise.parts.map(annotateJapanese),
      correctOrder: exercise.correctOrder.map(annotateJapanese),
    };
  }

  if (exercise.type === "matching") {
    return {
      ...base,
      type: exercise.type,
      pairs: exercise.pairs.map((pair) => ({
        left: annotateJapanese(pair.left),
        right: annotateJapanese(pair.right),
      })),
    };
  }

  return {
    ...base,
    type: exercise.type,
    statement: annotateJapanese(exercise.statement),
    correctAnswer: exercise.correctAnswer,
  };
}

export function withManualFurigana(lesson: Lesson): Lesson {
  return {
    ...lesson,
    vocabulary: lesson.vocabulary.map((word) => ({
      ...word,
      japanese: annotateJapanese(word.japanese),
      example: annotateJapanese(word.example),
    })),
    grammar: lesson.grammar.map((point) => ({
      ...point,
      structure: annotateJapanese(point.structure),
      examples: point.examples.map((example) => ({
        ...example,
        japanese: annotateJapanese(example.japanese),
      })),
    })),
    examples: lesson.examples.map((example) => ({
      ...example,
      japanese: annotateJapanese(example.japanese),
    })),
    reading: {
      ...lesson.reading,
      lines: lesson.reading.lines.map((line) => ({
        ...line,
        japanese: annotateJapanese(line.japanese),
      })),
    },
    exercises: lesson.exercises.map(annotateExercise),
  };
}
