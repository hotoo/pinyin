# pinyin cli 

pinyin 命令行界麵 (command line interface)。

## 安裝

```shell
npm i pinyin-cli -g
```

## 用法

```shell
pinyin 中文

# more usage see:
pinyin -h
```

## 選項

```
  -h, --help                   輸出幫助信息
  -V, --version                輸出 pinyin 命令行工具的版本號
  -v, --version                輸出 pinyin 命令行工具的版本號
  -s, --style <style>          pinyin 風格: [NORMAL,TONE,TONE2,INITIALS,FIRST_LETTER]
  -m, --mode <mode>            pinyin 模式: [NORMAL,SURNAME]
  -S, --segment [segment]      詞組分詞， 支持 "Intl.Segmenter", "nodejieba", "@node-rs/jieba", "segmentit"
  -h, --heteronym              多音字輸出多個拼音
  -g, --group                  詞組以分組格式輸出
  -c, --compact                輸出緊湊模式
  -p, --separator <separator>  指定分隔符
```
