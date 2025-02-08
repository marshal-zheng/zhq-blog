/** @type {import('astro-i18next').AstroI18nextConfig} */
import { LOCALE } from "./src/config";
export default {
  defaultLocale: LOCALE.lang, // 设置默认语言
  locales: ['en', 'zh-cn'], // 支持的语言列表
};
