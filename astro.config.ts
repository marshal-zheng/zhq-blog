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
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      exclude: ["@resvg/resvg-js", "assistant-stream/ai-sdk"],
      include: ["@splinetool/runtime"]
    },
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        // Shim for missing subpath export in assistant-stream (imported by @assistant-ui/react-ai-sdk)
        'assistant-stream/ai-sdk': path.resolve('./src/shims/assistant-stream-ai-sdk.ts'),
      },
    },
  },
  scopedStyleStrategy: "where",
  experimental: {
    contentLayer: true,
  },
});
