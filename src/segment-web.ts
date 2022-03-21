// @ts-ignore
import { Segment, useDefault } from "segmentit";
import type { IPinyinSegment } from "./declare";

let segmentit: any; // segmentit 加载词典。

/**
 * TODO: 分词并带词性信息，需要调整 segment_pinyin 方法。
 * 分词并标注词性。
 */
export function segment(hans: string, segment?: IPinyinSegment): string[] {
  // segmentit (Node.js)
  if (segment === "segmentit") {
    if (!segmentit) {
      segmentit = useDefault(new Segment());
    }
    return segmentit.doSegment(hans, {
      simple: true,
    });
  }

  return [hans];
}
