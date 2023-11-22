# pīnyīn (v3)

pīnyīn, 한자 병음 전환 툴。

----

[![NPM version][npm-badge]][npm-url]
[![Build Status][build-badge]][build-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Language Grade: JavaScript][lgtm-badge]][lgtm-url]
[![NPM downloads][npm-downloads]][npm-url]


[npm-badge]: https://img.shields.io/npm/v/pinyin.svg?style=flat
[npm-url]: https://www.npmjs.com/package/pinyin
[npm-downloads]: http://img.shields.io/npm/dm/pinyin.svg?style=flat
[build-badge]: https://github.com/hotoo/pinyin/actions/workflows/node.js.yml/badge.svg
[build-url]: https://github.com/hotoo/pinyin/actions
[coveralls-badge]: https://coveralls.io/repos/hotoo/pinyin/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/hotoo/pinyin
[lgtm-badge]: https://img.shields.io/lgtm/grade/javascript/g/hotoo/pinyin.svg?logo=lgtm&logoWidth=18
[lgtm-url]: https://lgtm.com/projects/g/hotoo/pinyin/context:javascript


Web Site: [简体中文](/) | [English](/en-US/) | 한국어

README: [简体中文](README.md) | [English](README.en-US.md) | 한국어


중국어 한자를 병음으로 변경할 수 있습니다. 한자의 발음을 표시하거나, 정렬, 검색할 수 있습니다. 

> 주의 : 이 버전은 Node와 Web 브라우저 환경을 동시에 지원합니다.
> Python 버전 확인하기 [mozillazg/python-pinyin](https://github.com/mozillazg/python-pinyin)

----

## 특징

* 구에 따라 매칭되는 가장 정확한 병음
* 다음(多音)자 지원
* 간단한 번체자 지원
* 여러 종류의 병음 형식 지원

## 설치

via npm:

```bash
npm install pinyin --save
```

## 사용법

개발자：

```typescript
import pinyin from "pinyin";

console.log(pinyin("中心"));    // [ [ 'zhōng' ], [ 'xīn' ] ]

console.log(pinyin("中心", {
  heteronym: true,              // 다음자 모드 ON
}));                            // [ [ 'zhōng', 'zhòng' ], [ 'xīn' ] ]

console.log(pinyin("中心", {
  heteronym: true,              // 다음자 모드 ON
  segment: true,                // 세그먼트 ON, 다음자 문제를 해결할 수 있음.
}));                            // [ [ 'zhōng' ], [ 'xīn' ] ]

console.log(pinyin("中心", {
  segment: "@node-rs/jieba",    // 세그먼트 지정. 예시) "nodejieba"、"segmentit"、"@node-rs/jieba"。
}));                            // [ [ 'zhōng' ], [ 'xīn' ] ]

console.log(pinyin("我喜欢你", {
  segment: "segmentit",         // 세그먼트 ON
  group: true,                  // 단어 묶기
}));                            // [ [ 'wǒ' ], [ 'xǐhuān' ], [ 'nǐ' ] ]

console.log(pinyin("中心", {
  style: "initials",            // 병음 형식 설정
  heteronym: true,              // 다음자여도 병음 형식이 설정되었기 떄문에 중복되는 것들은 합병될 수 있음.
}));                            // [ [ 'zh' ], [ 'x' ] ]

console.log(pinyin("华夫人", {
  mode: "surname",              // 인명모드
}));                            // [ ['huà'], ['fū'], ['rén'] ]
```

cli：

```bash
$ pinyin 中心
zhōng xīn
$ pinyin -h
```

## 타입

### IPinyinOptions

pinyin 메소드에 들어오는 두번째 파라미터의 선택 인자들

```typescript
export interface IPinyinOptions {
  style?: IPinyinStyle; // 병음출력형식
  mode?: IPinyinMode, // 병음모드
  // 세그먼트 저장소 지정
  // 구버전과의 호환성을 위해 boolean을 사용하여 세그먼트를 끄거나 켤 수 있음. 기본값은 true.
  segment?: IPinyinSegment | boolean;
  // 다음자를 반환 여부
  heteronym?: boolean;
  // 병음의 그룹화 여부  
  group?: boolean;
  compact?: boolean;
}
```

### IPinyinStyle

출력할 병음형식. 아래에 있는 형식을 직접 사용 할 수 있음. v2와 겸용하기 위해 v2의  `pinyin.STYLE_TONE`의 형식도 사용할 수 있음.

```typescript
export type IPinyinStyle =
  "normal" | "tone" | "tone2" | "to3ne" | "initials" | "first_letter" | // 소문자를 사용해서 출력되는 병음과 일치 시키는 것을 추천
  "NORMAL" | "TONE" | "TONE2" | "TO3NE" | "INITIALS" | "FIRST_LETTER" | // 이전 버전에서 옮기기 용이
  0        | 1      | 2       | 5       | 3          | 4;               // 이번 버전과 겸용
```

### IPinyinMode

병음모드, 기본값은 normal모드이고, 인명모드를 선택할 수 있음.

```typescript
// - NORMAL: normal모드
// - SURNAME: 이름모드, 성씨에 사용하는 병음 우선 사용。
export type IPinyinMode =
  "normal" | "surname" |
  "NORMAL" | "SURNAME";
```

### IPinyinSegment

세그먼트 메소드。

- 기본값은 꺼져 있음. `false`，
- `true`로 설정하여 켜고，Web 버전에서는 "segmentit" 세그먼트 사용，Node버전에서는 "nodejieba" 세그먼트 사용。
- 아래 정의된 문자열들을 사용하여 세그먼트 알고리즘을 정할 수 있습니다. 하지만 현재 Web 버전은 'segmentit'만 지원합니다.

```typescript
export type IPinyinSegment = "nodejieba" | "segmentit" | "@node-rs/jieba";
```

## API

### 메소드 `<Array> pinyin(words: string[, options: IPinyinOptions])`
입력된 중국어 문자열을 병음 문자열로 변환

`options` 파라미터는 선택사항이고, 다음자와 병음 형식을 구분한다.

`Array<Array<String>>`를 반환한다. 
만약 한자가 하나라도 다음자일 경우 여러 줄의 병음들이 반환된다.

### 메소드 `Number compare(a, b)`

병음의 순서를 정하는 기본 알고리즘

### 메소드 `string[][] compact(pinyinResult array[][])`

다음자의 다양한 병음들을 축약된 형태로 바꿔준다. 참고 options.compact 


## 参数 파라미터

### `<Boolean|IPinyinSegment> options.segment`

세그먼트 모드의 사용여부를 정하며, 중국어 세그먼트는 많은 다음자 문제를 해결하는데 도움이 된다.
하지만 성능은 매우 떨어질 수 있으며 메모리 사용양도 더 많을 수 있다.

- 기본값 : false
- 만약 `segment = true` 일 경우 nodejieba 세그먼트를 사용한다.
- "nodejieba"、"segmentit"、"@node-rs/jieba" 중에 세그먼트 형식을 정할 수 있다.

### `<Boolean> options.heteronym`

다음자 모드의 사용여부를 정하며 기본값은 false 다.

다음자 모드가 false 일때는 모든 한자에 첫번째로 매칭되는 병음을 반환한다.
다음자 모드가 true 일때는 다음자의 모든 병음들이 반환된다.

### `<Boolean> options.group`

병음 그룹화 설정, 예시 :

```
我喜欢你
wǒ xǐhuān nǐ
```

### `<IPinyinStyle> options.style`

병음의 형식을 정한다. 아래에 적혀 있는 특정 문자열들과 숫자 값들을 지정하여 사용할 수 있다.

```typescript
IPinyinStyle =
  "normal" | "tone" | "tone2" | "to3ne" | "initials" | "first_letter" | // 소문자 사용권장
  "NORMAL" | "TONE" | "TONE2" | "TO3NE" | "INITIALS" | "FIRST_LETTER" | // 구버전 마이그레이션 용이.
  0        | 1      | 2       | 5       | 3          | 4;               // 구버전과 겸용
```


#### `NORMAL`, `normal`

기본 형식, 성조가 나오지 않는다

如：`pin yin`

#### `TONE`, `tone`

성조 형식, 병음성조는 첫번째 음운 첫번째 자모 위에 있다.

주의 : default 값입니다.

예시：`pīn yīn`

#### `TONE2`, `tone2`

성조 형식2, 성조가 숫자[0-4]로 각각의 병음의 뒤에 표시된다. 

예시：`pin1 yin1`

#### `TO3NE`, `to3ne`

성조 형식3，병음성조는 첫번째 음운 첫번째 자모 뒤에 있다.

예시：`pi1n yi1n`

#### `INITIALS`, `initials`

성모 형식(병음의 성모 부분만 반환).성모가 없는 한자는 빈 문자열을 반환 한다.

예：`中国` 의 병음은 `zh g`

주의 : `zh` 와 `z`，`ch` 와 `c`，`sh` 와 `s`의 음운 형식을 구분할 수 있다.

주의 : 일부 한자는 성모가 없다. 예를 들어 `啊`，`饿` 등이 있고 `y`, `w`, `yu`도 성모가 아니다.
이런 한자 병음의 성모 형식은 `""`를 반환 한다. 목적이 initials 형식을 사용해야하는 것인지 확인 해야한다.
상세내용은 [왜 `y`, `w`, `yu` 일부 성모가 없나요？] 를 참고하주시기 바랍니다.(#为什么没有 -y-w-yu- 几个声母)

#### `FIRST_LETTER`, `first_letter`

첫글자의 모음 형식, 첫글자의 모음부분만 반환한다.

예：`p y`

### <string> options.mode

병음모드. 기본값은 "NORMAL" 보통 모드
만약 이름에 사용하는 것이 명확하다면, "SURNAME"을 사용하여 성씨의 정확한 병음을 알 수 있다.

- `NORMAL`：자동 모드, 자동으로 읽는 방법을 식별한다.
- `SURNAME`：이름모드, 이름이 명확한 경우 더 정확한 성씨의 병음을 식별한다.

### <boolean> options.compact

compact 모드, 기본값 false, 표준형식이 반환된다.

만약 true로 설정하면, 다음자가 있는 각종 경우들이 반환된다.

```
pinyin("你好吗", { compact:false });
> [[nǐ], [hǎo,hào], [ma,má,mǎ]]

pinyin("你好吗", { compact:true });
> [
>   [nǐ,hǎo,ma], [nǐ,hǎo,má], [nǐ,hǎo,mǎ],
>   [nǐ,hào,ma], [nǐ,hào,má], [nǐ,hào,mǎ],
> ]
```

만약 필요한 경우  `compact()`함수를 `pinyin(han, {compact:false})`대신 사용할 수 있다.

## Test

```bash
npm test
```

## Q&A

### Web 버전을 어떻게 사용하는지 관해서

우선, 서버단에서 1회성으로 실행하여 결과를 저장해서 사용하는 것을 권장하고, 클라이언트 단에서 매번 변환하면서 성능과 유저경험을 하락시키는 것을 지양한다.

만약 클라이언트단에서 사용하기로 했다면, [Webpack](http://webpack.github.io/) + [Babel](http://babeljs.io/)을 이용하여 번들링 할 수 있다.

고민하고 싶지 않다면 여기서 테스트 해볼 수 있다. https://github.com/hotoo/pinyin/tree/gh-pages/dist

### 왜 `y`, `w`, `yu` 일부 성모가 없나요？

성모형식(INITIALS)에는 “雨”、“我”、“圆”등 빈 문자열을 반환한다. 왜냐하면 《반어병음방안》에 근거하여
`y`，`w`，`ü (yu)`은 모두 성모가 아니다. 특정 어떤 운모가 소리가 없는 성모일 때, `y` 또는 `w`, 특정 규칙에 따라 `ü`를 붙일 수 있다.

만약 불편하다면, 성모가 없는 한자(예 “啊”、“饿”、“按”、“昂)를 사용하는 것을 조심하라.
이때 아마 첫글자의 성모 형식이 필요할 것이다.(FIRST_LETTER)

###  어떻게 병음으로 정렬 하나요?

pinyin js는 내장된 정렬 메소드를 제공한다:

```js
const pinyin = require('pinyin');

const data = '我要排序'.split('');
const sortedData = data.sort(pinyin.compare);
```

만약 내장된 정렬 비교함수가 요구에 맞지 않는다면 직접 비교함 수를 작성 할 수 있다:

```js
const pinyin = require('pinyin');

const data = '我要排序'.split('');

// 한자의 병음을 저장해 놓는 것을 권장한다.
const pinyinData = data.map(han => ({
  han: han,
  pinyin: pinyin(han)[0][0], // 병음을 생성하는 다른 방법이나 형식들을 선택할 수 있다.
}));
const sortedData = pinyinData.sort((a, b) => {
  return a.pinyin.localeCompare(b.pinyin);
}).map(d => d.han);
```

### node버전과 web버전은 어떤 차이가 있나요？

`pinyin` 현재 Node js 서버와 Web 브라우저에서 사용할 수 있습니다.
API와 사용방식도 완전히 일치합니다. 

하지만 Web버전은 Node버전보다 조금 간단합니다. 병음모음에 상용자 밖에 없기 때문에 세그먼트 알고리즘이 없습니다.

그래서 세그먼트과 번체 한자의 특성으로 인해, 결과가 일치 하지 않는 경우가 있습니다.

| 특성        | Web 버전                         | Node 버전                           |
|--------------|--------------------------------|----------------------------------|
| 병음모음       | 상용자모음, 압축, 합병           | 모든 글자 모음, 압축 없음, 합병           |
| 세그먼트        | 지원하지 않음                       | 세그먼트 알고리즘 사용, 다음자 병음이 더욱 정확함 |
| 병음빈도정렬 | 병음사용빈도가 높은 것들 우선 순위 | Web버전과 같음                       |
| 번체자 중국어     | 지원하지 않음             | 간단한 번체자와 간체자 변환           |

그러한 차이로 인해, 다른 환경에서 테스트 할 시 결과가 다를 수 있습니다.

## 도네이션

이 패키지가 도움이 되셨다면 스타 부탁드립니다.

알리페이나 위챗페이로 도네이션 할 수 있습니다.

<img src="https://hotoo.github.io/images/donate-hotoo.png" alt="Alipay:hotoo.cn@gmail.com, WeChat:hotoome" width="400" />

## 라이센스

[MIT](http://hotoo.mit-license.org/)
