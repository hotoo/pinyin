
export enum PINYIN_STYLE {
  NORMAL = 0,       // 普通风格，不带声调。
  TONE = 1,         // 标准风格，声调在韵母的第一个字母上。
  TONE2 = 2,        // 声调以数字形式在拼音之后，使用数字 0~4 标识。
  TO3NE = 5,        // 声调以数字形式在声母之后，使用数字 0~4 标识。
  INITIALS = 3,     // 仅需要声母部分。
  FIRST_LETTER = 4, // 仅保留首字母。
};
