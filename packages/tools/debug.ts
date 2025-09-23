'use strict';

import pinyin from "../src/pinyin";

const py = pinyin("中文中奖了。", { segment: "nodejieba" });
console.log("-------output:", py);
