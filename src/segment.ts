import nodejieba from "nodejieba";
import { load, cut /*, tag */ } from "@node-rs/jieba";
// @ts-ignore
import { Segment, useDefault } from "segmentit";
import type { IPinyinSegment } from "./declare";

const nodeRsJiebaLoaded = false; // @node-rs/jieba 加载词典。
let segmentit: any; // segmentit 加载词典。

/**
 * TODO: 分词并带词性信息，需要调整 segment_pinyin 方法。
 * 分词并标注词性。
 */
export function segment(hans: string, segment?: IPinyinSegment): string[] {
  // @node-rs/jieba (Rust)
  if (segment === "@node-rs/jieba") {
    if (!nodeRsJiebaLoaded) {
      load();
    }
    return cut(hans, false);
    // return tag(hans);
  }

  // segmentit (Node.js)
  if (segment === "segmentit") {
    if (!segmentit) {
      segmentit = useDefault(new Segment());
    }
    return segmentit.doSegment(hans, {
      simple: true,
    });
  }

  // 默认使用 nodejieba (C++)
  // return nodejieba.tag(hans);
  // nodejieba 定义的类型返回值错误，先忽略。
  // @ts-ignore
  return nodejieba.cutSmall(hans, 4);
}
