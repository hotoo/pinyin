# 汉字拼音转换工具。

---

[![NPM version][npm-badge]][npm-url]
[![spm version][spm-badge]][spm-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![NPM downloads][npm-downloads]][npm-url]


[npm-badge]: https://img.shields.io/npm/v/pinyin.svg?style=flat
[npm-url]: https://www.npmjs.com/package/pinyin
[npm-downloads]: http://img.shields.io/npm/dm/pinyin.svg?style=flat
[spm-badge]: http://spmjs.io/badge/pinyin
[spm-url]: http://spmjs.io/package/pinyin
[travis-badge]: https://travis-ci.org/hotoo/pinyin.svg?branch=master
[travis-url]: https://travis-ci.org/hotoo/pinyin
[coveralls-badge]: https://coveralls.io/repos/hotoo/pinyin/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/hotoo/pinyin
[gittip-image]: https://img.shields.io/gittip/hotoo.svg?style=flat-square
[gittip-url]: https://www.gittip.com/hotoo/

[English Documention](README-us_EN.md)

转换中文字符为拼音。可以用于汉字注音、排序、检索。

> 注：这个版本同时支持在 Node 和 Web 浏览器环境运行，
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

via spm:

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
  heteronym: true,              // 启用多音字模式
  segment: true                 // 启用分词，以解决多音字问题。
}));                            // [ [ 'zhōng' ], [ 'xīn' ] ]
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

将传入的中文字符串 (words) 转换成拼音符号串。

options 是可选的，可以设定拼音风格，或打开多音字选项。

返回二维数组，第一维每个数组项位置对应每个中文字符串位置。
第二维是各个汉字的读音列表，多音字会有多个拼音项。

## 参数

### `<Boolean> options.segment`

是否启用分词模式，中文分词有助于极大的降低多音字问题。
但性能会极大的下降，内存也会使用更多。

### `<Boolean> options.heteronym`

是否启用多音字模式，默认关闭。

关闭多音字模式时，返回每个汉字第一个匹配的拼音。

启用多音字模式时，返回多音字的所有拼音列表。

### `<Object> options.style`

指定拼音 风格。可以通过以下几种 `STYLE_` 开头的静态属性进行指定。

## 静态属性

### `.STYLE_NORMAL`

普通风格，即不带音标。

如：`pin yin`

### `.STYLE_TONE`

声调风格，拼音声调在韵母第一个字母上。

注：这是默认的风格。

如：`pīn yīn`

### `.STYLE_TONE2`

声调风格 2，即拼音声调以数字形式在各个拼音之后，用数字 [0-4] 进行表示。

如：`pin1 yin1`

### `.STYLE_TO3NE`

声调风格 3，即拼音声调以数字形式在注音字符之后，用数字 [0-4] 进行表示。

如：`pi1n yi1n`

### `.STYLE_INITIALS`

声母风格，只返回各个拼音的声母部分。对于没有声母的汉字，返回空白字符串。

如：`中国` 的拼音 `zh g`

### `.STYLE_FIRST_LETTER`

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

## 捐赠

如果这个模块有帮助到您，请 Star 这个仓库。

你也可以选择使用支付宝或微信给我捐赠：

![Alipay:hotoo.cn@gmail.com, WeChat:hotoome](http://hotoo.me/images/donate-hotoo.png)

或者直接捐赠给我妻子 [@lizzie](https://github.com/lizzie)：

![Alipay:shenyan1985@gmail.com, WeChat:SunsetSunrising](http://hotoo.me/images/donate-lizzie.png)

这两种捐赠的最终结果是一样的 :)

## 许可证

[MIT](http://hotoo.mit-license.org/)
