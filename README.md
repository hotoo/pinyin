
# JavaScript 拼音

用 Javascript 将汉字转为拼音，方便汉字注音、排序。

支持将汉字转换为多种不同风格的拼音。

## 安装

暂时未托管到 npmjs.org

    git clone git://github.com/hotoo/node-pinyin.git
    npm install ./node-pinyin

## 用法

    var pinyin = require("pinyin");

    console.log(pinyin("中心"));    // [ [ 'zhōng' ], [ 'xīn' ] ]
    console.log(pinyin("中心", {
      heteronym: true               // 启用多音字模式
    }));                            // [ [ 'zhōng', 'zhòng' ], [ 'xīn' ] ]
    console.log(pinyin("中心", {
      style: pinyin.STYLE_INITIALS, // 设置拼音风格
      heteronym: true
    }));                            // [ [ 'zh' ], [ 'x' ] ]


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

## 参考

* [在线汉语字典](http://zi.artx.cn/zi/)
* [快典网](http://py.kdd.cc/)
* [将汉字转换成拼音](https://code.google.com/p/chinese-character-2-pinyin/)
* [字符转拼音 javascript pinyin](http://www.cnblogs.com/jinweijie/archive/2008/02/03/1063289.html)
  ([pinyin.rar](http://cid-80b2ed83de3c7c17.skydrive.live.com/self.aspx/Code/pinyin.rar))
* [Javascript Input Method Editors](http://jsime.sourceforge.net/) ([中文](http://leen.name/ime/pinyin.html), [En](http://leen.name/ime/english.html))
* [现在汉语的词汇数量及分布](http://blog.cathayan.org/item/1593) -
  可以考虑通过分词算法的配合提高拼音准确率。不过词库如此之大，作为 JavaScript
  库似乎不是很合适。往后再说。
