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
  favicons: [
    'https://gw.alipayobjects.com/mdn/rms_f6322a/afts/img/A*VqPXS4ODZTMAAAAAAAAAAAAAARQnAQ',
  ],
  logo:
    'https://gw.alipayobjects.com/mdn/rms_f6322a/afts/img/A*bGz9QbNudekAAAAAAAAAAAAAARQnAQ',
  outputPath: 'docs-dist/dist',
  // mode: 'doc',
  exportStatic: {},
  hash: true,
  themeConfig: {
    nav: {
      'zh-CN': [
        { title: '首页', link: '/' },
        { title: 'API文档', link: '/api/v3/' },
        { title: '演示文档', link: '/example/' },
        { title: '更新历史', link: '/CHANGELOG/' },
      ],
      'en-US': [
        { title: 'Home', link: '/en-US/' },
        { title: 'API', link: '/en-US/api/v3/' },
        { title: 'Example', link: '/en-US/example/' },
        { title: 'CHANGELOG', link: '/CHANGELOG/' },
      ],
      'ko-KR': [
        { title: 'Home', link: '/ko-KR/' },
        { title: 'API', link: '/ko-KR/api/v3/' },
        { title: 'Example', link: '/ko-KR/example/' },
        { title: 'CHANGELOG', link: '/CHANGELOG/' },
      ],
    },
  },
  // resolve: {
  //   includes: ['.'],
  // },
  locales: [
    { id: 'zh-CN', name: '中文'},
    { id: 'en-US', name: 'English' },
    { id: 'ko-KR', name: '한국어' },
  ],
  // Because of using GitHub Pages
  base: '/',
  publicPath: '/',
  // alias,
  mfsu: {
    esbuild: true,
    ignoreNodeBuiltInModules: true,
  },
  legacy: {
    nodeModulesTransform: false,
  },
  extraBabelIncludes: [
    'nodejieba', '@node-rs/jieba',
  ],
  analytics: {
    ga_v2: 'G-B24X7338JP',
  },
  // more config: https://d.umijs.org/config
});
