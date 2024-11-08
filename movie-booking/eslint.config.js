import eslintJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
import pluginVue from 'eslint-plugin-vue'

export default [
    {
        //---- GLOBAL IGNORES
        // note folders can only be ignored at the global level, per-cfg you must do: '**/dist/**/*'
        ignores: [
            '**/dist/',
            '**/vendor/',
        ],
    },
    // general defaults
    eslintJs.configs['recommended'],
    // general
    {
        files: ['**/*.{js,ts,jsx,tsx,vue}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {},
    },

    // chosen typescript defaults - could not get this working
    // ...tsEslint.configs['recommended'],
    // typescript
    {
        files: ['**/*.{ts,tsx,vue}'],
        languageOptions: {
            parser: tsEslint.parser,
        },
    },

    // chosen vue defaults
    ...pluginVue.configs['flat/essential'],
    // vue
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsEslint.parser,  // parse TS inside VUE
            },
        },
    },
]