# 演示文档

---

````javascript
seajs.use('pinyin', function(pinyin){
  console.log(pinyin("重点"));
  console.log(pinyin("重点", {
    style: pinyin.STYLE_NORMAL,
    heteronym: true
  }));
  console.log(pinyin("啊", {
    style: pinyin.STYLE_FIRST_LETTER,
    heteronym: true
  }));
});
````
