import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
// import stylisticJs from "@stylistic/eslint-plugin-js";
import eslintConfigPrettier from '@vue/eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
// import a from 'eslint-import-resolver-typescript';
// import viteConfig from './vite.config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/borislav/Desktop/javascript"
const __dirname = path.dirname(__filename);

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist'],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  eslintConfigPrettier,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    rules: {
      // 'vue/no-unused-refs': 'error',
      'import/newline-after-import': 'error',
    },
  },
  {
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
        alias: {
          map: [
            ['~', path.resolve(__dirname, './src')],
            ['@', path.resolve(__dirname, './src')]
          ],
          extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
        },
      },
    },
  },
];

// import pluginVue from 'eslint-plugin-vue'
// import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
// import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// // To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// // import { configureVueProject } from '@vue/eslint-config-typescript'
// // configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// // More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

// export default defineConfigWithVueTs(
//   {
//     name: 'app/files-to-lint',
//     files: ['**/*.{ts,mts,tsx,vue}'],
//   },

//   {
//     name: 'app/files-to-ignore',
//     ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
//   },

//   pluginVue.configs['flat/essential'],
//   vueTsConfigs.recommended,
//   skipFormatting,
// )
