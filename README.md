# pīnyīn (v3)

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


Web Site: 简体中文 | [English](/en-US/) | [한국어](/ko-KR/)

README: 简体中文 | [English](README.en-US.md) | [한국어](README.ko-KR.md)


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

```typescript
import pinyin from "pinyin";

console.log(pinyin("中心"));    // [ [ 'zhōng' ], [ 'xīn' ] ]

console.log(pinyin("中心", {
  heteronym: true,              // 启用多音字模式
}));                            // [ [ 'zhōng', 'zhòng' ], [ 'xīn' ] ]

console.log(pinyin("中心", {
  heteronym: true,              // 启用多音字模式
  segment: true,                // 启用分词，以解决多音字问题。默认不开启，使用 true 开启使用 Intl.Segmenter 分词库。
}));                            // [ [ 'zhōng' ], [ 'xīn' ] ]

console.log(pinyin("中心", {
  segment: "@node-rs/jieba",    // 指定分词库，可以是 "Intl.Segmenter", "nodejieba"、"segmentit"、"@node-rs/jieba"。
}));                            // [ [ 'zhōng' ], [ 'xīn' ] ]

console.log(pinyin("我喜欢你", {
  segment: "segmentit",         // 启用分词
  group: true,                  // 启用词组
}));                            // [ [ 'wǒ' ], [ 'xǐhuān' ], [ 'nǐ' ] ]

console.log(pinyin("中心", {
  style: "initials",            // 设置拼音风格。
  heteronym: true,              // 即使有多音字，因为拼音风格选择，重复的也会合并。
}));                            // [ [ 'zh' ], [ 'x' ] ]

console.log(pinyin("华夫人", {
  mode: "surname",              // 姓名模式。
}));                            // [ ['huà'], ['fū'], ['rén'] ]
```

命令行：

```bash
$ pinyin 中心
zhōng xīn
$ pinyin -h
```

## 类型

### IPinyinOptions

传入给 pinyin 方法的第二个参数的选项类型。

```typescript
export interface IPinyinOptions {
  style?: IPinyinStyle; // 拼音输出形式
  mode?: IPinyinMode, // 拼音模式
  // 指定分词库。
  // 为了兼容老版本，可以使用 boolean 类型指定是否开启分词，默认开启。
  segment?: IPinyinSegment | boolean;
  // 是否返回多音字
  heteronym?: boolean;
  // 是否分组词组拼音
  group?: boolean;
  compact?: boolean;
}
```

### IPinyinStyle

输出拼音格式。可以从直接使用以下字符串或数字，也兼容 v2 版本中 `pinyin.STYLE_TONE` 这样的形式。

```typescript
export type IPinyinStyle =
  "normal" | "tone" | "tone2" | "to3ne" | "initials" | "first_letter" | "passport" | // 推荐使用小写，和输出的拼音一致
  "NORMAL" | "TONE" | "TONE2" | "TO3NE" | "INITIALS" | "FIRST_LETTER" | "PASSPORT" | // 方便老版本迁移
  0        | 1      | 2       | 5       | 3          | 4;               // 兼容老版本
```

### IPinyinMode

拼音模式，默认普通模式，可以指定人名模式。

```typescript
// - NORMAL: 普通模式
// - SURNAME: 姓氏模式，优先使用姓氏的拼音。
export type IPinyinMode =
  "normal" | "surname" |
  "NORMAL" | "SURNAME";
```

### IPinyinSegment

分词方式。

- 默认关闭 `false`，
- 也可以设置为 `true` 开启，Web 和 Node 版中均使用 "Intl.Segmenter" 分词。
- 也可以声明以下字符串来指定分词算法。但目前 Web 版只支持 "Intl.Segmenter" 和 "segmentit" 分词。

```typescript
export type IPinyinSegment = "Intl.Segmenter" | "nodejieba" | "segmentit" | "@node-rs/jieba";
```

## API

### 方法 `<Array> pinyin(words: string[, options: IPinyinOptions])`

将传入的中文字符串 (words) 转换成拼音符号串。

options 是可选的，可以设定拼音风格，或打开多音字选项。

返回二维数组，第一维每个数组项位置对应每个中文字符串位置。
第二维是各个汉字的读音列表，多音字会有多个拼音项。

### 方法 `Number compare(a, b)`

按拼音排序的默认算法。

### 方法 `string[][] compact(pinyinResult array[][])`

将拼音多音字以各种可能的组合排列变换成紧凑形式。参考 options.compact

## 参数

### `<Boolean|IPinyinSegment> options.segment`

是否启用分词模式，中文分词有助于极大的降低多音字问题。
但性能会极大的下降，内存也会使用更多。

- 默认不启用分词。
- 如果 `segemnt = true`，默认使用 Intl.Segmenter 分词。
- 可以指定 "Intl.Segmenter"、"nodejieba"、"segmentit"、"@node-rs/jieba" 进行分词。

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

### `<IPinyinStyle> options.style`

指定拼音风格。可以使用以下特定字符串或数值指定：

```typescript
IPinyinStyle =
  "normal" | "tone" | "tone2" | "to3ne" | "initials" | "first_letter" | "passport" | // 推荐使用小写，和输出的拼音一致
  "NORMAL" | "TONE" | "TONE2" | "TO3NE" | "INITIALS" | "FIRST_LETTER" | "PASSPORT" | // 方便老版本迁移
  0        | 1      | 2       | 5       | 3          | 4;               // 兼容老版本
```


#### `NORMAL`, `normal`

普通风格，即不带声调。

如：`pin yin`

#### `TONE`, `tone`

声调风格，拼音声调在韵母第一个字母上。

注：这是默认的风格。

如：`pīn yīn`

#### `TONE2`, `tone2`

声调风格 2，即拼音声调以数字形式在各个拼音之后，用数字 [0-4] 进行表示。

如：`pin1 yin1`

#### `TO3NE`, `to3ne`

声调风格 3，即拼音声调以数字形式在注音字符之后，用数字 [0-4] 进行表示。

如：`pi1n yi1n`

#### `INITIALS`, `initials`

声母风格，只返回各个拼音的声母部分。对于没有声母的汉字，返回空白字符串。

如：`中国` 的拼音 `zh g`

注：声明风格会区分 `zh` 和 `z`，`ch` 和 `c`，`sh` 和 `s`。

注意：部分汉字没有声母，如 `啊`，`饿` 等，另外 `y`, `w`, `yu` 都不是声母，
这些汉字的拼音声母风格会返回 `""`。请仔细考虑你的需求是否应该使用首字母风格。
详情请参考 [为什么没有 y, w, yu 几个声母](#为什么没有 -y-w-yu- 几个声母)

#### `FIRST_LETTER`, `first_letter`

首字母风格，只返回拼音的首字母部分。

如：`p y`

#### `PASSPORT`, `passport`

护照风格。转换成大写形式，并且 `ü` 会以 `YU` 形式输出。

国家移民管理局门户网站于2021年9月29日发布了《关于内地居民拼音姓名中字母“ü”在出入境证件中打印规则的公告》（以下简称公告），根据《中国人名汉语拼音字母拼写规则》和《关于机读旅行证件的相关国际通用规范》， 内地居民申办出入境证件，出入境证件上打印的持证人拼音姓名中，Lü（吕等字）、Nü（女等字）中的字母“ü”应当转换为“YU”，LüE（略等字）、NüE（虐等字）中的字母“ü”应当转换为“U”。

### <string> options.mode

拼音模式，默认 "NORMAL" 普通模式。
如果你明确的在姓名场景下，可以使用 "SURNAME" 让姓氏使用更准确的拼音。


- `NORMAL`：普通模式，自动识别读音。
- `SURNAME`：姓名模式，对于明确的姓名场景，可以更准确的识别姓氏的读音。

### <boolean> options.compact

是否返回紧凑模式，默认 false，按标准格式返回。
如果设置为 true，则将多音字可能的各种组合排列后返回。例如：

```
pinyin("你好吗", { compact:false });
> [[nǐ], [hǎo,hào], [ma,má,mǎ]]

pinyin("你好吗", { compact:true });
> [
>   [nǐ,hǎo,ma], [nǐ,hǎo,má], [nǐ,hǎo,mǎ],
>   [nǐ,hào,ma], [nǐ,hào,má], [nǐ,hào,mǎ],
> ]
```

你也可以必要时使用 `compact()` 函数处理 `pinyin(han, {compact:false})` 返回的结果。

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

## 许可证

[MIT](http://hotoo.mit-license.org/)
