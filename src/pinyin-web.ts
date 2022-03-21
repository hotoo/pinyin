import PinyinBase from "./PinyinBase";
import type { IPinyin } from "./declare";

export class Pinyin extends PinyinBase {
}

const py = new Pinyin();
export const pinyin = <IPinyin>py.pinyin.bind(py);
pinyin.compare = py.compare.bind(py);
pinyin.compact = py.compact.bind(py);
export default pinyin;

export const compare = pinyin.compare;

export { compact } from "./util";
