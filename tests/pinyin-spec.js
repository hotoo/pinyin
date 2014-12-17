/*global describe,it*/
/*jshint node:true,strict:false*/
var pinyin = require('../src/pinyin');
var should = require('should');

describe('util测试',function(){
  it('获取单个单音字拼音串',function(){
    var py = pinyin('我');//中爱啊我是谁中国重心a aa a a 拼音(pinyin) 中国(china)
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.have.length(1);
    py[0][0].should.eql('wo');
  });
  it('获取单个多音字拼音串',function(){
    var py = pinyin('重',{heteronym:true});
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.have.length(2);
    py[0].should.eql(['zhong','chong']);
  });
  it('获取单音字词组拼音',function(){
    var py = pinyin('我是谁');
    py.should.be.an.Array.and.have.length(3);
    py[0].should.be.an.Array.and.eql(['wo']);
    py[1].should.be.an.Array.and.eql(['shi']);
    py[2].should.be.an.Array.and.eql(['shui']);
  });
  it('获取多音字词组拼音',function(){
    var py = pinyin('银行',{heteronym:true});
    py.should.be.an.Array.and.have.length(2);
    py[0].should.be.an.Array.and.eql(['yin']);
    py[1].should.be.an.Array.and.eql(['hang','xing']);
  });
  it('获取非汉字',function(){
    var py = pinyin('a');
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.eql(['a']);
    py = pinyin('aa');
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.eql(['aa']);
    py = pinyin('a a');
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.eql(['a a']);
  });
  it('中英混合',function(){
    var py = pinyin('拼音(pinyin)');
    py.should.be.an.Array.and.have.length(3);
    py[0].should.be.an.Array.and.eql(['pin']);
    py[1].should.be.an.Array.and.eql(['yin']);
    py[2].should.be.an.Array.and.eql(['(pinyin)']);
    py = pinyin('中国(china)');
    py.should.be.an.Array.and.have.length(3);
    py[0].should.be.an.Array.and.eql(['zhong']);
    py[1].should.be.an.Array.and.eql(['guo']);
    py[2].should.be.an.Array.and.eql(['(china)']);
  });
});