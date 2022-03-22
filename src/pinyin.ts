import PinyinBase, { getPinyinInstance } from "./PinyinBase";
import { segment } from "./segment";
import type { IPinyinSegment } from "./declare";

export class Pinyin extends PinyinBase {
  segment(hans: string, segmentType?: IPinyinSegment): string[] {
    return segment(hans, segmentType);
  }
}

export const pinyin = getPinyinInstance(new Pinyin());
export default pinyin;

export const compare = pinyin.compare;
export { compact } from "./util";
