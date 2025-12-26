import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Configurações básicas e ignores
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      'test',
      'tests',
      'prisma.config.ts',
      'jest.config.ts',
      'jest.setup.ts',
      'setup-test.ts',
      'eslint.config.mjs',
    ],
  },

  // Globals e Parser Options
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.eslint.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },

  // Configs base
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // Plugin Import para ordenação de imports
  {
    plugins: {
      import: pluginImport,
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.ts'],
          moduleDirectory: ['node_modules', 'src'],
        },
      },
      'import/internal-regex': '^(@shared|@users)/(.*)$',
    },
    rules: {
      // Ordenação de imports
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@shared/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@users/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: 'users/**',
              group: 'internal',
              position: 'before',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      'import/first': 'error',
      'import/exports-last': 'off',
      'import/extensions': ['error', 'never'],
    },
  },

  // Prettier config
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 100,
          tabWidth: 2,
          semi: true,
          bracketSpacing: true,
          arrowParens: 'avoid',
          endOfLine: 'lf',
        },
      ],
    },
  },

  // Regras personalizadas de Clean Code
  {
    rules: {
      // Formatação de código
      'no-console': 'warn', // Avisa sobre uso de console (mas permite em dev)
      'prefer-const': 'error', // Força o uso de const quando não há reatribuição
      quotes: ['error', 'single'], // Força uso de aspas simples

      // Regras de complexidade
      'max-params': ['error', 3], // Limita número de parâmetros em funções
      'max-depth': ['error', 3], // Limita aninhamento de blocos
      // 'max-lines-per-function': ['error', { max: 50 }], // Limita tamanho das funções
      complexity: ['error', 10], // Limita complexidade ciclomática

      // Nomenclatura
      camelcase: 'error', // Força nomenclatura camelCase
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
      ],

      // TypeScript específico
      'no-unused-vars': 'off', // Desativado em favor da versão TS
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error', // Força tipos de retorno
      '@typescript-eslint/explicit-module-boundary-types': 'error', // Força tipos nas APIs
      '@typescript-eslint/no-explicit-any': 'error', // Proíbe uso de any
      '@typescript-eslint/no-non-null-assertion': 'error', // Proíbe uso de ! para afirmar não-nulo

      // Boas práticas
      'no-duplicate-imports': 'off', // Desativado em favor da versão do plugin import
      eqeqeq: 'error', // Força uso de === em vez de ==
      'no-return-await': 'error', // Evita return await desnecessário
      'no-param-reassign': 'error', // Proíbe reatribuição de parâmetros
      'no-shadow': 'off', // Desativado em favor da versão TS
      '@typescript-eslint/no-shadow': 'error', // Evita variáveis com mesmo nome em escopos diferentes
      'no-magic-numbers': 'off', // Desativado em favor da versão TS
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2], // Números comuns são permitidos
          ignoreEnums: true,
          ignoreReadonlyClassProperties: true,
          ignoreDefaultValues: true,
        },
      ],

      // Funções assíncronas
      '@typescript-eslint/no-floating-promises': 'error', // Força tratamento de promessas
      '@typescript-eslint/await-thenable': 'error', // Garante que await só é usado com Promises

      // Estrutura e formato
      'arrow-body-style': ['error', 'as-needed'], // Simplifica arrow functions
      curly: ['error', 'all'], // Força uso de chaves mesmo em blocos de uma linha
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' }, // Linha em branco antes de return
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' }, // Linha após declarações
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      ],
    },
  },
];
