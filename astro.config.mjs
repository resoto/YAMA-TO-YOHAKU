import { defineConfig } from 'astro/config';
import { existsSync } from 'node:fs';

if (existsSync('.env')) process.loadEnvFile('.env');

const site = process.env.SITE_URL || process.env.CF_PAGES_URL;

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  ...(site ? { site } : {}),
});
