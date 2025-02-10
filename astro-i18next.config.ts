/** @type {import('astro-i18next').AstroI18nextConfig} */
import { LOCALE } from "./src/config";
export default {
  defaultLocale: LOCALE.lang,
  locales: ['en', 'zh-cn']
};
