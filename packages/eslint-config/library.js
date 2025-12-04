import { resolve } from "node:path";
import onlyWarn from "eslint-plugin-only-warn";

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
const legacyConfig = {
  extends: ["eslint:recommended", "prettier", "turbo"],
  plugins: ["only-warn"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
};

// ESM export for legacy CommonJS consumers (if needed via default export)
export default legacyConfig;

// ESM flat-config compatible export for eslint.config.mts
export async function getFlatConfig() {
  return [
    {
      ignores: [".*.js", "node_modules/", "dist/", ".turbo/"],
    },
    {
      languageOptions: {
        globals: {
          React: true,
          JSX: true,
        },
      },
      settings: {
        "import/resolver": {
          typescript: {
            project,
          },
        },
      },
      plugins: {
        "only-warn": onlyWarn,
      },
    },
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ];
}