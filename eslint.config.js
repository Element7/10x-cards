import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Base JS configuration - minimal
  js.configs.recommended,

  // TypeScript configuration - minimal
  ...tseslint.configs.recommended,

  // JavaScript/TypeScript files
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tseslint.parser,
      globals: {
        // Common global objects
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // React files
  {
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        React: "readonly",
        JSX: "readonly",
      },
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },

  // Files to ignore - MOST IMPORTANT PART
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".astro/**",
      "**/*.astro", // <-- Completely ignore all Astro files
      "playwright-report/**",
      "tests/**",
      "coverage/**",
      "public/**",
    ],
  },
];
