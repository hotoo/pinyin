// import { readdirSync } from 'fs';
// import { join } from 'path';
import { defineConfig } from 'dumi';

// const headPkgList = [];
// // utils must build before core
// // runtime must build before renderer-react
// const pkgList = readdirSync(join(__dirname, 'packages')).filter(
//   (pkg) => pkg.charAt(0) !== '.' && !headPkgList.includes(pkg),
// );
// const alias = pkgList.reduce((pre, pkg) => {
//   pre[`@alipay/${pkg}`] = join(__dirname, 'packages', pkg, 'src');
//   return {
//     ...pre,
//   };
// }, {});

export default defineConfig({
  title: 'pīnyīn',
  favicon:
    'https://gw.alipayobjects.com/mdn/rms_f6322a/afts/img/A*VqPXS4ODZTMAAAAAAAAAAAAAARQnAQ',
  logo:
    'https://gw.alipayobjects.com/mdn/rms_f6322a/afts/img/A*bGz9QbNudekAAAAAAAAAAAAAARQnAQ',
  outputPath: 'docs-dist/dist',
  mode: 'doc',
  exportStatic: {},
  hash: true,
  resolve: {
    includes: ['.'],
  },
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English'],
  ],
  // Because of using GitHub Pages
  base: '/',
  publicPath: '/',
  // alias,
  mfsu: {
    ignoreNodeBuiltInModules: true,
  },
  nodeModulesTransform: {
    type: 'all',
    exclude: ['nodejieba', '@node-rs/jieba'],
  },
  webpack5: {},
  // more config: https://d.umijs.org/config
});
