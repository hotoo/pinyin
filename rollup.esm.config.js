import path from "path";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs"; // commonjs模块转换插件
import ts from "rollup-plugin-typescript2";
import alias from "rollup-plugin-alias";

const plugins = [
  json(),
  nodeResolve(),
  ts({
    tsconfig: path.resolve(__dirname, "./tsconfig.json"), // 导入本地ts配置
    clean: true,
    useTsconfigDeclarationDir: true,
  }),
  commonjs(),
  alias({
    entries: [{ find: "@", replacement: "./src" }],
  }),
];

module.exports = {
  input: path.resolve("./src/pinyin.ts"),
  output: [
    {
      exports: "auto",
      file: path.resolve(__dirname, "./dist/pinyin.mjs"),
      format: "es",
      sourcemap: false,
    },
  ],
  plugins,
};