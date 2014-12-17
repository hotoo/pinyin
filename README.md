# 汉字拼音转换工具

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
var pinyin = require("pinyin");

console.log(pinyin("重心"));    // [ [ 'zhong' ], [ 'xin' ] ]
console.log(pinyin("重心", {
  heteronym: true               // 启用多音字模式
}));                            // [ [ 'zhong', 'chong' ], [ 'xin' ] ]
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

options 是可选的，打开多音字选项。

返回二维数组，第一维每个数组项位置对应每个中文字符串位置。
第二维是各个汉字的读音列表，多音字会有多个拼音项。

### 参数 `<Boolean> options.heteronym`

是否启用多音字模式，默认关闭。

关闭多音字模式时，返回每个汉字第一个匹配的拼音。

启用多音字模式时，返回多音字的所有拼音列表。

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
pinyin: 131ms
31199232
```

可以看到运算时间约为源库12%，内存节省115M，仅为源库21%。

## Q&A

### 本库与fork源库有哪些差异

- 源库支持同时支持在Node和浏览器端，本库只考虑Node环境
- 源库支持基于词组的精确转换，如`重心`中的`重`，不会得到`chong`这个读音，本库去掉了这个特性
- 源库支持返回音调，本库不支持
- 源库支持简单的简繁转换，本库不支持
- 源库内存占用大，运算时间长，本库内存和运算时间均有大幅优化