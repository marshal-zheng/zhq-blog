import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import astroI18next from 'astro-i18next';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import mdx from '@astrojs/mdx'
import fs from 'node:fs';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    mdx({
      extendMarkdownConfig: true,
      optimize: true
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
    astroI18next()
  ],
  server: {
    host: true,
    port: 4323,
  },
  markdown: {
    remarkPlugins: [
      remarkToc,
      remarkMath,
      [
        remarkCollapse,
        {
          test: (v: string) => ["Table of contents", "文章目录"].includes(v),
        },
      ],
    ],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: "github-light", dark: "night-owl" },
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
      include: ["@splinetool/runtime"]
    },
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    server: {
      // https: {
      //   key: fs.readFileSync('./localhost-key.pem'),
      //   cert: fs.readFileSync('./localhost.pem'),
      // }
    }
  },
  scopedStyleStrategy: "where",
  experimental: {
    contentLayer: true,
  },
});
