import React, { useState, useEffect } from "react";
// import { pinyin } from "../../lib/umd/pinyin";
import { pinyin } from "pinyin";
import { JsonViewer } from "@textea/json-viewer";
import styles from "./index.module.css";

interface I18n {
  inputLabel: string; // 输入框文案
  outputLabel: string; // 输出框文案
  styleLabelNormal: string; // 风格选择文案
  styleLabelTone: string; // 风格选择文案
  styleLabelTone2: string; // 风格选择文案
  styleLabelTo3ne: string; // 风格选择文案
  styleLabelInitials: string; // 风格选择文案
  styleLabelFirstLetter: string; // 风格选择文案
  styleLabelPassport: string; // 风格选择文案
  segmentLabel: string; // 分词选项文案
  groupLabel: string; // 分组选项文案
  compactLabel: string; // 紧凑选项文案
  heteronymLabel: string; // 读音选项文案
  modeLabel: string; // 模式选项文案
}

export interface IExampleProps {
  i18n?: I18n;
}

export default function(props?: IExampleProps) {
  const han = "中文汉字";
  const [text, setText] = useState(han);
  const [style, setStyle] = useState("TONE");
  const [segment, setSegment] = useState("segmentit");
  const [group, setGroup] = useState(false);
  const [compact, setCompact] = useState(false);
  const [heteronym, setHeteronym] = useState(false);
  const [mode, setMode] = useState("NORMAL");

  const defaultI18n: I18n = {
    inputLabel: "输入汉字",
    outputLabel: "输出拼音",
    styleLabelNormal: "普通风格",
    styleLabelTone: "声调风格",
    styleLabelTone2: "音标风格(tone2)",
    styleLabelTo3ne: "音标风格(to3ne)",
    styleLabelInitials: "声母风格",
    styleLabelFirstLetter: "首字母风格",
    styleLabelPassport: "护照风格",
    segmentLabel: "词语分词",
    groupLabel: "词语分组",
    compactLabel: "输出紧凑格式",
    heteronymLabel: "输出多音字",
    modeLabel: "人名模式",
  };
  if (!props) {
    props = {};
  }
  const i18n = props?.i18n || defaultI18n;

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
      <h3>{i18n?.inputLabel}</h3>
      <div>
        <textarea className={styles.example} onChange={onChangeInput} defaultValue={text}></textarea>
      </div>
      <div className={styles.optionsBox}>
        <div className={styles.optionsLine}>
          <input type="radio" name="style" id="style-normal" value="NORMAL" checked={style==='NORMAL'} onChange={onChangeStyle} />
          <label className={styles.example} htmlFor="style-normal">{i18n?.styleLabelNormal}</label>

          <input type="radio" name="style" id="style-tone" value="TONE" checked={style==='TONE'} onChange={onChangeStyle} />
          <label className={styles.example} htmlFor="style-tone">{i18n?.styleLabelTone}</label>

          <input type="radio" name="style" id="style-tone2" value="TONE2" checked={style==='TONE2'} onChange={onChangeStyle} />
          <label className={styles.example} htmlFor="style-tone2">{i18n?.styleLabelTone2}</label>

          <input type="radio" name="style" id="style-to3ne" value="TO3NE" checked={style==='TO3NE'} onChange={onChangeStyle} />
          <label className={styles.example} htmlFor="style-to3ne">{i18n?.styleLabelTo3ne}</label>

          <input type="radio" name="style" id="style-initials" value="INITIALS" checked={style==='INITIALS'} onChange={onChangeStyle} />
          <label className={styles.example} htmlFor="style-initials">{i18n?.styleLabelInitials}</label>

          <input type="radio" name="style" id="style-first-letter" value="FIRST_LETTER" checked={style==='FIRST_LETTER'} onChange={onChangeStyle} />
          <label className={styles.example} htmlFor="style-first-letter">{i18n?.styleLabelFirstLetter}</label>

          <input type="radio" name="style" id="style-passport" value="PASSPORT" checked={style==='PASSPORT'} onChange={onChangeStyle} />
          <label className={styles.example} htmlFor="style-passport">{i18n?.styleLabelPassport}</label>
        </div>
        <div className={styles.optionsLine}>
          <input type="checkbox" name="segment" id="segment" value="segmentit" checked={segment==='segmentit'} onChange={onChangeSegment} />
          <label className={styles.example} htmlFor="segment">{i18n?.segmentLabel}</label>

          <input type="checkbox" name="group" id="group" value="" checked={group===true} onChange={onChangeGroup} />
          <label className={styles.example} htmlFor="group">{i18n?.groupLabel}</label>

          <input type="checkbox" name="compact" id="compact" value="" checked={compact===true} onChange={onChangeCompact} />
          <label className={styles.example} htmlFor="compact">{i18n?.compactLabel}</label>

          <input type="checkbox" name="heteronym" id="heteronym" value="" checked={heteronym===true} onChange={onChangeHeteronym} />
          <label className={styles.example} htmlFor="heteronym">{i18n?.heteronymLabel}</label>

          <input type="checkbox" name="mode" id="mode" value="" checked={mode==="SURNAME"} onChange={onChangeMode} />
          <label className={styles.example} htmlFor="mode">{i18n?.modeLabel}</label>
        </div>
      </div>
      <h3>输出</h3>
      <div>
        <pre className={styles.example}>{textPinyin}</pre>
        <JsonViewer value={json} className={styles.jsonView} />
      </div>
    </>
  );
}
