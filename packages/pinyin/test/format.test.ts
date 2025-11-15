import { toFixed } from "../src/format";
import { ENUM_PINYIN_STYLE } from "../src/constant";

describe.only("toFixed function", () => {
  test("should return initials for ENUM_PINYIN_STYLE.INITIALS", () => {
    expect(toFixed("zhong", ENUM_PINYIN_STYLE.INITIALS)).toBe("zh");
    expect(toFixed("guo", ENUM_PINYIN_STYLE.INITIALS)).toBe("g");
  });

  test("should return first letter for ENUM_PINYIN_STYLE.FIRST_LETTER", () => {
    expect(toFixed("zhong", ENUM_PINYIN_STYLE.FIRST_LETTER)).toBe("z");
    expect(toFixed("guo", ENUM_PINYIN_STYLE.FIRST_LETTER)).toBe("g");
  });

  test("should return normal style for ENUM_PINYIN_STYLE.NORMAL", () => {
    expect(toFixed("zhōng", ENUM_PINYIN_STYLE.NORMAL)).toBe("zhong");
    expect(toFixed("guó", ENUM_PINYIN_STYLE.NORMAL)).toBe("guo");
  });

  test("should return passport style for ENUM_PINYIN_STYLE.PASSPORT", () => {
    expect(toFixed("lǜ", ENUM_PINYIN_STYLE.PASSPORT)).toBe("LYU");
    expect(toFixed("nǚ", ENUM_PINYIN_STYLE.PASSPORT)).toBe("NYU");
    expect(toFixed("lüe", ENUM_PINYIN_STYLE.PASSPORT)).toBe("LUE");
  });

  test("should return tone3 style for ENUM_PINYIN_STYLE.TO3NE", () => {
    expect(toFixed("zhōng", ENUM_PINYIN_STYLE.TO3NE)).toBe("zho1ng");
    expect(toFixed("guó", ENUM_PINYIN_STYLE.TO3NE)).toBe("guo2");
  });

  test("should return tone2 style for ENUM_PINYIN_STYLE.TONE2", () => {
    expect(toFixed("zhōng", ENUM_PINYIN_STYLE.TONE2)).toBe("zhong1");
    expect(toFixed("guó", ENUM_PINYIN_STYLE.TONE2)).toBe("guo2");
  });

  test("should return tone style for ENUM_PINYIN_STYLE.TONE", () => {
    expect(toFixed("zhōng", ENUM_PINYIN_STYLE.TONE)).toBe("zhōng");
    expect(toFixed("guó", ENUM_PINYIN_STYLE.TONE)).toBe("guó");
  });

  test("should return original pinyin for unknown style", () => {
    expect(toFixed("zhong", -1)).toBe("zhong");
  });
});