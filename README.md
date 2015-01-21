# 汉字拼音转换工具

[![npm](http://img.shields.io/npm/v/node-pinyin.svg)](https://www.npmjs.com/package/node-pinyin)
[![npm](http://img.shields.io/npm/l/node-pinyin.svg)](https://www.npmjs.com/package/node-pinyin)

> 本工具fork自<https://github.com/hotoo/pinyin>，原库以MIT协议开源，本库也以MIT协议开源。

## 功能

将汉字转为拼音，支持多音字。

## 安装

via npm:

```bash
npm install node-pinyin
```

## 用法

```js
var pinyin = require("node-pinyin");

console.log(pinyin("重心"));    // [ [ 'zhòng' ], [ 'xīn' ] ]
console.log(pinyin("重心", {
  heteronym: true               // 启用多音字模式
}));                            // [ [ 'zhòng', 'chóng' ], [ 'xīn' ] ]
```

命令行：

```bash
$ pinyin 重心
zhòng xīn
$ pinyin -h
```

## API

### 方法 `<Array> pinyin(words[, options])`

将传入的中文字符串(words)转换成拼音符号串。

options 是可选的，打开多音字选项和设定返回风格。

返回二维数组，第一维每个数组项位置对应每个中文字符串位置。
第二维是各个汉字的读音列表，多音字会有多个拼音项。

### 参数 `<Boolean> options.heteronym`

是否启用多音字模式，默认关闭。

关闭多音字模式时，返回每个汉字第一个匹配的拼音。

启用多音字模式时，返回多音字的所有拼音列表。

### 参数 `<String> options.style`

指定拼音 风格。可以通过以下几种属性值进行指定。

### `normal`

普通风格，即不带音标。

如：`pin yin`

### `tone`

声调风格，拼音声调在韵母第一个字母上。

注：这是默认的风格。

如：`pīn yīn`

### `toneWithNumber`

声调风格，即拼音声调在各个拼音之后，用数字 [0-4] 进行表示。

如：`pin1 yin1`

### `initials`

声母风格，只返回各个拼音的声母部分。

如：`中国` 的拼音 `zh g`

例外，对于只有韵母的汉字（如『爱、啊』等），会先转成不带音标的普通风格。

### `firstLetter`

首字母风格，只返回拼音的首字母部分。

如：`p y`


## Test

```
npm test
```

## 性能

源库由于启用了分词和词组匹配，导致内存占用极大，运算时间长，本库做了精简。

在`/benchmark`下可运行性能测试脚本，以`short.js`为例，在MacbookPro(2.5 GHz Intel Core i5 / 8 GB 1600 MHz DDR3)上：

源库输出

```bash
pinyin: 1076ms
146112512
```

本库输出

```bash
# 0.2.0
pinyin: 12ms
1150976

# 0.1.0
pinyin: 131ms
31199232
```

项目 | 源库 | 本库 | 百分比
----|------|-----|-----
运算时间 | 1076ms | 12ms | 1.11%
内存占用 | 139.3M | 1.1M | 0.79%

## Q&A

### 本库与fork源库有哪些差异

- 源库支持同时支持在Node和浏览器端，本库只考虑Node环境
- 源库支持基于词组的精确转换，如`重心`中的`重`，不会得到`chong`这个读音，本库去掉了这个特性
- 源库支持简单的简繁转换，本库不支持
- 源库内存占用大，运算时间长，本库内存和运算时间均有大幅优化

## 更新日志

### v0.2.0 (2015-01-21)

- 更新数据存储和读取机制，大幅减少运算时间(12ms)和内存占用(1.1M)
- 恢复代码风格选项

### v0.1.0 (2014-12-17)

- Fork初始发布
- 大幅减少运算时间(131ms)和内存占用(29.7M)
- 去掉源库分词特性
- 去掉词语库
- 去掉代码风格选项

