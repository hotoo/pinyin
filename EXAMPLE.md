# 演示文档

----

```jsx
import React, { useState, useEffect } from 'react';
import pinyin from 'pinyin';
import JSONViewer from 'react-json-view';

export default function() {
  const han = '中文汉字';
  const [text, setText] = useState(han);
  const [style, setStyle] = useState('TONE');
  const [segment, setSegment] = useState('');
  const [group, setGroup] = useState(false);
  const [compact, setCompact] = useState(false);
  const [heteronym, setHeteronym] = useState(false);
  const [mode, setMode] = useState('NORMAL');

  function onChangeInput(evt) {
    setText(evt.target.value);
  }
  function onChangeStyle(evt) {
    setStyle(evt.target.value)
  }

  function onChangeSegment() {
    setSegment(segment === 'segmentit' ? '' : 'segmentit');
  }

  function onChangeGroup() {
    setGroup(group === true ? false : true);
  }

  function onChangeCompact() {
    setCompact(compact === true ? false : true);
  }

  function onChangeHeteronym() {
    setHeteronym(heteronym === true ? false : true);
  }

  function onChangeMode() {
    setMode(mode === 'NORMAL' ? 'SURNAME' : 'NORMAL');
  }

  const json = pinyin(text, {
    style,
    mode,
    segment,
    group,
    compact,
    heteronym,
  });
  const textPinyin = json.join(' ');

  return (
    <>
      <h3>输入汉字</h3>
      <div>
        <textarea onChange={onChangeInput} defaultValue={text}></textarea>
      </div>
      <h3>输出</h3>
      <div>
        <input type="radio" name="style" id="style-normal" value="NORMAL" checked={style==='NORMAL'} onChange={onChangeStyle} />
        <label htmlFor="style-normal">普通风格</label>

        <input type="radio" name="style" id="style-tone" value="TONE" checked={style==='TONE'} onChange={onChangeStyle} />
        <label htmlFor="style-tone">声调风格</label>

        <input type="radio" name="style" id="style-tone2" value="TONE2" checked={style==='TONE2'} onChange={onChangeStyle} />
        <label htmlFor="style-tone2">音标风格(tone2)</label>

        <input type="radio" name="style" id="style-to3ne" value="TO3NE" checked={style==='TO3NE'} onChange={onChangeStyle} />
        <label htmlFor="style-to3ne">音标风格(to3ne)</label>

        <input type="radio" name="style" id="style-initials" value="INITIALS" checked={style==='INITIALS'} onChange={onChangeStyle} />
        <label htmlFor="style-initials">声母风格</label>

        <input type="radio" name="style" id="style-first-letter" value="FIRST_LETTER" checked={style==='FIRST_LETTER'} onChange={onChangeStyle} />
        <label htmlFor="style-first-letter">首字母风格</label>

        <input type="radio" name="style" id="style-passport" value="PASSPORT" checked={style==='PASSPORT'} onChange={onChangeStyle} />
        <label htmlFor="style-passport">护照风格</label>
      </div>
      <div>
        <input type="checkbox" name="segment" id="segment" value="segmentit" checked={segment==='segmentit'} onChange={onChangeSegment} />
        <label htmlFor="segment">词语分词</label>

        <input type="checkbox" name="group" id="group" value="" checked={group===true} onChange={onChangeGroup} />
        <label htmlFor="group">词语分组</label>

        <input type="checkbox" name="compact" id="compact" value="" checked={compact===true} onChange={onChangeCompact} />
        <label htmlFor="compact">输出紧凑格式</label>

        <input type="checkbox" name="heteronym" id="heteronym" value="" checked={heteronym===true} onChange={onChangeHeteronym} />
        <label htmlFor="heteronym">输出多音字</label>

        <input type="checkbox" name="mode" id="mode" value="" checked={mode==="SURNAME"} onChange={onChangeMode} />
        <label htmlFor="mode">人名模式</label>
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
