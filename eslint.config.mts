import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { includeIgnoreFile } from '@eslint/compat'
import pluginVue from 'eslint-plugin-vue'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVitest from '@vitest/eslint-plugin'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,vue}']
  },

  includeIgnoreFile(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.gitignore')),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  stylistic.configs.customize({
    braceStyle: '1tbs',
    commaDangle: 'never',
    quoteProps: 'as-needed'
  }),

  {
    rules: {
      '@stylistic/arrow-parens': 'off',
      '@stylistic/spaced-comment': ['error', 'always', { exceptions: ['#__PURE__'] }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true }],
      'vue/block-lang': 'off',
      'vue/require-v-for-key': 'off',
      'vue/valid-v-for': 'off'
    }
  },

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  }
)
