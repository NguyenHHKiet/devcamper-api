module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:prettier/recommended",
        "prettier",
        "eslint-config-prettier",
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        "no-unused-vars": "error",
        curly: "error",
        "no-undef": "off",
        "prettier/prettier": "error",
    },
};
