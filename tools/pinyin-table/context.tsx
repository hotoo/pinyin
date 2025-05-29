import React, { createContext, useContext, useState } from "react";

const PinyinTableContext = createContext();

export function PinyinTableProvider({ children }) {
  const [playingPinyin, setPlayingPinyin] = useState("");

  // 切换播放状态
  const handlePlay = (pinyin: string) => {
    setPlayingPinyin(pinyin);
  };

  return (
    <PinyinTableContext.Provider value={{ playingPinyin, handlePlay }}>
      {children}
    </PinyinTableContext.Provider>
  );
}

// 自定义 Hook 来便捷使用 context
export function usePinyinTable() {
  return useContext(PinyinTableContext);
}