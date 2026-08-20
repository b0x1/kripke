import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const layers = {
  "import/no-cycle": "error",
  "import/no-restricted-paths": [
    "error",
    {
      zones: [
        {
          target: "./src/engine",
          from: "./src/ui",
          message: "engine ↛ ui",
        },
        {
          target: "./src/engine",
          from: "./src/examples",
          message: "engine ↛ examples",
        },
        {
          target: "./src/examples",
          from: "./src/ui",
          message: "examples ↛ ui",
        },
      ],
    },
  ],
};

export default tseslint.config(
  {
    ignores: ["dist", "node_modules", "coverage"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      import: importPlugin,
      "react-hooks": reactHooks,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...layers,
    },
  },
  {
    files: ["src/engine/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "react", message: "engine ↛ react" },
            { name: "react-dom", message: "engine ↛ react" },
          ],
          patterns: [
            {
              group: ["react/*", "react-dom/*"],
              message: "engine ↛ react",
            },
          ],
        },
      ],
    },
  },
);
