import eslint from "@eslint/js"
import stylistic from "@stylistic/eslint-plugin"
import tseslint from "typescript-eslint"

export default tseslint.config(
    {
        ignores: [
            "dist/",
            "node_modules/",
            "test/",
            "coverage/",
            "**/*.js",
            "**/*.mjs",
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            "@stylistic": stylistic,
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-inferrable-types": "off",
            "sort-imports": "error",

            "quotes": "off",
            "@stylistic/quotes": ["error", "double"],

            "semi": "off",
            "@stylistic/semi": ["error", "never"],
        },
    },
)
