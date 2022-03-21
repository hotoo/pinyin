import { segment } from "../src/segment-web";

describe("segment-web", function() {
  it("segment()", function() {
    expect(segment("我要排序")).toEqual(["我要排序"]);
    expect(segment("中文汉字")).toEqual(["中文汉字"]);
  });

  it("segment(segmentit)", function() {
    expect(segment("我要排序", "segmentit")).toEqual(["我", "要", "排序"]);
    expect(segment("中文汉字", "segmentit")).toEqual(["中文", "汉字"]);
  });
});
