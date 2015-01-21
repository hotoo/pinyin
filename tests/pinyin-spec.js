/*global describe,it*/
/*jshint node:true,strict:false*/
var pinyin = require('../src/pinyin');
var should = require('should');

describe('常规测试',function(){
  it('单个单音字拼音串',function(){
    var py = pinyin('我');
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.have.length(1);
    py[0][0].should.eql('wǒ');
  });
  it('单音字词组拼音',function(){
    var py = pinyin('我是谁');
    py.should.be.an.Array.and.have.length(3);
    py[0].should.be.an.Array.and.eql(['wǒ']);
    py[1].should.be.an.Array.and.eql(['shì']);
    py[2].should.be.an.Array.and.eql(['shuí']);
  });
  it('非汉字',function(){
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
    py[0].should.be.an.Array.and.eql(['pīn']);
    py[1].should.be.an.Array.and.eql(['yīn']);
    py[2].should.be.an.Array.and.eql(['(pinyin)']);
    py = pinyin('中国(china)');
    py.should.be.an.Array.and.have.length(3);
    py[0].should.be.an.Array.and.eql(['zhōng']);
    py[1].should.be.an.Array.and.eql(['guó']);
    py[2].should.be.an.Array.and.eql(['(china)']);
  });
});

describe('多音字测试',function(){
  it('单个多音字拼音串',function(){
    var py = pinyin('重',{heteronym:true});
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.have.length(2);
    py[0].should.eql(['zhòng','chóng']);
  });
  it('多音字关闭多音字选项',function(){
    var py = pinyin('重',{heteronym:false});
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.have.length(1);
    py[0].should.eql(['zhòng']);
  });
  it('多音字词组拼音',function(){
    var py = pinyin('银行',{heteronym:true});
    py.should.be.an.Array.and.have.length(2);
    py[0].should.be.an.Array.and.eql(['yín']);
    py[1].should.be.an.Array.and.eql(['háng','xíng']);
  });
});

describe('风格测试',function(){
  it('不带声调',function(){
    var py = pinyin('重',{style:'normal'});
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.have.length(1);
    py[0].should.eql(['zhong']);
  });
  it('数字声调',function(){
    var py = pinyin('重',{heteronym:true,style:'toneWithNumber'});
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.have.length(2);
    py[0].should.be.an.Array.and.eql(['zhong4','chong2']);
  });
  it('声母',function(){
    var py = pinyin('重',{heteronym:true,style:'initials'});
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.have.length(2);
    py[0].should.be.an.Array.and.eql(['zh','ch']);
  });
  it('只有韵母的声母',function(){
    var py = pinyin('爱',{heteronym:true,style:'initials'});
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.eql(['ai']);
  });
  it('首字母',function(){
    var py = pinyin('重',{heteronym:true,style:'firstLetter'});
    py.should.be.an.Array.and.have.length(1);
    py[0].should.be.an.Array.and.have.length(2);
    py[0].should.be.an.Array.and.eql(['z','c']);
  });
});