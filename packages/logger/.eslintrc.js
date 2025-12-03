/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    extends: ["@blog-starter/eslint-config"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
    },
    ignorePatterns: ["**/__tests__/"],
};