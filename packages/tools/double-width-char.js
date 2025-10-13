function findLengthGreaterThanOneHanChars(str) {
  const result = new Set();

  // 使用 for...of 遍历，可以正确处理代理对字符（即长度为2的字符）
  for (const char of str) {
    // 判断长度（代码单元长度），大于1即是代理对字符
    if (char.length > 1) {
      // 判断是否是汉字（补充平面的范围一般在U+20000至U+2FA1F）
      const codePoint = char.codePointAt(0);
      if (
        (codePoint >= 0x20000 && codePoint <= 0x2A6DF) ||  // CJK Unified Ideographs Extension B
        (codePoint >= 0x2A700 && codePoint <= 0x2B73F) ||  // CJK Unified Ideographs Extension C
        (codePoint >= 0x2B740 && codePoint <= 0x2B81F) ||  // CJK Unified Ideographs Extension D
        (codePoint >= 0x2B820 && codePoint <= 0x2CEAF) ||  // CJK Unified Ideographs Extension E
        (codePoint >= 0x2CEB0 && codePoint <= 0x2EBEF)     // CJK Unified Ideographs Extension F
      ) {
        result.add(char);
      }
    }
  }

  return Array.from(result);
}

// 测试字符串中含有常见和补充区汉字
const testStr = "汉字𠀀𠂢𠃌常见字和补充区字混合𠄀𠆢";
console.log("测试字符串:", testStr.length);
const found = findLengthGreaterThanOneHanChars(testStr);

console.log(found);