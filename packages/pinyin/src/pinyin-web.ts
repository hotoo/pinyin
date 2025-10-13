import PinyinBase, { getPinyinInstance } from "./PinyinBase";

export class Pinyin extends PinyinBase {
}

export const pinyin = getPinyinInstance(new Pinyin());
export default pinyin;

export const compare = pinyin.compare;
export { compact } from "./util";
