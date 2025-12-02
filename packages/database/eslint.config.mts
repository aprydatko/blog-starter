import pluginObject from "@blog-starter/eslint-config/library";

// /** @type {import("eslint").Linter.Config[]} */
// export default library;


import { Linter } from 'eslint';

const config: Linter.FlatConfig = [
  {
    // Include shared config (directly in the flat config array)
    plugins: {
        "@blog-starter/eslint-config/library.js": pluginObject
    },
  },
];

export default config;