import nodejieba from "nodejieba";
// import { load, tag } from '@node-rs/jieba';
// @ts-ignore
// import { Segment, useDefault } from 'segmentit';
import type { IPinyinSegment } from "./declare";

// let nodeRsJiebaLoaded = false; // @node-rs/jieba 加载词典。
// let segmentit; // segmentit 加载词典。

/**
 * TODO: 分词并带词性信息，需要调整 segment_pinyin 方法。
 * 分词并标注词性。
 */
export function segment(hans: string, segment?: IPinyinSegment): string[] {
  // @node-rs/jieba (Rust)
  // if (segment === "@node-rs/jieba") {
  //   if (!nodeRsJiebaLoaded) {
  //     load();
  //   }
  //   return tag(hans);
  // }

  // segmentit (Node.js)
  // if (segment === "segmentit") {
  //   if (!segmentit) {
  //     segmentit = useDefault(new Segment());
  //   }
  //   return segmentit.doSegment(hans);
  // }

  // 默认使用 nodejieba (C++)
  // return nodejieba.tag(hans);
  return nodejieba.cutSmall(hans, 4);
}
