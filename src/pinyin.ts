import PinyinBase from "./PinyinBase";
import { segment } from "./segment";
import type { IPinyinSegment } from "./declare";

export class Pinyin extends PinyinBase {
  segment(hans: string, segmentType?: IPinyinSegment): string[] {
    return segment(hans, segmentType);
  }
}

const py = new Pinyin();
export default py.pinyin.bind(py);
export const pinyin = py.pinyin.bind(py);
export const compare = py.compare.bind(py);

export { compact } from "./util";
