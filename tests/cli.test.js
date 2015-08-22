
var should = require("should");
var child_process = require("child_process");

var testcases = [
  {
    command: "pinyin 中国",
    stdout: "zhōng guó",
  },
  {
    command: "pinyin -h 中国",
    stdout: "zhōng,zhòng guó",
  },
  {
    command: "pinyin -hS 中国",
    stdout: "zhōng guó",
  },
  {
    command: "pinyin -S 中国",
    stdout: "zhōng guó",
  },
  {
    command: "pinyin 重心",
    stdout: "zhòng xīn",
  },
  {
    command: "pinyin 重复",
    stdout: "zhòng fù",
  },
  {
    command: "pinyin -h 重复",
    stdout: "zhòng,chóng fù",
  },
  {
    command: "pinyin -hS 重复",
    stdout: "chóng fù",
  },
  {
    command: "pinyin -hS -s NORMAL 重复",
    stdout: "chong fu",
  },
  {
    command: "pinyin -s INITIALS 重复",
    stdout: "zh f",
  },
];

describe("cli: command line interface.", function() {

  testcases.forEach(function(testcase) {

    it("$ " + testcase.command, function(done) {
      child_process.exec("bin/" + testcase.command, function(err, stdout) {
        should.not.exist(err);
        stdout.should.eql(testcase.stdout + "\n");
        done();
      });
    });

  });

});
