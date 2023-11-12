import { ENUM_PINYIN_STYLE, ENUM_PINYIN_MODE } from "./constant";

export interface IPinyin {
  (han: string, options?: IPinyinOptions): string[][];

  compare: (a: string, b: string) => number;
  compact: (arr: string[][]) => string[][];

  // pinyin styles: 兼容 v2.x 中的属性透出
  STYLE_TONE: ENUM_PINYIN_STYLE;
  STYLE_TONE2: ENUM_PINYIN_STYLE;
  STYLE_TO3NE: ENUM_PINYIN_STYLE;
  STYLE_NORMAL: ENUM_PINYIN_STYLE;
  STYLE_INITIALS: ENUM_PINYIN_STYLE;
  STYLE_FIRST_LETTER: ENUM_PINYIN_STYLE;
  STYLE_PASSPORT: ENUM_PINYIN_STYLE;

  // pinyin mode: 兼容 v2.x 中的属性透出
  MODE_NORMAL: ENUM_PINYIN_MODE;
  MODE_SURNAME: ENUM_PINYIN_MODE;
  // MODE_PLACENAME: ENUM_PINYIN_MODE;
}

export type IPinyinStyle =
  ENUM_PINYIN_STYLE |
  "normal" | "tone" | "tone2" | "to3ne" | "initials" | "first_letter" | "passport" | // 推荐使用小写，和输出的拼音一致
  "NORMAL" | "TONE" | "TONE2" | "TO3NE" | "INITIALS" | "FIRST_LETTER" | "PASSPORT" | // 方便老版本迁移
  0        | 1      | 2       | 5       | 3          | 4;               // 兼容老版本

// 拼音模式。
//
// - NORMAL: 普通模式
// - SURNAME: 姓氏模式，优先使用姓氏的拼音。
// - TODO: PLACENAME: 地名模式，优先使用地名拼音。
export type IPinyinMode =
  ENUM_PINYIN_MODE |
  "normal" | "surname" |
  "NORMAL" | "SURNAME";

export type IPinyinSegment = "nodejieba" | "segmentit" | "@node-rs/jieba" | "Intl.Segmenter";

// 程序内部使用的强类型，所有字段都有合法值类型。
export interface IPinyinAllOptions {
  style: ENUM_PINYIN_STYLE; // 拼音输出形式
  mode: ENUM_PINYIN_MODE, // 拼音模式
  // 指定分词库。不指定则表示不开启分词。
  segment?: IPinyinSegment;
  // 是否返回多音字
  heteronym: boolean;
  // 是否分组词组拼音
  group: boolean;
  // 是否以多音字的不同组合形式，“紧凑”形式连贯的返回不同可能组合形式。
  // 例如：“你好吗”
  // compact=false: [[nǐ], [hǎo,hào], [ma,má,mǎ]]
  // compact=true: [
  //   [nǐ,hǎo,ma], [nǐ,hǎo,má], [nǐ,hǎo,mǎ],
  //   [nǐ,hào,ma], [nǐ,hào,má], [nǐ,hào,mǎ],
  // ]
  compact: boolean;
}

// 给到用户的类型，大都可选项，有默认值，且形式友好。
export interface IPinyinOptions {
  style?: IPinyinStyle; // 拼音输出形式
  mode?: IPinyinMode, // 拼音模式
  // 指定分词库。
  // 为了兼容老版本，可以使用 boolean 类型指定是否开启分词，默认开启。
  segment?: IPinyinSegment | boolean;
  // 是否返回多音字
  heteronym?: boolean;
  // 是否分组词组拼音
  group?: boolean;
  compact?: boolean;
}
