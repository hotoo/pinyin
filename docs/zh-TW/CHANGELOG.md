# CHANGELOG

----

## 4.0.0-alpha.0

- optionalPeerDependencies nodejieba, @node-rs/jieba, and segmentit.
- 打包為 esm 和 umd 格式。

## 3.1.0

- release 3.1.0, with output amd format.

## 3.0.0-alpha.7 (2023-11-20)

- feat: dynamic import optional dependencies.

## 3.0.0-alpha.6 (2023-11-12)

- feat: support [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) for segment.
- dict: 雪茄

## 3.0.0-alpha.5 (2022-07-12)

- fix: npm publish 中沒有保護 esm 目錄。
- fix: dict: 修復「呢」的拼音默認順序。
- feat: dict: 新增「行不行」詞語拼音。

## 3.0.0-alpha.4 (2022-04-01)

- dict: 「著落」拼音頻率調整。

## 3.0.0-alpha.3 (2022-03-27)

- fix: phrases dict of "蘋". #326

## 3.0.0-alpha.2 (2022-03-22)

- feat: pinyin implemention by typescript language.
- feat: full Hanzi support for Web browser and Node.js
- feat: segment support in Web browser and Node.js
- feat: ES module and CommonJS module.
- feat: support surname mode.
- feat: better compact method.
- fix: support specific segment for cli #322

## 2.11.1 (2022-03-09)

- deps(nodejieba): 鎖定 nodejieba 依賴版本 #315, #316

## 2.11.0 (2022-02-25)

- feat(surname): 支援姓氏拼音模式，優先處理姓氏讀音。 fixed #288

## 2.10.2 (2021-04-11)

- feat(cli): pinyin cli support group by phrases.

## 2.10.1 (2021-04-11)

- dict: fixed "〇桔嗎" pinyin dict.

## 2.10.0 (2021-04-11)

- feat(group): Support group
- dict: fixed "別鶴離鸞髒䄜" pinyin dict.

## 2.9.1 (2020-05-03)

- dict: fixed 氓's pinyin dict. #272

## 2.9.0 (2019-05-09)

- dict: upgrade web pinyin dict. #243

## 2.8.3 (2017-03-31)

- fixed: 賈，默認讀音改為：jiǎ #130

## 2.8.2 (2017-03-13)

- dict: 廈門。fixed #122

## 2.8.0 (2016-07-18)

- feat(compare): Add pinyin.compare for sort by pinyin. #104, #106.

## 2.7.4 (2016-07-01)

- fixed phrases dict. #102, #103.

## 2.7.3 (2016-05-15)

- fixed 的's pinyin. #94, #95

## 2.7.2 (2016-05-11)

- 修復了詞典拼音庫。 #93

## 2.7.1 (2016-02-22)

* fix(web): use strict. #82

## 2.7.0 (2016-02-04)

* feat(TO3NE): TONE style by number [0-4] after phonetic notation character. #79

## 2.6.2 (2015-08-25)

* Add iojs-3 support. #60, #61, #62.

## 2.6.1 (2015-08-23)

* #57, #58 根據《漢語拼音方案》，`y`, `w`, 不是聲母。
* #56 `ü` (yu) 不是聲母。

## 2.6.0 (2015-08-12)

* deps(nodejieba): nodejieba is optional dependency now. fixed #45.
* test(eslint): update code style and test by eslint.

## 2.5.1 (2015-08-01)

* deps(nodejieba): upgrade nodejieba@1.2.2

## 2.5.0 (2015-06-18)

* featute（分詞）: 增加分詞選項，默認不開啟分詞（不兼容選項） #45
* test(performance): 增加了性能測試。

## 2.4.4 (2015-06-08)

* Upgrade dependency nodejieba@1.0.1, fixed #41

## 2.4.3 (2015-06-08)

* Fixed #40 更新 nodejieba 依賴，修復 nodejieba 對 iojs@2.0 的支持。

## 2.4.2 (2015-05-14)

* Fixed #38 , 結巴分詞的詞典路徑問題。

## 2.4.1 (2015-05-13)

* Fixed: #33, #37 `便宜`

## 2.4.0 (2015--05-13)

* Update 分詞模塊從 Segment 切換為 Jieba。fixed #36

## 2.3.3 (2014-07-29)

* Fixed #17 多音詞『朝陽』

## 2.3.2 (2014-06-03)

* 由於 #15, npm@1.4.12 的 bug 導致在 npmjs.org 發布的 pinyin@2.3.0 和
  pinyin@2.3.1 shasum 值計算錯誤，新版 npm 無法正常安裝，所以下線處理，
  並發布了 pinyin@2.3.2。

## 2.3.1 (2014-05-27)

* 更新了針對 Web 環境的拼音庫，使用 3500 個常用字庫。

## 2.3.0 (2014-05-15)

* 託 spm@3.x 的福，Node 和 Web 版融合到一個倉庫中。hotoo/node-pinyin 即將下線。

## 2.2.1 (2014-05-24)

* Fixed: hotoo/node-pinyin#23 , extend(default, more.hasOwnProperty is not function).

## 2.2.0 (2014-02-17)

* Update: 使用全新的，較為完整的拼音庫。
* Update: 部分算法有調整。

## 2.1.3 (2014-02-06)

* Fixed hotoo/node-pinyin#19, missing some words.

## 2.1.2 (2014-01-26)

* Fixed #12, 補充缺失的『楞』字拼音。

## 2.1.1 (2013-09-08)

* Fixed: 補充缺失的『特』字拼音。
* Fixed: hotoo/node-pinyin#16, 部分修復了忽略空白的問題。

## 2.0.2 (2013-08-09)

* hotoo/node-pinyin#9 新增命令行支援。 Thanks @lyuehh

## 2.1.0 (2013-07-12)

* #6 調整返回的結果集結構，非漢字部分以原始字符和原始風格返回。

  ```
  spm install hotoo/pinyin@2.1.0
  ```

### for Node

* Fix: 直接操作拼音庫，影響後續的拼音轉換正確性問題。
* Update: 非中文原樣返回，不做任何處理。
* Add: 完善測試用例。
* Update: 其他的一些優化。
