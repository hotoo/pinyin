---
sidebar: false
---

# pinyin cli 

pinyin command line interface.

## Install

```shell
npm i pinyin-cli -g
```

## Usage

```shell
pinyin 中文

# more usage see:
pinyin -h
```

## Options

```
  -h, --help                   output usage information
  -V, --version                output the version number
  -v, --version                output the version number
  -s, --style <style>          pinyin styles: [NORMAL,TONE,TONE2,INITIALS,FIRST_LETTER]
  -m, --mode <mode>            pinyin mode: [NORMAL,SURNAME]
  -S, --segment [segment]      segmentation word to phrases, support "Intl.Segmenter", "nodejieba", "@node-rs/jieba", "segmentit"
  -h, --heteronym              output heteronym pinyins
  -g, --group                  output group by phrases
  -c, --compact                output the compact pinyin result
  -p, --separator <separator>  separator between words
```