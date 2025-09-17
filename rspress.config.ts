import { defineConfig } from "rspress/config";
import { pluginSass } from "@rsbuild/plugin-sass";
// import { pluginSitemap } from '@rspress/plugin-sitemap';
import sitemap from "rspress-plugin-sitemap";
import { pluginGoogleAnalytics } from "rsbuild-plugin-google-analytics";

const siteUrl = "https://pinyin.js.org";

export default defineConfig({
  // 文档根目录
  root: "docs",
  base: "/",
  title: "pinyin, 中文拼音解决方案",
  description: "汉字转拼音工具，支持多种拼音方案。",
  head: [
    ["meta", { name: "keyword", content: "拼音, 汉字, 中文, Pinyin, Chinese" }],
  ],
  icon: "/logo.png",
  logoText: "pīnyīn",
  logo: {
    light: "/logo.png",
    dark: "/logo.png",
  },
  lang: "zh-CN",
  locales: [
    {
      lang: "zh-CN",
      label: "简体中文",
      title: "汉字拼音",
      description: "汉字拼音",
    },
    {
      lang: "zh-TW",
      label: "繁體中文",
      title: "漢字拼音",
      description: "漢字拼音",
    },
    {
      lang: "en-US",
      label: "English",
      title: "pinyin",
      description: "Chinese Pinyin",
    },
    {
      lang: "ko-KR",
      label: "한국어",
      title: "한자 병음",
      description: "한자 병음",
    },
  ],
  themeConfig: {
    locales: [
      {
        lang: "zh-CN",
        label: "简体中文",
        outlineTitle: "大纲",
      },
      {
        lang: "zh-TW",
        label: "繁體中文",
        outlineTitle: "大綱",
      },
      {
        lang: "en-US",
        label: "English",
        outlineTitle: "Table of Contents",
      },
      {
        lang: "ko-KR",
        label: "한국어",
        outlineTitle: "목차",
      },
    ],
    enableContentAnimation: true,
    enableAppearanceAnimation: true,
    socialLinks: [
      {
        icon: "x",
        mode: "link",
        content: "https://x.com/hotoo",
      },
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/hotoo/pinyin",
      },
    ],
    footer: {
      message: `Open-source MIT Licensed | Copyright © 2010-${new Date().getFullYear()}`,
    },
  },
  plugins: [
    // pluginSitemap({
    //   siteUrl,
    // }),
    sitemap({ 
      domain: siteUrl,
      defaultChangeFreq: "weekly",
      defaultPriority: "0.5",
     }),
  ],
  builderConfig: {
    plugins: [
      pluginSass(),
      pluginGoogleAnalytics({ id: "G-B24X7338JP" }),
    ],
    html: {
      tags: [
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "/styles/global.css",
          },
        },
      ],
    },
  },
});