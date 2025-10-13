---
nav:
  # 同時設置二級導航名稱和順序，order 越小越靠前，默認爲 0
  second:
    title: 2.x
    order: 2
---

# pīnyīn (v2)

pīnyīn, 漢字拼音轉換工具。

----

[![NPM version][npm-badge]][npm-url]
[![Build Status][build-badge]][build-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![NPM downloads][npm-downloads]][npm-url]


[npm-badge]: https://img.shields.io/npm/v/pinyin.svg?style=flat
[npm-url]: https://www.npmjs.com/package/pinyin
[npm-downloads]: http://img.shields.io/npm/dm/pinyin.svg?style=flat
[build-badge]: https://github.com/hotoo/pinyin/actions/workflows/node.js.yml/badge.svg
[build-url]: https://github.com/hotoo/pinyin/actions
[coveralls-badge]: https://coveralls.io/repos/hotoo/pinyin/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/hotoo/pinyin


[简体中文](https://pinyin.js.org/api/v2/) | 繁體中文 | [English](https://pinyin.js.org/en-US/api/v2/)


轉換中文字符爲拼音。可以用於漢字注音、排序、檢索。

> 注：這個版本同時支持在 Node 和 Web 瀏覽器環境運行，
>
> Python 版請關注 [mozillazg/python-pinyin](https://github.com/mozillazg/python-pinyin)

----

## 特性

* 根據詞組智能匹配最正確的拼音。
* 支持多音字。
* 簡單的繁體支持。
* 支持多種不同拼音風格。

## 安裝

via npm:

```bash
npm install pinyin@2.0 --save
```

## 用法

開髮者：

```js
var pinyin = require("pinyin");

console.log(pinyin("中心"));    // [ [ 'zhōng' ], [ 'xīn' ] ]
console.log(pinyin("中心", {
  heteronym: true               // 啟用多音字模式
}));                            // [ [ 'zhōng', 'zhòng' ], [ 'xīn' ] ]
console.log(pinyin("中心", {
  heteronym: true,              // 啟用多音字模式
  segment: true                 // 啟用分詞，以解決多音字問題。
}));                            // [ [ 'zhōng' ], [ 'xīn' ] ]
console.log(pinyin("我喜歡你", {
  segment: true,                // 啟用分詞
  group: true                   // 啟用詞組
}));                            // [ [ 'wǒ' ], [ 'xǐhuān' ], [ 'nǐ' ] ]
console.log(pinyin("中心", {
  style: pinyin.STYLE_INITIALS, // 設置拼音風格
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

將傳入的中文字符串 (words) 轉換成拼音符號串。

options 是可選的，可以設定拼音風格，或打開多音字選項。

返回二維數組，第一維每個數組項位置對應每個中文字符串位置。
第二維是各個漢字的讀音列表，多音字會有多個拼音項。

### 方法 `Number pinyin.compare(a, b)`

按拼音排序的默認算法。

## 參數

### `<Boolean> options.segment`

是否啟用分詞模式，中文分詞有助於極大的降低多音字問題。
但性能會極大的下降，內存也會使用更多。

### `<Boolean> options.heteronym`

是否啟用多音字模式，默認關閉。

關閉多音字模式時，返回每個漢字第一個匹配的拼音。

啟用多音字模式時，返回多音字的所有拼音列表。

### `<Boolean> options.group`

按詞組分組拼音，例如：

```
我喜歡你
wǒ xǐhuān nǐ
```

### `<Object> options.style`

指定拼音 風格。可以通過以下幾種 `STYLE_` 開頭的靜態屬性進行指定。

### options.mode

拼音模式，默認 `pinyin.MODE_NORMAL` 普通模式。
如果你明確的在姓名場景下，可以使用 `pinyin.MODE_SURNAME` 讓姓氏使用更準確的拼音。

## 靜態屬性

### `.STYLE_NORMAL`

普通風格，即不帶聲調。

如：`pin yin`

### `.STYLE_TONE`

聲調風格，拼音聲調在韻母第一個字母上。

注：這是默認的風格。

如：`pīn yīn`

### `.STYLE_TONE2`

聲調風格 2，即拼音聲調以數字形式在各個拼音之後，用數字 [0-4] 進行表示。

如：`pin1 yin1`

### `.STYLE_TO3NE`

聲調風格 3，即拼音聲調以數字形式在注音字符之後，用數字 [0-4] 進行表示。

如：`pi1n yi1n`

### `.STYLE_INITIALS`

聲母風格，隻返回各個拼音的聲母部分。對於沒有聲母的漢字，返回空白字符串。

如：`中國` 的拼音 `zh g`

注：聲明風格會區分 `zh` 和 `z`，`ch` 和 `c`，`sh` 和 `s`。

注意：部分漢字沒有聲母，如 `啊`，`餓` 等，另外 `y`, `w`, `yu` 都不是聲母，
這些漢字的拼音聲母風格會返回 `""`。請仔細考慮你的需求是否應該使用首字母風格。
詳情請參考 [爲什麼沒有 y, w, yu 幾個聲母](#爲什麼沒有 -y-w-yu- 幾個聲母)

### `.STYLE_FIRST_LETTER`

首字母風格，隻返回拼音的首字母部分。

如：`p y`

### `.MODE_NORMAL`

普通模式，自動識別讀音。

### `.MODE_SURNAME`

姓名模式，對於明確的姓名場景，可以更準確的識別姓氏的讀音。

## Test

```bash
npm test
```

## Q&A

### 關於 Web 版如何使用

首先，我建議大家應該優先考慮在服務端一次性轉換拼音並將結果持久化，避免在客戶端每次轉換損耗性能和體驗。

如果你堅持在客戶端使用，你可以考慮使用 [Webpack](http://webpack.github.io/) + [Babel](http://babeljs.io/) 來轉換成低端瀏覽器的可執行代碼。

實在不想折騰，可以試試 https://www.jsdelivr.com/package/npm/pinyin

### 爲什麼沒有 `y`, `w`, `yu` 幾個聲母？

聲母風格（INITIALS）下，“雨”、“我”、“圓”等漢字返回空字符串，因爲根據《漢語拼音方案》，
`y`，`w`，`ü (yu)` 都不是聲母，在某些特定韻母無聲母時，才加上 `y` 或 `w`，而 `ü` 也有其特定規則。

如果你覺得這個給你帶來了麻煩，那麼也請小心一些無聲母的漢字（如“啊”、“餓”、“按”、“昂”等）。
這時候你也許需要的是首字母風格（FIRST_LETTER）。

### 如何實現按拼音排序？

pinyin 模塊提供了默認的排序方案：

```js
const pinyin = require('pinyin');

const data = '我要排序'.split('');
const sortedData = data.sort(pinyin.compare);
```

如果默認的比較方法不能滿足你的需求，你可以自定義 pinyinCompare 方法：

```js
const pinyin = require('pinyin');

const data = '我要排序'.split('');

// 建議將漢字的拼音持久化存儲起來。
const pinyinData = data.map(han => ({
  han: han,
  pinyin: pinyin(han)[0][0], // 可以自行選擇不同的生成拼音方案和風格。
}));
const sortedData = pinyinData.sort((a, b) => {
  return a.pinyin.localeCompare(b.pinyin);
}).map(d => d.han);
```

### node 版和 web 版有什麼異同？

`pinyin` 目前可以同時運行在 Node 服務器端和 Web 瀏覽器端。
API 和使用方式完成一緻。

但 Web 版較 Node 版稍簡單，拼音庫隻有常用字部分，沒有使用分詞算法，
並且考慮了網絡傳輸對詞庫進行了壓縮處理。

由於分詞和繁體中文的特性，部分情況下的結果也不儘相同。

| 特性         | Web 版                          | Node 版                           |
|--------------|--------------------------------|----------------------------------|
| 拼音庫       | 常用字庫。壓縮、合並           | 完整字庫。不壓縮、合並           |
| 分詞         | 沒有分詞                       | 使用分詞算法，多音字拼音更準確。 |
| 拼音頻度排序 | 有根據拼音使用頻度優先級排序。 | 同 Web 版。                       |
| 繁體中文     | 沒有繁體中文支持。             | 有簡單的繁簡漢字轉換。           |

由於這些區別，測試不同運行環境的用例也不儘相同。

## 捐贈

如果這個模塊有幫助到您，請 Star 這個倉庫。

你也可以選擇使用支付寶或微信給我捐贈：

<img src="https://hotoo.github.io/images/donate-hotoo.png" alt="Alipay:hotoo.cn@gmail.com, WeChat:hotoome" width="400" />


## 許可証

[MIT](http://hotoo.mit-license.org/)
