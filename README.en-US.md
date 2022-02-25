
# pīnyīn for Han （汉字）

---

[![NPM version][npm-badge]][npm-url]
[![Build Status][build-badge]][build-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![NPM downloads][npm-downloads]][npm-url]


[npm-badge]: https://img.shields.io/npm/v/pinyin.svg?style=flat
[npm-url]: https://www.npmjs.com/package/pinyin
[npm-downloads]: http://img.shields.io/npm/dm/pinyin.svg?style=flat
[build-badge]: https://github.com/hotoo/pinyin/actions/workflows/node.js.yml/badge.svg
[build-url]: https://github.com/hotoo/pinyin/actions
[coveralls-badge]: https://coveralls.io/repos/hotoo/pinyin/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/hotoo/pinyin
[gittip-image]: https://img.shields.io/gittip/hotoo.svg?style=flat-square
[gittip-url]: https://www.gittip.com/hotoo/

[中文文档](/)

[中文 README](README.md)

Convert Han to pinyin. useful for phonetic notation, sorting, and searching.

> Note: This module both support Node and Web browser.
>
> Python version see [mozillazg/python-pinyin](https://github.com/mozillazg/python-pinyin)

---

## Feature

* Segmentation for heteronym words.
* Support Traditional and Simplified Chinese.
* Support multiple pinyin style.

## Install

via npm:

```bash
npm install pinyin
```

## Usage

for developer:

```js
var pinyin = require("pinyin");

console.log(pinyin("中心"));    // [ [ 'zhōng' ], [ 'xīn' ] ]
console.log(pinyin("中心", {
  heteronym: true                // Enable heteronym mode.
}));                            // [ [ 'zhōng', 'zhòng' ], [ 'xīn' ] ]
console.log(pinyin("中心", {
  heteronym: true,              // Enable heteronym mode.
  segment: true                 // Enable Chinese words segmentation, fix most heteronym problem.
}));                            // [ [ 'zhōng' ], [ 'xīn' ] ]
console.log(pinyin("我喜欢你", {
  segment: true,                // Enable segmentation. Needed for grouping.
  group: true                   // Group pinyin segments
}));                            // [ [ 'wǒ' ], [ 'xǐhuān' ], [ 'nǐ' ] ]
console.log(pinyin("中心", {
  style: pinyin.STYLE_INITIALS, // Setting pinyin style.
  heteronym: true
}));                            // [ [ 'zh' ], [ 'x' ] ]
```

for cli:

```bash
$ pinyin 中心
zhōng xīn
$ pinyin -h
```

## API

### `<Array> pinyin(words[, options])`

Convert Han （汉字） to pinyin.

`options` argument is optional, for sepcify heteronym mode and pinyin styles.

Return a `Array<Array<String>>`. If one of Han is heteronym word, it would be
have multiple pinyin.

### `Number pinyin.compare(a, b)`

Default compare implementation for pinyin.


## Options

#### `<Boolean> options.segment`

Enable Chinese word segmentation. Segmentation is helpful for fix heteronym
problem, but performance will be more slow, and need more CPU and memory.

Default is `false`.

### `<Boolean> options.heteronym`

Enable or disable heteronym mode. default is disabled, `false`.

### `<Boolean> options.group`

Group pinyin by phrases. for example:

```
我喜欢你
wǒ xǐhuān nǐ
```

### `<Object> options.style`

Specify pinyin style. please use static properties like `STYLE_*`.
default is `.STYLE_TONE`. see Static Property for more.

### `options.mode`

pinyin mode, default is `pinyin.MODE_NORMAL`. If you cleared in surname scene,
use `pinyin.MODE_SURNAME` maybe better.

## Static Property

### `.STYLE_NORMAL`

Normal mode.

Example: `pin yin`

### `.STYLE_TONE`

Tone style, this is default.

Example: `pīn yīn`

### `.STYLE_TONE2`

tone style by postfix number [0-4].

Example: `pin1 yin1`

### `.STYLE_TO3NE`

tone style by number [0-4] after phonetic notation character.

Example: `pin1 yin1`

### `.STYLE_INITIALS`

Initial consonant (of a Chinese syllable).

Example: pinyin of `中国` is `zh g`

Note: when a Han （汉字） without initial consonant, will convert to empty string.

### `.STYLE_FIRST_LETTER`

First letter style.

Example: `p y`

### `pinyin.MODE_NORMAL`

Normal mode. This is the default mode.

### `pinyin.MODE_SURNAME`

Surname mode. If chinese word is surname, The pinyin of surname is prioritized.

## Test

```
npm test
```

## Q&A

### What's the different Node version and Web version?

`pinyin` support Node and Web browser now, the API and usage is complete same.

But the Web version is simple than Node version. Just frequently-used dict,
without segmentation, and the dict is compress for web.

Because of Traditional and Segmentation, the convert result will be not complete same.
and the test case have some different too.

| Feature      | Web version                     | Node version                     |
|--------------|---------------------------------|----------------------------------|
| Dict         | Frequently-used Dict, Compress. | Complete Dict, without Compress. |
| Segmentation | NO                              | Segmentation options.            |
| Traditional  | NO                              | Full Traditional support.        |


### How to sort by pinyin?

This module provide default compare implementation:

```js
const pinyin = require('pinyin');

const data = '我要排序'.split('');
const sortedData = data.sort(pinyin.compare);
```

But if you need different implementation, do it like:

```
const pinyin = require('pinyin');

const data = '我要排序'.split('');

// Suggest you to store pinyin result by data persistence.
const pinyinData = data.map(han => ({
  han: han,
  pinyin: pinyin(han)[0][0], // Choose you options and styles.
}));
const sortedData = pinyinData.sort((a, b) => {
  return a.pinyin.localeCompare(b.pinyin);
}).map(d => d.han);
```

## Donate

If this module is helpful for you, please Star this repository.

And you have chioce donate to me via Aliapy or WeChat:

<img src="https://hotoo.github.io/images/donate-hotoo.png" alt="Alipay:hotoo.cn@gmail.com, WeChat:hotoome" width="400" />

or donate my dear wife [@lizzie](https://github.com/lizzie) direct:

<img src="https://hotoo.github.io/images/donate-lizzie.png" alt="Alipay:shenyan1985@gmail.com, WeChat:SunsetSunrising" width="400" />

The two donate way will have the same result.

## License

[MIT](http://hotoo.mit-license.org/)
