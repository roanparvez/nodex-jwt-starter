import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default defineConfig([
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "logs",
      "coverage",
      "out",
      "public",
      ".git",
      "eslint.config.mjs",
    ],
  },
  // Base configuration for all JS/TS files
  {
    files: ["**/*.{js,ts,mjs,cjs,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      prettier: eslintPluginPrettier,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...tseslint.configs.recommended.rules,

      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "consistent-return": "warn",
      "no-implicit-coercion": "warn",

      // TypeScript-specific rules
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",

      // Prettier formatting
      "prettier/prettier": "error",

      // Import sorting
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  },

  // Treat JS files separately if needed
  {
    files: ["**/*.js"],
    ...js.configs.recommended,
  },

  // Disable rules that conflict with Prettier
  eslintConfigPrettier,
]);
