
# 汉语拼音转换工具(JavaScript 版)

将汉语转为拼音。可以用于汉字注音、排序、检索。

Python 版请关注 [mozillazg/python-pinyin](https://github.com/mozillazg/python-pinyin)

## 特性

* 根据词组智能匹配最正确的拼音。
* 支持多音字。
* 简单的繁体支持。
* 支持多种不同拼音风格。

## 安装

```
npm install pinyinjs
```

## 用法

开发者：

```js
var pinyin = require("pinyinjs");

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

```sh
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

### 静态属性 `.STYLE_FIRST_LETTER`

首字母风格，只返回拼音的首字母部分。

如：`p y`

## Q&A

### 为什么 node 版和 Web 版的拼音程序要有两个不同的仓库？

pinyin 目前有运行在浏览器端的 [Web版](https://github.com/hotoo/pinyin.js)
和运行在服务端的 [Node版](https://github.com/hotoo/node-pinyin)

其中 Web版较 Node版稍简单，没有使用分词算法，并且考虑了网络传输对词库进行了压缩处理。

| 特性         | Web版                                     | Node版                           |
|--------------|-------------------------------------------|----------------------------------|
| 拼音库       | 合并压缩拼音库。加载完成后使用算法解压。 | 原始格式，没有压缩。             |
| 分词         | 没有分词                                  | 使用分词算法，多音字拼音更准确。 |
| 拼音频度排序 | 有根据拼音使用频度优先级排序。            | 同 Web版。                       |
| 繁体中文     | 没有繁体中文支持。                        | 有简单的繁简汉字转换。           |

### 为什么不使用更好的繁简转换？

对于拼音来说，把繁简汉字做简单的映射并转换成拼音是合理的。
而使用类似 [cconv](https://code.google.com/p/cconv/) 这样的转换库，虽然转换结果更
符合本地化语境，但是对于汉字变化后的拼音来说，已经不是繁体原字的拼音了。


## 参考

* [在线汉语字典](http://zi.artx.cn/zi/)
* [快典网](http://py.kdd.cc/)
* [将汉字转换成拼音](https://code.google.com/p/chinese-character-2-pinyin/)
* [字符转拼音 javascript pinyin](http://www.cnblogs.com/jinweijie/archive/2008/02/03/1063289.html)
  ([pinyin.rar](http://cid-80b2ed83de3c7c17.skydrive.live.com/self.aspx/Code/pinyin.rar))
* [Javascript Input Method Editors](http://jsime.sourceforge.net/) ([中文](http://leen.name/ime/pinyin.html), [En](http://leen.name/ime/english.html))
* [现在汉语的词汇数量及分布](http://blog.cathayan.org/item/1593)
