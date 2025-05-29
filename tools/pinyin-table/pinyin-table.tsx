/**
 * inline: true
 */
import React, { useState, useEffect, useRef } from "react";
import { PinyinTableProvider, usePinyinTable } from "./context";
import "./pinyin-table.css";

interface PinyinCellProps {
  className?: string;
  pinyin?: string;
  children?: React.ReactNode;
}

function PinyinCell({ className, pinyin, children }: PinyinCellProps) {
  const { playingPinyin, handlePlay } = usePinyinTable();
  const CLS = `pinyin_audio ${className}`;
  const [cls, setCls] = useState(CLS);
  const py = pinyin || children;
  const audioSrc = `/audio/${py}.mp3`;
  const audio = useRef(null);
  // audio.current.preload = "none";

  useEffect(() => {
    if (playingPinyin === py) {
      audio.current?.play();
      setCls(`${CLS} playing-audio`);
    } else {
      audio.current?.pause();
      audio.current.currentTime = 0; // 重置音频播放位置
      setCls(CLS);
    }
  }, [playingPinyin]);

  const onClickCell = () => {
    handlePlay?.(py);
  };
  audio.current?.addEventListener("playing", function () {
    setCls(`${CLS} playing-audio`);
  });
  audio.current?.addEventListener("ended", function () {
    setCls(CLS);
    handlePlay?.("");
  });

  return (
    <td className={cls} onClick={onClickCell}>
      {children}
      <audio preload="none" ref={audio}>
        <source src={audioSrc} type="audio/mp3" />
      </audio>
    </td>
  );
}

export default function PinyinTable() {
  return (
    <PinyinTableProvider>
      <table>
        <thead>
          <tr>
            <th className="light_green ">声母</th>
            <th className="light_green " colSpan="18">韵母</th>
            <th className="light_green " colSpan="9">介母音i</th>
            <th className="light_green " colSpan="8">介母音u</th>
            <th className="light_green " colSpan="3">介母音ü</th>
          </tr>
          <tr>
            <th className="light_green "></th>
            <td className="light_green ">a</td>
            <td className="light_green ">o</td>
            <td className="light_green ">e</td>
            <td className="light_green ">-i[ʅ]</td>
            <td className="light_green ">-i[ɿ]</td>
            <td className="light_green ">i[i]</td>
            <td className="light_green ">u</td>
            <td className="light_green ">ü</td>
            <td className="light_green ">er</td>
            <td className="light_green ">ai</td>
            <td className="light_green ">ei</td>
            <td className="light_green ">ao</td>
            <td className="light_green ">ou</td>
            <td className="light_green ">an</td>
            <td className="light_green ">en</td>
            <td className="light_green ">ang</td>
            <td className="light_green ">eng</td>
            <td className="light_green ">-ong</td>
            <td className="light_green ">ia</td>
            <td className="light_green ">iao</td>
            <td className="light_green ">ie</td>
            <td className="light_green ">iou</td>
            <td className="light_green ">ian</td>
            <td className="light_green ">in</td>
            <td className="light_green ">iang</td>
            <td className="light_green ">ing</td>
            <td className="light_green ">iong</td>
            <td className="light_green ">ua</td>
            <td className="light_green ">uo</td>
            <td className="light_green ">uai</td>
            <td className="light_green ">uei</td>
            <td className="light_green ">uan</td>
            <td className="light_green ">uen</td>
            <td className="light_green ">uang</td>
            <td className="light_green ">ueng</td>
            <td className="light_green ">üe</td>
            <td className="light_green ">üan</td>
            <td className="light_green ">ün</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className="light_green "></th>
            <PinyinCell className="pink">a</PinyinCell>
            <PinyinCell className="pink">o</PinyinCell>
            <PinyinCell className="pink">e</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink">yi</PinyinCell>
            <PinyinCell className="pink">wu</PinyinCell>
            <PinyinCell className="pink">yu</PinyinCell>
            <PinyinCell className="pink">er</PinyinCell>
            <PinyinCell className="orange">ai</PinyinCell>
            <PinyinCell className="orange">ei</PinyinCell>
            <PinyinCell className="orange">ao</PinyinCell>
            <PinyinCell className="orange">ou</PinyinCell>
            <PinyinCell className="blue">an</PinyinCell>
            <PinyinCell className="blue ">en</PinyinCell>
            <PinyinCell className="blue ">ang</PinyinCell>
            <PinyinCell className="blue ">eng</PinyinCell>
            <td className="blue "></td>
            <PinyinCell className="yellow ">ya</PinyinCell>
            <PinyinCell className="yellow ">yao</PinyinCell>
            <PinyinCell className="yellow ">ye</PinyinCell>
            <PinyinCell className="yellow ">you</PinyinCell>
            <PinyinCell className="yellow ">yan</PinyinCell>
            <PinyinCell className="yellow ">yin</PinyinCell>
            <PinyinCell className="yellow ">yang</PinyinCell>
            <PinyinCell className="yellow ">ying</PinyinCell>
            <PinyinCell className="yellow ">yong</PinyinCell>
            <PinyinCell className="purple ">wa</PinyinCell>
            <PinyinCell className="purple ">wo</PinyinCell>
            <PinyinCell className="purple ">wai</PinyinCell>
            <PinyinCell className="purple ">wei</PinyinCell>
            <PinyinCell className="purple ">wan</PinyinCell>
            <PinyinCell className="purple ">wen</PinyinCell>
            <PinyinCell className="purple ">wang</PinyinCell>
            <PinyinCell className="purple ">weng</PinyinCell>
            <PinyinCell className="emerald ">yue</PinyinCell>
            <PinyinCell className="emerald ">yuan</PinyinCell>
            <PinyinCell className="emerald ">yun</PinyinCell>
          </tr>
          <tr>
            <th className="light_green ">b</th>
            <PinyinCell className="pink ">ba</PinyinCell>
            <PinyinCell className="pink ">bo</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">bi</PinyinCell>
            <PinyinCell className="pink ">bu</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">bai</PinyinCell>
            <PinyinCell className="orange ">bei</PinyinCell>
            <PinyinCell className="orange ">bao</PinyinCell>
            <td className="orange "></td>
            <PinyinCell className="blue ">ban</PinyinCell>
            <PinyinCell className="blue ">ben</PinyinCell>
            <PinyinCell className="blue ">bang</PinyinCell>
            <PinyinCell className="blue ">beng</PinyinCell>
            <td className="blue "></td>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">biao</PinyinCell>
            <PinyinCell className="yellow ">bie</PinyinCell>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">bian</PinyinCell>
            <PinyinCell className="yellow ">bin</PinyinCell>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">bing</PinyinCell>
            <td className="yellow "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">p</th>
            <PinyinCell className="pink ">pa</PinyinCell>
            <PinyinCell className="pink ">po</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">pi</PinyinCell>
            <PinyinCell className="pink ">pu</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">pai</PinyinCell>
            <PinyinCell className="orange ">pei</PinyinCell>
            <PinyinCell className="orange ">pao</PinyinCell>
            <PinyinCell className="orange ">pou</PinyinCell>
            <PinyinCell className="blue ">pan</PinyinCell>
            <PinyinCell className="blue ">pen</PinyinCell>
            <PinyinCell className="blue ">pang</PinyinCell>
            <PinyinCell className="blue ">peng</PinyinCell>
            <td className="blue "></td>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">piao</PinyinCell>
            <PinyinCell className="yellow ">pie</PinyinCell>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">pian</PinyinCell>
            <PinyinCell className="yellow ">pin</PinyinCell>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">ping</PinyinCell>
            <td className="yellow "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">m</th>
            <PinyinCell className="pink ">ma</PinyinCell>
            <PinyinCell className="pink ">mo</PinyinCell>
            <PinyinCell className="pink ">me</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">mi</PinyinCell>
            <PinyinCell className="pink ">mu</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">mai</PinyinCell>
            <PinyinCell className="orange ">mei</PinyinCell>
            <PinyinCell className="orange ">mao</PinyinCell>
            <PinyinCell className="orange ">mou</PinyinCell>
            <PinyinCell className="blue ">man</PinyinCell>
            <PinyinCell className="blue ">men</PinyinCell>
            <PinyinCell className="blue ">mang</PinyinCell>
            <PinyinCell className="blue ">meng</PinyinCell>
            <td className="blue "></td>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">miao</PinyinCell>
            <PinyinCell className="yellow ">mie</PinyinCell>
            <PinyinCell className="yellow ">miu</PinyinCell>
            <PinyinCell className="yellow ">mian</PinyinCell>
            <PinyinCell className="yellow ">min</PinyinCell>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">ming</PinyinCell>
            <td className="yellow "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">f</th>
            <PinyinCell className="pink ">fa</PinyinCell>
            <PinyinCell className="pink ">fo</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">fu</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="orange "></td>
            <PinyinCell className="orange ">fei</PinyinCell>
            <td className="orange "></td>
            <PinyinCell className="orange ">fou</PinyinCell>
            <PinyinCell className="blue ">fan</PinyinCell>
            <PinyinCell className="blue ">fen</PinyinCell>
            <PinyinCell className="blue ">fang</PinyinCell>
            <PinyinCell className="blue ">feng</PinyinCell>
            <td className="blue "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">d</th>
            <PinyinCell className="pink ">da</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">de</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">di</PinyinCell>
            <PinyinCell className="pink ">du</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">dai</PinyinCell>
            <PinyinCell className="orange ">dei</PinyinCell>
            <PinyinCell className="orange ">dao</PinyinCell>
            <PinyinCell className="orange ">dou</PinyinCell>
            <PinyinCell className="blue ">dan</PinyinCell>
            <PinyinCell className="blue ">den</PinyinCell>
            <PinyinCell className="blue ">dang</PinyinCell>
            <PinyinCell className="blue ">deng</PinyinCell>
            <PinyinCell className="blue ">dong</PinyinCell>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">diao</PinyinCell>
            <PinyinCell className="yellow ">die</PinyinCell>
            <PinyinCell className="yellow ">diu</PinyinCell>
            <PinyinCell className="yellow ">dian</PinyinCell>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">ding</PinyinCell>
            <td className="yellow "></td>
            <td className="purple "></td>
            <PinyinCell className="purple ">duo</PinyinCell>
            <td className="purple "></td>
            <PinyinCell className="purple ">dui</PinyinCell>
            <PinyinCell className="purple ">duan</PinyinCell>
            <PinyinCell className="purple ">dun</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">t</th>
            <PinyinCell className="pink ">ta</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">te</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">ti</PinyinCell>
            <PinyinCell className="pink ">tu</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">tai</PinyinCell>
            <td className="orange "></td>
            <PinyinCell className="orange ">tao</PinyinCell>
            <PinyinCell className="orange ">tou</PinyinCell>
            <PinyinCell className="blue ">tan</PinyinCell>
            <td className="blue "></td>
            <PinyinCell className="blue ">tang</PinyinCell>
            <PinyinCell className="blue ">teng</PinyinCell>
            <PinyinCell className="blue ">tong</PinyinCell>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">tiao</PinyinCell>
            <PinyinCell className="yellow ">tie</PinyinCell>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">tian</PinyinCell>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">ting</PinyinCell>
            <td className="yellow "></td>
            <td className="purple "></td>
            <PinyinCell className="purple ">tuo</PinyinCell>
            <td className="purple "></td>
            <PinyinCell className="purple ">tui</PinyinCell>
            <PinyinCell className="purple ">tuan</PinyinCell>
            <PinyinCell className="purple ">tun</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">n</th>
            <PinyinCell className="pink ">na</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">ne</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">ni</PinyinCell>
            <PinyinCell className="pink ">nu</PinyinCell>
            <PinyinCell className="pink " pinyin="nv">nü</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="orange ">nai</PinyinCell>
            <PinyinCell className="orange ">nei</PinyinCell>
            <PinyinCell className="orange ">nao</PinyinCell>
            <PinyinCell className="orange ">nou</PinyinCell>
            <PinyinCell className="blue ">nan</PinyinCell>
            <PinyinCell className="blue ">nen</PinyinCell>
            <PinyinCell className="blue ">nang</PinyinCell>
            <PinyinCell className="blue ">neng</PinyinCell>
            <PinyinCell className="blue ">nong</PinyinCell>
            <td className="yellow "></td>
            <PinyinCell className="yellow ">niao</PinyinCell>
            <PinyinCell className="yellow ">nie</PinyinCell>
            <PinyinCell className="yellow ">niu</PinyinCell>
            <PinyinCell className="yellow ">nian</PinyinCell>
            <PinyinCell className="yellow ">nin</PinyinCell>
            <PinyinCell className="yellow ">niang</PinyinCell>
            <PinyinCell className="yellow ">ning</PinyinCell>
            <td className="yellow "></td>
            <td className="purple "></td>
            <PinyinCell className="purple ">nuo</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <PinyinCell className="purple ">nuan</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <PinyinCell className="emerald " pinyin="nve">nüe</PinyinCell>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">l</th>
            <PinyinCell className="pink ">la</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">le</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">li</PinyinCell>
            <PinyinCell className="pink ">lu</PinyinCell>
            <PinyinCell className="pink " pinyin="lv">lü</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="orange ">lai</PinyinCell>
            <PinyinCell className="orange ">lei</PinyinCell>
            <PinyinCell className="orange ">lao</PinyinCell>
            <PinyinCell className="orange ">lou</PinyinCell>
            <PinyinCell className="blue ">lan</PinyinCell>
            <td className="blue "></td>
            <PinyinCell className="blue ">lang</PinyinCell>
            <PinyinCell className="blue ">leng</PinyinCell>
            <PinyinCell className="blue ">long</PinyinCell>
            <PinyinCell className="yellow ">lia</PinyinCell>
            <PinyinCell className="yellow ">liao</PinyinCell>
            <PinyinCell className="yellow ">lie</PinyinCell>
            <PinyinCell className="yellow ">liu</PinyinCell>
            <PinyinCell className="yellow ">lian</PinyinCell>
            <PinyinCell className="yellow ">lin</PinyinCell>
            <PinyinCell className="yellow ">liang</PinyinCell>
            <PinyinCell className="yellow ">ling</PinyinCell>
            <td className="yellow "></td>
            <td className="purple "></td>
            <PinyinCell className="purple ">luo</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <PinyinCell className="purple ">luan</PinyinCell>
            <PinyinCell className="purple ">lun</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <PinyinCell className="emerald " pinyin="lve">lüe</PinyinCell>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">g</th>
            <PinyinCell className="pink ">ga</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">ge</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">gu</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">gai</PinyinCell>
            <PinyinCell className="orange ">gei</PinyinCell>
            <PinyinCell className="orange ">gao</PinyinCell>
            <PinyinCell className="orange ">gou</PinyinCell>
            <PinyinCell className="blue ">gan</PinyinCell>
            <PinyinCell className="blue ">gen</PinyinCell>
            <PinyinCell className="blue ">gang</PinyinCell>
            <PinyinCell className="blue ">geng</PinyinCell>
            <PinyinCell className="blue ">gong</PinyinCell>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <PinyinCell className="purple ">gua</PinyinCell>
            <PinyinCell className="purple ">guo</PinyinCell>
            <PinyinCell className="purple ">guai</PinyinCell>
            <PinyinCell className="purple ">gui</PinyinCell>
            <PinyinCell className="purple ">guan</PinyinCell>
            <PinyinCell className="purple ">gun</PinyinCell>
            <PinyinCell className="purple ">guang</PinyinCell>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">k</th>
            <PinyinCell className="pink ">ka</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">ke</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">ku</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">kai</PinyinCell>
            <PinyinCell className="orange ">kei</PinyinCell>
            <PinyinCell className="orange ">kao</PinyinCell>
            <PinyinCell className="orange ">kou</PinyinCell>
            <PinyinCell className="blue ">kan</PinyinCell>
            <PinyinCell className="blue ">ken</PinyinCell>
            <PinyinCell className="blue ">kang</PinyinCell>
            <PinyinCell className="blue ">keng</PinyinCell>
            <PinyinCell className="blue ">kong</PinyinCell>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <PinyinCell className="purple ">kua</PinyinCell>
            <PinyinCell className="purple ">kuo</PinyinCell>
            <PinyinCell className="purple ">kuai</PinyinCell>
            <PinyinCell className="purple ">kui</PinyinCell>
            <PinyinCell className="purple ">kuan</PinyinCell>
            <PinyinCell className="purple ">kun</PinyinCell>
            <PinyinCell className="purple ">kuang</PinyinCell>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">h</th>
            <PinyinCell className="pink ">ha</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">he</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">hu</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">hai</PinyinCell>
            <PinyinCell className="orange ">hei</PinyinCell>
            <PinyinCell className="orange ">hao</PinyinCell>
            <PinyinCell className="orange ">hou</PinyinCell>
            <PinyinCell className="blue ">han</PinyinCell>
            <PinyinCell className="blue ">hen</PinyinCell>
            <PinyinCell className="blue ">hang</PinyinCell>
            <PinyinCell className="blue ">heng</PinyinCell>
            <PinyinCell className="blue ">hong</PinyinCell>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <PinyinCell className="purple ">hua</PinyinCell>
            <PinyinCell className="purple ">huo</PinyinCell>
            <PinyinCell className="purple ">huai</PinyinCell>
            <PinyinCell className="purple ">hui</PinyinCell>
            <PinyinCell className="purple ">huan</PinyinCell>
            <PinyinCell className="purple ">hun</PinyinCell>
            <PinyinCell className="purple ">huang</PinyinCell>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">j</th>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">ji</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">ju</PinyinCell>
            <td className="pink "></td>
            <td className="orange "></td>
            <td className="orange "></td>
            <td className="orange "></td>
            <td className="orange "></td>
            <td className="blue "></td>
            <td className="blue "></td>
            <td className="blue "></td>
            <td className="blue "></td>
            <td className="blue "></td>
            <PinyinCell className="yellow ">jia</PinyinCell>
            <PinyinCell className="yellow ">jiao</PinyinCell>
            <PinyinCell className="yellow ">jie</PinyinCell>
            <PinyinCell className="yellow ">jiu</PinyinCell>
            <PinyinCell className="yellow ">jian</PinyinCell>
            <PinyinCell className="yellow ">jin</PinyinCell>
            <PinyinCell className="yellow ">jiang</PinyinCell>
            <PinyinCell className="yellow ">jing</PinyinCell>
            <PinyinCell className="yellow ">jiong</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <PinyinCell className="emerald ">jue</PinyinCell>
            <PinyinCell className="emerald ">juan</PinyinCell>
            <PinyinCell className="emerald ">jun</PinyinCell>
          </tr>
          <tr>
            <th className="light_green ">q</th>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">qi</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">qu</PinyinCell>
            <td className="pink "></td>
            <td className="orange "></td>
            <td className="orange "></td>
            <td className="orange "></td>
            <td className="orange "></td>
            <td className="blue "></td>
            <td className="blue "></td>
            <td className="blue "></td>
            <td className="blue "></td>
            <td className="blue "></td>
            <PinyinCell className="yellow ">qia</PinyinCell>
            <PinyinCell className="yellow ">qiao</PinyinCell>
            <PinyinCell className="yellow ">qie</PinyinCell>
            <PinyinCell className="yellow ">qiu</PinyinCell>
            <PinyinCell className="yellow ">qian</PinyinCell>
            <PinyinCell className="yellow ">qin</PinyinCell>
            <PinyinCell className="yellow ">qiang</PinyinCell>
            <PinyinCell className="yellow ">qing</PinyinCell>
            <PinyinCell className="yellow ">qiong</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <PinyinCell className="emerald ">que</PinyinCell>
            <PinyinCell className="emerald ">quan</PinyinCell>
            <PinyinCell className="emerald ">qun</PinyinCell>
          </tr>
          <tr>
            <th className="light_green ">x</th>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">xi</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">xu</PinyinCell>
            <td className="pink "></td>
            <td className="orange "></td>
            <td className="orange "></td>
            <td className="orange "></td>
            <td className="orange "></td>
            <td className="blue "></td>
            <td className="blue "></td>
            <td className="blue "></td>
            <td className="blue "></td>
            <td className="blue "></td>
            <PinyinCell className="yellow ">xia</PinyinCell>
            <PinyinCell className="yellow ">xiao</PinyinCell>
            <PinyinCell className="yellow ">xie</PinyinCell>
            <PinyinCell className="yellow ">xiu</PinyinCell>
            <PinyinCell className="yellow ">xian</PinyinCell>
            <PinyinCell className="yellow ">xin</PinyinCell>
            <PinyinCell className="yellow ">xiang</PinyinCell>
            <PinyinCell className="yellow ">xing</PinyinCell>
            <PinyinCell className="yellow ">xiong</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="purple "></td>
            <PinyinCell className="emerald ">xue</PinyinCell>
            <PinyinCell className="emerald ">xuan</PinyinCell>
            <PinyinCell className="emerald ">xun</PinyinCell>
          </tr>
          <tr>
            <th className="light_green ">zh</th>
            <PinyinCell className="pink ">zha</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">zhe</PinyinCell>
            <PinyinCell className="pink ">zhi</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">zhu</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">zhai</PinyinCell>
            <PinyinCell className="orange ">zhei</PinyinCell>
            <PinyinCell className="orange ">zhao</PinyinCell>
            <PinyinCell className="orange ">zhou</PinyinCell>
            <PinyinCell className="blue ">zhan</PinyinCell>
            <PinyinCell className="blue ">zhen</PinyinCell>
            <PinyinCell className="blue ">zhang</PinyinCell>
            <PinyinCell className="blue ">zheng</PinyinCell>
            <PinyinCell className="blue ">zhong</PinyinCell>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <PinyinCell className="purple ">zhua</PinyinCell>
            <PinyinCell className="purple ">zhuo</PinyinCell>
            <PinyinCell className="purple ">zhuai</PinyinCell>
            <PinyinCell className="purple ">zhui</PinyinCell>
            <PinyinCell className="purple ">zhuan</PinyinCell>
            <PinyinCell className="purple ">zhun</PinyinCell>
            <PinyinCell className="purple ">zhuang</PinyinCell>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">ch</th>
            <PinyinCell className="pink ">cha</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">che</PinyinCell>
            <PinyinCell className="pink ">chi</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">chu</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">chai</PinyinCell>
            <td className="orange "></td>
            <PinyinCell className="orange ">chao</PinyinCell>
            <PinyinCell className="orange ">chou</PinyinCell>
            <PinyinCell className="blue ">chan</PinyinCell>
            <PinyinCell className="blue ">chen</PinyinCell>
            <PinyinCell className="blue ">chang</PinyinCell>
            <PinyinCell className="blue ">cheng</PinyinCell>
            <PinyinCell className="blue ">chong</PinyinCell>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <PinyinCell className="purple ">chua</PinyinCell>
            <PinyinCell className="purple ">chuo</PinyinCell>
            <PinyinCell className="purple ">chuai</PinyinCell>
            <PinyinCell className="purple ">chui</PinyinCell>
            <PinyinCell className="purple ">chuan</PinyinCell>
            <PinyinCell className="purple ">chun</PinyinCell>
            <PinyinCell className="purple ">chuang</PinyinCell>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">sh</th>
            <PinyinCell className="pink ">sha</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">she</PinyinCell>
            <PinyinCell className="pink ">shi</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">shu</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">shai</PinyinCell>
            <PinyinCell className="orange ">shei</PinyinCell>
            <PinyinCell className="orange ">shao</PinyinCell>
            <PinyinCell className="orange ">shou</PinyinCell>
            <PinyinCell className="blue ">shan</PinyinCell>
            <PinyinCell className="blue ">shen</PinyinCell>
            <PinyinCell className="blue ">shang</PinyinCell>
            <PinyinCell className="blue ">sheng</PinyinCell>
            <td className="blue "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <PinyinCell className="purple ">shua</PinyinCell>
            <PinyinCell className="purple ">shuo</PinyinCell>
            <PinyinCell className="purple ">shuai</PinyinCell>
            <PinyinCell className="purple ">shui</PinyinCell>
            <PinyinCell className="purple ">shuan</PinyinCell>
            <PinyinCell className="purple ">shun</PinyinCell>
            <PinyinCell className="purple ">shuang</PinyinCell>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">r</th>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">re</PinyinCell>
            <PinyinCell className="pink ">ri</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="pink ">ru</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <td className="orange "></td>
            <td className="orange "></td>
            <PinyinCell className="orange ">rao</PinyinCell>
            <PinyinCell className="orange ">rou</PinyinCell>
            <PinyinCell className="blue ">ran</PinyinCell>
            <PinyinCell className="blue ">ren</PinyinCell>
            <PinyinCell className="blue ">rang</PinyinCell>
            <PinyinCell className="blue ">reng</PinyinCell>
            <PinyinCell className="blue ">rong</PinyinCell>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <PinyinCell className="purple ">rua</PinyinCell>
            <PinyinCell className="purple ">ruo</PinyinCell>
            <td className="purple "></td>
            <PinyinCell className="purple ">rui</PinyinCell>
            <PinyinCell className="purple ">ruan</PinyinCell>
            <PinyinCell className="purple ">run</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">z</th>
            <PinyinCell className="pink ">za</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">ze</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">zi</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">zu</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">zai</PinyinCell>
            <PinyinCell className="orange ">zei</PinyinCell>
            <PinyinCell className="orange ">zao</PinyinCell>
            <PinyinCell className="orange ">zou</PinyinCell>
            <PinyinCell className="blue ">zan</PinyinCell>
            <PinyinCell className="blue ">zen</PinyinCell>
            <PinyinCell className="blue ">zang</PinyinCell>
            <PinyinCell className="blue ">zeng</PinyinCell>
            <PinyinCell className="blue ">zong</PinyinCell>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="purple "></td>
            <PinyinCell className="purple ">zuo</PinyinCell>
            <td className="purple "></td>
            <PinyinCell className="purple ">zui</PinyinCell>
            <PinyinCell className="purple ">zuan</PinyinCell>
            <PinyinCell className="purple ">zu</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">c</th>
            <PinyinCell className="pink ">ca</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">ce</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">ci</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">cu</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">cai</PinyinCell>
            <td className="orange "></td>
            <PinyinCell className="orange ">cao</PinyinCell>
            <PinyinCell className="orange ">cou</PinyinCell>
            <PinyinCell className="blue ">can</PinyinCell>
            <PinyinCell className="blue ">cen</PinyinCell>
            <PinyinCell className="blue ">cang</PinyinCell>
            <PinyinCell className="blue ">ceng</PinyinCell>
            <PinyinCell className="blue ">cong</PinyinCell>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="purple "></td>
            <PinyinCell className="purple ">cuo</PinyinCell>
            <td className="purple "></td>
            <PinyinCell className="purple ">cui</PinyinCell>
            <PinyinCell className="purple ">cuan</PinyinCell>
            <PinyinCell className="purple ">cun</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
          <tr>
            <th className="light_green ">s</th>
            <PinyinCell className="pink ">sa</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">se</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">si</PinyinCell>
            <td className="pink "></td>
            <PinyinCell className="pink ">su</PinyinCell>
            <td className="pink "></td>
            <td className="pink "></td>
            <PinyinCell className="orange ">sai</PinyinCell>
            <td className="orange "></td>
            <PinyinCell className="orange ">sao</PinyinCell>
            <PinyinCell className="orange ">sou</PinyinCell>
            <PinyinCell className="blue ">san</PinyinCell>
            <PinyinCell className="blue ">sen</PinyinCell>
            <PinyinCell className="blue ">sang</PinyinCell>
            <PinyinCell className="blue ">seng</PinyinCell>
            <PinyinCell className="blue ">song</PinyinCell>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="yellow "></td>
            <td className="purple "></td>
            <PinyinCell className="purple ">suo</PinyinCell>
            <td className="purple "></td>
            <PinyinCell className="purple ">sui</PinyinCell>
            <PinyinCell className="purple ">suan</PinyinCell>
            <PinyinCell className="purple ">sun</PinyinCell>
            <td className="purple "></td>
            <td className="purple "></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
            <td className="emerald"></td>
          </tr>
        </tbody>
      </table>
    </PinyinTableProvider>
  );
};