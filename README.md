# 汉字拼音转换工具。

---

[![NPM version](https://badge.fury.io/js/pinyin.png)](http://badge.fury.io/js/pinyin)
[![spm package](http://spmjs.io/badge/pinyin)](http://spmjs.io/package/pinyin)
[![Build Status](https://secure.travis-ci.org/hotoo/pinyin.png?branch=master)](https://travis-ci.org/hotoo/pinyin)
[![Coverage Status](https://coveralls.io/repos/hotoo/pinyin/badge.png?branch=master)](https://coveralls.io/r/hotoo/pinyin)

转换中文字符为拼音。可以用于汉字注音、排序、检索。

> 注：这个版本同时支持在 Node 和 Web 浏览器环境运行，
> 之前的 [hotoo/node-pinyin](https://github.com/hotoo/node-pinyin) 仓库即将下线。
>
> Python 版请关注 [mozillazg/python-pinyin](https://github.com/mozillazg/python-pinyin)

---

## 特性

* 根据词组智能匹配最正确的拼音。
* 支持多音字。
* 简单的繁体支持。
* 支持多种不同拼音风格。

## 安装

via npm:

```bash
npm install pinyin
```

via spm3:

```bash
spm install pinyin
```

## 用法

开发者：

```js
var pinyin = require("pinyin");

console.log(pinyin("中心"));    // [ [ 'zhōng' ], [ 'xīn' ] ]
console.log(pinyin("中心", {
  heteronym: true               // 启用多音字模式
}));                            // [ [ 'zhōng', 'zhòng' ], [ 'xīn' ] ]
console.log(pinyin("中心", {
  style: pinyin.STYLE_INITIALS, // 设置拼音风格
  heteronym: true
}));                            // [ [ 'zh' ], [ 'x' ] ]
```

命令行：

```bash
$ pinyin 中心
zhōng xīn
$ pinyin -h
```

## API

### 方法 `<Array> pinyin(words[, options])`

将传入的中文字符串(words)转换成拼音符号串。

options 是可选的，可以设定拼音风格，或打开多音字选项。

返回二维数组，第一维每个数组项位置对应每个中文字符串位置。
第二维是各个汉字的读音列表，多音字会有多个拼音项。

### 参数 `<Boolean> options.heteronym`

是否启用多音字模式，默认关闭。

关闭多音字模式时，返回每个汉字第一个匹配的拼音。

启用多音字模式时，返回多音字的所有拼音列表。

### 参数 `<Object> options.style`

指定拼音 风格。可以通过以下几种 `STYLE_` 开头的静态属性进行指定。

### 静态属性 `.STYLE_NORMAL`

普通风格，即不带音标。

如：`pin yin`

### 静态属性 `.STYLE_TONE`

声调风格，拼音声调在韵母第一个字母上。

注：这是默认的风格。

如：`pīn yīn`

### 静态属性 `.STYLE_TONE2`

声调风格2，即拼音声调在各个拼音之后，用数字 [0-4] 进行表示。

如：`pin1 yin1`

### 静态属性 `.STYLE_INITIALS`

声母风格，只返回各个拼音的声母部分。

如：`中国` 的拼音 `zh g`

例外，对于只有韵母的汉字（如『爱、啊』等），会先转成不带音标的普通风格。

### 静态属性 `.STYLE_FIRST_LETTER`

首字母风格，只返回拼音的首字母部分。

如：`p y`


## Test

```
npm test
```

## Q&A

### node 版和 web 版有什么异同？

`pinyin` 目前可以同时运行在 Node 服务器端和 Web 浏览器端。
API 和使用方式完成一致。

但 Web 版较 Node 版稍简单，拼音库只有常用字部分，没有使用分词算法，
并且考虑了网络传输对词库进行了压缩处理。

由于分词和繁体中文的特性，部分情况下的结果也不尽相同。

| 特性         | Web 版                          | Node 版                           |
|--------------|--------------------------------|----------------------------------|
| 拼音库       | 常用字库。压缩、合并           | 完整字库。不压缩、合并           |
| 分词         | 没有分词                       | 使用分词算法，多音字拼音更准确。 |
| 拼音频度排序 | 有根据拼音使用频度优先级排序。 | 同 Web 版。                       |
| 繁体中文     | 没有繁体中文支持。             | 有简单的繁简汉字转换。           |

由于这些区别，测试不同运行环境的用例也不尽相同。

### 为什么不使用更好的繁简转换？

对于拼音来说，把繁简汉字做简单的映射并转换成拼音是合理的。
而使用类似 [OpenCC](https://github.com/BYVoid/OpenCC)
[cconv](https://code.google.com/p/cconv/) 这样的转换库，虽然转换结果更
符合本地化语境，但是对于汉字变化后的拼音来说，已经不是繁体原字的拼音了。


## 参考

* [在线汉语字典](http://zi.artx.cn/zi/)
* [汉典网](http://www.zdic.net/)
* [快典网](http://py.kdd.cc/)
* [将汉字转换成拼音](https://code.google.com/p/chinese-character-2-pinyin/)
* [字符转拼音 javascript pinyin](http://www.cnblogs.com/jinweijie/archive/2008/02/03/1063289.html)
  ([pinyin.rar](http://cid-80b2ed83de3c7c17.skydrive.live.com/self.aspx/Code/pinyin.rar))
* [Javascript Input Method Editors](http://jsime.sourceforge.net/) ([中文](http://leen.name/ime/pinyin.html), [En](http://leen.name/ime/english.html))
* [现在汉语的词汇数量及分布](http://blog.cathayan.org/item/1593)
