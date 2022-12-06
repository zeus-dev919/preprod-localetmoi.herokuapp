// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential', 
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
        ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here
    rules: {
        "indent": ["error", 4],
        // override/add rules settings here, such as:
        "vue/script-indent": ["error", 4],
        "vue/max-attributes-per-line": 0,
        "vue/html-indent": ["error", 4],
        "vue/v-bind-style": 0,
        "yoda": 0,
        "one-var": 0,
        "vue/html-self-closing": 0,
        "semi": ["error", "always"],
        "brace-style": ["error", "1tbs"],
        "no-undef": 0,
        "no-trailing-spaces": 0,
        "no-multiple-empty-lines": 0,
        "no-useless-escape": 0,
        "no-unused-expressions": 0,
        "no-sequences": 0,
        "no-irregular-whitespace": 0,
        "no-extra-bind": 0,
        // "camelcase": ["error", {properties: "always"}]
        // allow async-await
        'generator-star-spacing': 'off',
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
}
