# 汉字拼音转换工具。

---

[![Build Status](https://secure.travis-ci.org/hotoo/pinyin.png?branch=master)](https://travis-ci.org/hotoo/pinyin)
[![Coverage Status](https://coveralls.io/repos/hotoo/pinyin/badge.png?branch=master)](https://coveralls.io/r/hotoo/pinyin)

转换中文字符为拼音。

注：这是基于浏览器运行的版本，另外还同步提供了更强的 [NodeJS 版本](https://github.com/hotoo/node-pinyin)

---

## 使用说明

```javascript
var pinyin = require("pinyin");

pinyin("重点");
pinyin("重点", {
  style: pinyin.STYLE_NORMAL,
  heteronym: true
});
```

## API

### 方法 `<Array> pinyin(words[, options])`

将传入的中文字符(words)转换成拼音符号。

options 是可选的，可以设定拼音风格，或打开多音字选项。

### 参数 `<Boolean> options.heteronym`

是否启用多音字模式，默认关闭。

关闭多音字模式时，返回每个汉字第一个匹配的拼音。

启用多音字模式时，返回多音字的所有拼音列表。

### 属性 `.STYLE_NORMAL`

普通风格，即不带音标。

如：`pin yin`

### 属性 `.STYLE_TONE`

声调风格，拼音声调在韵母第一个字母上。

如：`pīn yīn`

### 属性 `.STYLE_TONE2`

声调风格2，即拼音声调在各个拼音之后，用数字 [0-4] 进行表示。

如：`pin1 yin1`

### 属性 `.STYLE_INITIALS`

声母风格，只返回各个拼音的声母部分。

例外，对于只有韵母的汉字（如『爱、啊』等），会先转成不带音标的普通风格。

如：`p y`

### 属性 `.STYLE_FIRST_LETTER`

首字母风格，只返回拼音的首字母部分。


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/hotoo/pinyin.js/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
