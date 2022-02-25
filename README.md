# README

pīnyīn, 汉字拼音转换工具。

----

[![NPM version][npm-badge]][npm-url]
[![Build Status][build-badge]][build-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Language Grade: JavaScript][lgtm-badge]][lgtm-url]
[![NPM downloads][npm-downloads]][npm-url]


[npm-badge]: https://img.shields.io/npm/v/pinyin.svg?style=flat
[npm-url]: https://www.npmjs.com/package/pinyin
[npm-downloads]: http://img.shields.io/npm/dm/pinyin.svg?style=flat
[build-badge]: https://github.com/hotoo/pinyin/actions/workflows/node.js.yml/badge.svg
[build-url]: https://github.com/hotoo/pinyin/actions
[coveralls-badge]: https://coveralls.io/repos/hotoo/pinyin/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/hotoo/pinyin
[lgtm-badge]: https://img.shields.io/lgtm/grade/javascript/g/hotoo/pinyin.svg?logo=lgtm&logoWidth=18
[lgtm-url]: https://lgtm.com/projects/g/hotoo/pinyin/context:javascript


[English Documention](/en-US/)

[English README](README.en-US.md)

转换中文字符为拼音。可以用于汉字注音、排序、检索。

> 注：这个版本同时支持在 Node 和 Web 浏览器环境运行，
>
> Python 版请关注 [mozillazg/python-pinyin](https://github.com/mozillazg/python-pinyin)

----

## 特性

* 根据词组智能匹配最正确的拼音。
* 支持多音字。
* 简单的繁体支持。
* 支持多种不同拼音风格。

## 安装

via npm:

```bash
npm install pinyin --save
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
console.log(pinyin("我喜欢你", {
  segment: true,                // 启用分词
  group: true                   // 启用词组
}));                            // [ [ 'wǒ' ], [ 'xǐhuān' ], [ 'nǐ' ] ]
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

### 方法 `Number pinyin.compare(a, b)`

按拼音排序的默认算法。

## 参数

### `<Boolean> options.segment`

是否启用分词模式，中文分词有助于极大的降低多音字问题。
但性能会极大的下降，内存也会使用更多。

### `<Boolean> options.heteronym`

是否启用多音字模式，默认关闭。

关闭多音字模式时，返回每个汉字第一个匹配的拼音。

启用多音字模式时，返回多音字的所有拼音列表。

### `<Boolean> options.group`

按词组分组拼音，例如：

```
我喜欢你
wǒ xǐhuān nǐ
```

### `<Object> options.style`

指定拼音 风格。可以通过以下几种 `STYLE_` 开头的静态属性进行指定。

### options.mode

拼音模式，默认 `pinyin.MODE_NORMAL` 普通模式。
如果你明确的在姓名场景下，可以使用 `pinyin.MODE_SURNAME` 让姓氏使用更准确的拼音。

## 静态属性

### `.STYLE_NORMAL`

普通风格，即不带声调。

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

注：声明风格会区分 `zh` 和 `z`，`ch` 和 `c`，`sh` 和 `s`。

注意：部分汉字没有声母，如 `啊`，`饿` 等，另外 `y`, `w`, `yu` 都不是声母，
这些汉字的拼音声母风格会返回 `""`。请仔细考虑你的需求是否应该使用首字母风格。
详情请参考 [为什么没有 y, w, yu 几个声母](#为什么没有 -y-w-yu- 几个声母)

### `.STYLE_FIRST_LETTER`

首字母风格，只返回拼音的首字母部分。

如：`p y`

### `.MODE_NORMAL`

普通模式，自动识别读音。

### `.MODE_SURNAME`

姓名模式，对于明确的姓名场景，可以更准确的识别姓氏的读音。

## Test

```bash
npm test
```

## Q&A

### 关于 Web 版如何使用

首先，我建议大家应该优先考虑在服务端一次性转换拼音并将结果持久化，避免在客户端每次转换损耗性能和体验。

如果你坚持在客户端使用，你可以考虑使用 [Webpack](http://webpack.github.io/) + [Babel](http://babeljs.io/) 来转换成低端浏览器的可执行代码。

实在不想折腾，可以试试 https://github.com/hotoo/pinyin/tree/gh-pages/dist

### 为什么没有 `y`, `w`, `yu` 几个声母？

声母风格（INITIALS）下，“雨”、“我”、“圆”等汉字返回空字符串，因为根据《汉语拼音方案》，
`y`，`w`，`ü (yu)` 都不是声母，在某些特定韵母无声母时，才加上 `y` 或 `w`，而 `ü` 也有其特定规则。

如果你觉得这个给你带来了麻烦，那么也请小心一些无声母的汉字（如“啊”、“饿”、“按”、“昂”等）。
这时候你也许需要的是首字母风格（FIRST_LETTER）。

### 如何实现按拼音排序？

pinyin 模块提供了默认的排序方案：

```js
const pinyin = require('pinyin');

const data = '我要排序'.split('');
const sortedData = data.sort(pinyin.compare);
```

如果默认的比较方法不能满足你的需求，你可以自定义 pinyinCompare 方法：

```js
const pinyin = require('pinyin');

const data = '我要排序'.split('');

// 建议将汉字的拼音持久化存储起来。
const pinyinData = data.map(han => ({
  han: han,
  pinyin: pinyin(han)[0][0], // 可以自行选择不同的生成拼音方案和风格。
}));
const sortedData = pinyinData.sort((a, b) => {
  return a.pinyin.localeCompare(b.pinyin);
}).map(d => d.han);
```

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

<img src="https://hotoo.github.io/images/donate-hotoo.png" alt="Alipay:hotoo.cn@gmail.com, WeChat:hotoome" width="400" />

或者直接捐赠给我妻子 [@lizzie](https://github.com/lizzie)：

<img src="https://hotoo.github.io/images/donate-lizzie.png" alt="Alipay:shenyan1985@gmail.com, WeChat:SunsetSunrising" width="400" />

这两种捐赠的最终结果是一样的 :)

## 许可证

[MIT](http://hotoo.mit-license.org/)
