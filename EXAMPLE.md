# 演示文档

----

```jsx
import React, { useState, useEffect } from 'react';
import pinyin from 'pinyin';
import JSONViewer from 'react-json-view';

export default function() {
  const han = '中文汉字';
  const [text, setText] = useState(han);
  const [style, setStyle] = useState('STYLE_TONE');

  function onChangeInput(evt) {
    setText(evt.target.value);
  }
  function onChangeStyle(evt) {
    setStyle(evt.target.value)
  }

  const json = pinyin(text, {
    style: pinyin[style],
  });
  const textPinyin = json.join(' ');

  return (
    <>
      <h3>输入汉字</h3>
      <div>
        <textarea onChange={onChangeInput}>{text}</textarea>
      </div>
      <h3>输出</h3>
      <div>
        <input type="radio" name="style" id="style-normal" value="STYLE_NORMAL" checked={style==='NORMAL'} onChange={onChangeStyle} />
        <label for="style-normal">普通风格</label>
        <input type="radio" name="style" id="style-tone" value="STYLE_TONE" checked={style==='STYLE_TONE'} onChange={onChangeStyle} />
        <label for="style-tone">声调风格</label>
        <input type="radio" name="style" id="style-tone2" value="STYLE_TONE2" checked={style==='STYLE_TONE2'} onChange={onChangeStyle} />
        <label for="style-tone2">音标风格</label>
        <input type="radio" name="style" id="style-initials" value="STYLE_INITIALS" checked={style==='STYLE_INITIALS'} onChange={onChangeStyle} />
        <label for="style-initials">声母风格</label>
        <input type="radio" name="style" id="style-first-letter" value="STYLE_FIRST_LETTER" checked={style==='STYLE_FIRST_LETTER'} onChange={onChangeStyle} />
        <label for="style-first-letter">首字母风格</label>
      </div>
      <div>
        <pre>{textPinyin}</pre>
        <JSONViewer src={json} name={false} enableClipboard={false} />
      </div>
    </>
  );
}
```

<style>
textarea, pre{
  width:90%; height:100px;
  border: 1px solid #eee;
  padding: 10px;
}
pre {
  background-color: #f8f8f8;
}
</style>
