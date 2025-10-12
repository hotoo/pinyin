# pinyin cli 

pinyin 命令行界面 (command line interface)。

## 安装

```shell
npm i pinyin-cli -g
```

## 用法

```shell
pinyin 中文

# more usage see:
pinyin -h
```

## 选项

```
  -h, --help                   输出帮助信息
  -V, --version                输出 pinyin 命令行工具的版本号
  -v, --version                输出 pinyin 命令行工具的版本号
  -s, --style <style>          pinyin 风格: [NORMAL,TONE,TONE2,INITIALS,FIRST_LETTER]
  -m, --mode <mode>            pinyin 模式: [NORMAL,SURNAME]
  -S, --segment [segment]      词组分词， 支持 "Intl.Segmenter", "nodejieba", "@node-rs/jieba", "segmentit"
  -h, --heteronym              多音字输出多个拼音
  -g, --group                  词组以分组格式输出
  -c, --compact                输出紧凑模式
  -p, --separator <separator>  指定分隔符
```
