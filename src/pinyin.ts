import PinyinBase from "./PinyinBase";
import { segment } from "./segment";
import type { IPinyin, IPinyinSegment } from "./declare";

export class Pinyin extends PinyinBase {
  segment(hans: string, segmentType?: IPinyinSegment): string[] {
    return segment(hans, segmentType);
  }
}

const py = new Pinyin();
export const pinyin = <IPinyin>py.pinyin.bind(py);
pinyin.compare = py.compare.bind(py);
pinyin.compact = py.compact.bind(py);
export default pinyin;

export const compare = pinyin.compare;

export { compact } from "./util";
