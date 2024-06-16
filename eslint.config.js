import js from "@eslint/js"
import globals from "globals"

export default [
  {
    files: ["**/*.js"],
    rules: js.configs.recommended.rules,
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
