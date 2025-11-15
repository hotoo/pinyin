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
      {
        // Telegram
        icon: {
          svg: `<svg width="100%" height="100%" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
              <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
                <stop stop-color="currentColor" offset="0%"></stop>
                <stop stop-color="currentColor" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g id="Artboard" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <circle id="Oval" fill="url(#linearGradient-1)" cx="8" cy="8" r="8"></circle>
              <path d="M3.17026167,7.83635602 C5.78750201,6.74265999 7.53273882,6.02162863 8.40597211,5.67326193 C10.8992306,4.67860423 11.2454541,4.53439191 11.5831299,4.52864956 C11.6573986,4.52743168 11.8385417,4.55776042 11.9798438,4.67645833 C12.1211458,4.79515625 12.1635786,4.87206678 12.1755371,4.93908691 C12.1874957,5.00610705 12.1862759,5.21456762 12.1744385,5.3338623 C12.0393279,6.69547283 11.5259342,9.83829771 11.2285121,11.3633248 C11.1026617,12.008621 10.8548582,12.2249854 10.6149558,12.2461596 C10.0935924,12.2921758 9.69769267,11.9156852 9.19272668,11.5981993 C8.40255458,11.1013965 8.13911734,10.9180161 7.3721185,10.4332283 C6.48571864,9.87297217 6.85080034,9.6784879 7.35595703,9.17524981 C7.48815894,9.04355001 9.67825076,7.04590073 9.71077046,6.86250183 C9.7391276,6.70257812 9.7494847,6.68189389 9.67664063,6.60973958 C9.60379655,6.53758527 9.51674192,6.54658941 9.46083149,6.55876051 C9.38158015,6.57601267 8.17521836,7.33962686 5.84174612,8.84960308 C5.48344358,9.08558775 5.15890428,9.20056741 4.86812819,9.19454205 C4.54757089,9.18789957 3.93094724,9.02070014 3.47255094,8.87778221 C2.91030922,8.70248755 2.46345069,8.609808 2.50236203,8.31210343 C2.52262946,8.15704047 2.74526267,7.998458 3.17026167,7.83635602 Z" id="Path-3" fill="#FFFFFF"></path>
            </g>
          </svg>`
        },
        mode: "link",
        content: "https://t.me/pinyinjs",
      },
      {
        icon: "discord",
        mode: "link",
        content: "https://discord.gg/cxapDFhy",
      }
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