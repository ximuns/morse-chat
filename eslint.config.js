import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'coverage']),

  {
    files: ['**/*.{js,jsx}'],

    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      // Переменные, объявленные, но не используемые
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Неиспользуемые выражения
      'no-unused-expressions': 'error',

      // Запрещает случайное присваивание внутри условий
      'no-cond-assign': 'error',

      // Более безопасные сравнения
      eqeqeq: ['error', 'always'],

      // Не оставлять debugger
      'no-debugger': 'warn',

      // console разрешён, но ESLint предупредит
      'no-console': 'warn',
    },
  },
])
