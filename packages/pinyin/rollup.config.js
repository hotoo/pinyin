import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default [
  // ESM
  {
    input: "src/pinyin.ts",
    output: {
      file: pkg.module,  // package.json 中 module 字段指定
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true }),
    ],
    external: Object.keys(pkg.dependencies || {}),
  },

  // CJS
  {
    input: "src/pinyin.ts",
    output: {
      file: pkg.main,    // package.json 中 main 字段指定
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true, clean: true }),
    ],
    external: Object.keys(pkg.dependencies || {}),
  },

  // UMD
  // {
  //   input: "src/pinyin.ts",
  //   output: {
  //     file: pkg.browser, // package.json 中 browser 字段指定
  //     format: "umd",
  //     name: "pinyin",     // UMD 全局变量名
  //     sourcemap: true,
  //     exports: "named",
  //   },
  //   plugins: [
  //     resolve(),
  //     commonjs(),
  //     typescript({ useTsconfigDeclarationDir: false }), // UMD不产声明文件
  //   ],
  //   external: Object.keys(pkg.dependencies || []),
  // },
  {
    input: "src/pinyin-web.ts",
    output: {
      file: pkg.browser, // package.json 中 browser 字段指定
      format: "umd",
      name: "pinyin",     // UMD 全局变量名
      sourcemap: true,
      exports: "named",
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: false }), // UMD不产声明文件
    ],
    external: Object.keys(pkg.dependencies || []),
  },
];