import { PINYIN_STYLE } from "./constant";

export type IPinyinSegment = "nodejieba" | "segmentit" | "@node-rs/jieba";

export interface IPinyinOptions {
  style: PINYIN_STYLE; // 拼音模式
  // 指定分词库。
  // 为了兼容老版本，可以使用 boolean 类型指定是否开启分词，默认开启。
  segment: IPinyinSegment | boolean;
  // 是否返回多音字
  heteronym: boolean;
  // 是否分组词组拼音
  group: boolean;
}

export interface IPinyinOptionsUser {
  style?: PINYIN_STYLE; // 拼音模式
  // 指定分词库。
  // 为了兼容老版本，可以使用 boolean 类型指定是否开启分词，默认开启。
  segment?: IPinyinSegment | boolean;
  // 是否返回多音字
  heteronym?: boolean;
  // 是否分组词组拼音
  group?: boolean;
}
