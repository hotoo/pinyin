import {
  combo2array,
  combo,
  compact2array,
  compact,
} from "../src/util";

describe("test/util.test.js", function() {
  describe("combo2array", function() {
    it("combo2array([], [])", function() {
      expect(combo2array([], [])).toEqual([]);
    });

    it("combo2array([a], [])", function() {
      expect(combo2array(["a"], [])).toEqual(["a"]);
    });

    it("combo2array([], [1])", function() {
      expect(combo2array([], ["1"])).toEqual(["1"]);
    });

    it("combo2array([a], [1])", function() {
      expect(combo2array(["a"], ["1"])).toEqual(["a1"]);
    });

    it("combo2array([a,b], [1])", function() {
      expect(combo2array(["a", "b"], ["1"])).toEqual(["a1", "b1"]);
    });

    it("combo2array([a], [1,2])", function() {
      expect(combo2array(["a"], ["1", "2"])).toEqual(["a1", "a2"]);
    });

    it("combo2array([a,b], [1,2])", function() {
      expect(combo2array(["a", "b"], ["1", "2"])).toEqual(["a1", "a2", "b1", "b2"]);
    });

    it("combo2array([a,b,c], [1,2,3])", function() {
      expect(combo2array(["a", "b", "c"], ["1", "2", "3"])).toEqual(["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"]);
    });
  });

  describe("combo", function() {
    it("combo([])", function() {
      expect(combo([])).toEqual([]);
    });

    it("combo([[a]])", function() {
      expect(combo([["a"]])).toEqual(["a"]);
      // expect(combo([["a"]])).toEqual([["a"]]);
    });

    it("combo([[a,b]])", function() {
      expect(combo([["a", "b"]])).toEqual(["a", "b"]);
      // expect(combo([["a", "b"]])).toEqual([["a", "b"]]);
    });

    it("combo([[a,b],[1]])", function() {
      expect(combo([["a", "b"], ["1"]])).toEqual(["a1", "b1"]);
      // expect(combo([["a", "b"], ["1"]])).toEqual([["a1", "b1"]]);
    });

    it("combo([[a,b],[1,2]])", function() {
      expect(combo([["a", "b"], ["1", "2"]])).toEqual(["a1", "a2", "b1", "b2"]);
      // expect(combo([["a", "b"], ["1", "2"]])).toEqual([["a1", "a2", "b1", "b2"]]);
    });

    it("combo([[a,b],[1,2],[A]])", function() {
      expect(combo([["a", "b"], ["1", "2"], ["A"]])).toEqual(["a1A", "a2A", "b1A", "b2A"]);
      // expect(combo([["a", "b"], ["1", "2"], ["A"]])).toEqual([["a1A", "a2A", "b1A", "b2A"]]);
    });

    it("combo([[a,b],[1,2],[A,B]])", function() {
      expect(combo([["a", "b"], ["1", "2"], ["A", "B"]])).toEqual(["a1A", "a1B", "a2A", "a2B", "b1A", "b1B", "b2A", "b2B"]);
      // expect(combo([["a", "b"], ["1", "2"], ["A", "B"]])).toEqual([["a1A", "a1B", "a2A", "a2B", "b1A", "b1B", "b2A", "b2B"]]);
    });
  });

  describe("compact2array", function() {
    it("compact2array([], [])", function() {
      expect(compact2array([], [])).toEqual([["", ""]]);
    });

    it("compact2array([a], [])", function() {
      expect(compact2array(["a"], [])).toEqual([["a", ""]]);
    });

    it("compact2array([], [1])", function() {
      expect(compact2array([], ["1"])).toEqual([["", "1"]]);
    });

    it("compact2array([a, b, c], [])", function() {
      expect(compact2array(["a", "b", "c"], [])).toEqual([["a", ""], ["b", ""], ["c", ""]]);
    });

    it("compact2array([], [a, b, c])", function() {
      expect(compact2array([], ["a", "b", "c"])).toEqual([["", "a"], ["", "b"], ["", "c"]]);
    });

    it("compact2array([a], [1])", function() {
      expect(compact2array(["a"], ["1"])).toEqual([["a", "1"]]);
    });

    it("compact2array([a,b], [1])", function() {
      expect(compact2array(["a", "b"], ["1"])).toEqual([["a", "1"], ["b", "1"]]);
    });

    it("compact2array([a], [1,2])", function() {
      expect(compact2array(["a"], ["1", "2"])).toEqual([["a", "1"], ["a", "2"]]);
    });

    it("compact2array([a,b], [1,2])", function() {
      expect(compact2array(["a", "b"], ["1", "2"])).toEqual([["a", "1"], ["a", "2"], ["b", "1"], ["b", "2"]]);
    });

    it("compact2array([a,b,c], [1,2,3])", function() {
      expect(compact2array(["a", "b", "c"], ["1", "2", "3"])).toEqual([["a", "1"], ["a", "2"], ["a", "3"], ["b", "1"], ["b", "2"], ["b", "3"], ["c", "1"], ["c", "2"], ["c", "3"]]);
    });
  });

  describe("compact", function() {
    it("compact([])", function() {
      expect(compact([])).toEqual([]);
    });

    it("compact([[a]])", function() {
      expect(compact([["a"]])).toEqual([["a"]]);
    });

    it("compact([[a,b]])", function() {
      expect(compact([["a", "b"]])).toEqual([["a", "b"]]);
    });

    it("compact([[a,b],[1]])", function() {
      expect(compact([["a", "b"], ["1"]])).toEqual([["a", "1"], ["b", "1"]]);
    });

    it("compact([[a,b],[1,2]])", function() {
      expect(compact([["a", "b"], ["1", "2"]])).toEqual([["a", "1"], ["a", "2"], ["b", "1"], ["b", "2"]]);
    });

    it("compact([[a,b],[1,2],[A]])", function() {
      expect(compact([["a", "b"], ["1", "2"], ["A"]])).toEqual([["a", "1", "A"], ["a", "2", "A"], ["b", "1", "A"], ["b", "2", "A"]]);
    });

    it("compact([[a,b],[1,2],[A]])", function() {
      expect(compact([["a", "b"], ["1", "2"], ["A"]])).toEqual([["a", "1", "A"], ["a", "2", "A"], ["b", "1", "A"], ["b", "2", "A"]]);
    });

    it("compact([[a,b],[1,2],[A,B]])", function() {
      expect(compact([["a", "b"], ["1", "2"], ["A", "B"]])).toEqual([["a", "1", "A"], ["a", "1", "B"], ["a", "2", "A"], ["a", "2", "B"], ["b", "1", "A"], ["b", "1", "B"], ["b", "2", "A"], ["b", "2", "B"]]);
    });

    it("compact([[ni],[],[hao, hai]])", function() {
      expect(compact([["ni"], [], ["hao", "hai"]])).toEqual([["ni", "", "hao"], ["ni", "", "hai"]]);
    });
  });
});
