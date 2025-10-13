---
sidebar: false
---

# pinyin cli

pinyin 명령줄 인터페이스(command line interface)입니다.

## 설치

```shell
npm i pinyin-cli -g
```

## 사용법

```shell
pinyin 中文

# 더 많은 사용법은:
pinyin -h
```

## 옵션

```
  -h, --help                   도움말 출력
  -V, --version                pinyin CLI 도구의 버전 출력
  -v, --version                pinyin CLI 도구의 버전 출력
  -s, --style <style>          pinyin 스타일: [NORMAL,TONE,TONE2,INITIALS,FIRST_LETTER]
  -m, --mode <mode>            pinyin 모드: [NORMAL,SURNAME]
  -S, --segment [segment]      단어 분할, "Intl.Segmenter", "nodejieba", "@node-rs/jieba", "segmentit" 지원
  -h, --heteronym              다음자(多音字) 여러 개의 병음 출력
  -g, --group                  단어를 그룹 형식으로 출력
  -c, --compact                압축 모드로 출력
  -p, --separator <separator>  구분자 지정
```
