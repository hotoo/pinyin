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
    '/favicon.png',
    'https://gw.alipayobjects.com/mdn/rms_f6322a/afts/img/A*VqPXS4ODZTMAAAAAAAAAAAAAARQnAQ',
  ],
  logo: '/logo.png',
  outputPath: 'docs-dist',
  // mode: 'doc',
  exportStatic: {},
  ssr: { mode: 'stream' },
  hash: true,
  themeConfig: {
    nav: {
      'zh-CN': [
        { title: '首页', link: '/' },
        { title: 'API文档', link: '/api/v4/',
          children: [
            { title: 'v4', link: '/api/v4/' },
            { title: 'v3', link: '/api/v3/' },
            { title: 'v2', link: '/api/v2/' },
          ],
        },
        { title: '演示文档', link: '/example/' },
        { title: '拼音表', link: '/pinyin-table' },
      ],
      'en-US': [
        { title: 'Home', link: '/en-US/' },
        { title: 'API', link: '/en-US/api/v4/',
          children: [
            { title: 'v4', link: '/en-US/api/v4/' },
            { title: 'v3', link: '/en-US/api/v3/' },
            { title: 'v2', link: '/en-US/api/v2/' },
          ],
        },
        { title: 'Example', link: '/en-US/example/' },
        { title: 'Pinyin Table', link: '/pinyin-table' },
      ],
      'ko-KR': [
        { title: 'Home', link: '/ko-KR/' },
        { title: 'API', link: '/ko-KR/api/v4/',
          children: [
            { title: 'v4', link: '/ko-KR/api/v4/' },
            { title: 'v3', link: '/ko-KR/api/v3/' },
            { title: 'v2', link: '/ko-KR/api/v2/' },
          ],
        },
        { title: 'Example', link: '/ko-KR/example/' },
        { title: 'Pinyin Table', link: '/pinyin-table' },
      ],
    },
    prefersColor: { default: 'auto' },
    socialLinks: {
      github: 'https://github.com/hotoo/pinyin',
    },
    footer: `Open-source <a href="http://hotoo.mit-license.org/" target="_blank">MIT</a> Licensed | Copyright © 2019-${new Date().getFullYear()}`,
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
  copy: [
    'CNAME', 'public',
  ],
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
