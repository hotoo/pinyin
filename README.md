# README

pīnyīn, 汉字拼音转换工具。

## 目录结构

这是一个 monorepo，使用 turbo + pnpm 进行管理，目录结构如下：

```
|- apps/
|  `- website               // 文档站点
|- packages/
|  |- pinyin/               // pinyin 主仓库
|  |- pinyin-cli/           // 命令行工具，可以全局安装，并在命令行中随处使用。
|  |- pinyin-react/         // pinyin React 版本，即将推出。
|  `-tools/                 // 其他配套杂项。
|- package.json
`- README.md
```
