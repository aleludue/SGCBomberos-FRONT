import pluginVue from 'eslint-plugin-vue';
import vueTsConfig from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.github/**'],
  },

  ...pluginVue.configs['flat/essential'],

  ...vueTsConfig(),

  skipFormatting,

  {
    name: 'app/custom-rules',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'warn',
    },
  },
];
