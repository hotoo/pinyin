"use strict";

const expect = require("expect.js");
const util = require("../lib/util");

describe("test/util.test.js", function() {
  describe("combo2array", function() {
    it("combo2array([], [])", function() {
      expect(util.combo2array([], [])).to.eql([]);
    });

    it("combo2array([a], [])", function() {
      expect(util.combo2array(["a"], [])).to.eql(["a"]);
    });

    it("combo2array([], [1])", function() {
      expect(util.combo2array([], ["1"])).to.eql(["1"]);
    });

    it("combo2array([a], [1])", function() {
      expect(util.combo2array(["a"], ["1"])).to.eql(["a1"]);
    });

    it("combo2array([a,b], [1])", function() {
      expect(util.combo2array(["a", "b"], ["1"])).to.eql(["a1", "b1"]);
    });

    it("combo2array([a], [1,2])", function() {
      expect(util.combo2array(["a"], ["1", "2"])).to.eql(["a1", "a2"]);
    });

    it("combo2array([a,b], [1,2])", function() {
      expect(util.combo2array(["a", "b"], ["1", "2"])).to.eql(["a1", "a2", "b1", "b2"]);
    });

    it("combo2array([a,b,c], [1,2,3])", function() {
      expect(util.combo2array(["a", "b", "c"], ["1", "2", "3"])).to.eql(["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"]);
    });
  });

  describe("combo", function() {
    it("combo([])", function() {
      expect(util.combo([])).to.eql([]);
    });

    it("combo([[a]])", function() {
      expect(util.combo([["a"]])).to.eql([["a"]]);
    });

    it("combo([[a,b]])", function() {
      expect(util.combo([["a", "b"]])).to.eql([["a", "b"]]);
    });

    it("combo([[a,b],[1]])", function() {
      expect(util.combo([["a", "b"], ["1"]])).to.eql([["a1", "b1"]]);
    });

    it("combo([[a,b],[1,2]])", function() {
      expect(util.combo([["a", "b"], ["1", "2"]])).to.eql([["a1", "a2", "b1", "b2"]]);
    });

    it("combo([[a,b],[1,2],[A]])", function() {
      expect(util.combo([["a", "b"], ["1", "2"], ["A"]])).to.eql([["a1A", "a2A", "b1A", "b2A"]]);
    });

    it("combo([[a,b],[1,2],[A,B]])", function() {
      expect(util.combo([["a", "b"], ["1", "2"], ["A", "B"]])).to.eql([["a1A", "a1B", "a2A", "a2B", "b1A", "b1B", "b2A", "b2B"]]);
    });
  });
});
