import { segment } from "../src/segment-web";

describe("segment-web", function() {
  it("segment()", function() {
    expect(segment("我要排序")).toEqual(["我要排序"]);
    expect(segment("中文汉字")).toEqual(["中文汉字"]);
    expect(segment("我来到北京清华大学")).toEqual(["我来到北京清华大学"]);
    expect(segment("每股24.67美元的确定性协议")).toEqual(["每股24.67美元的确定性协议"]);
  });

  it("segment(segmentit)", function() {
    expect(segment("我要排序", "segmentit")).toEqual(["我", "要", "排序"]);
    expect(segment("中文汉字", "segmentit")).toEqual(["中文", "汉字"]);
    expect(segment("我来到北京清华大学", "segmentit")).toEqual(["我", "来到", "北京", "清华大学"]);
    expect(segment("每股24.67美元的确定性协议", "segmentit")).toEqual(["每股", "24.67", "美元", "的确", "定性", "协议"]);
  });

  it("segment(Intl.Segmenter)", function() {
    expect(segment("我要排序", "Intl.Segmenter")).toEqual(["我要", "排序"]);
    expect(segment("中文汉字", "Intl.Segmenter")).toEqual(["中文", "汉字"]);
    expect(segment("我来到北京清华大学", "Intl.Segmenter")).toEqual(["我", "来到", "北京", "清华大学"]);
    expect(segment("每股24.67美元的确定性协议", "Intl.Segmenter")).toEqual(["每股", "24.67", "美元", "的", "确定", "性", "协议"]);
  });
});
