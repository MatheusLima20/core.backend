import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        plugins: {
            "simple-import-sort": simpleImportSort,
        },

        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",

            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],

            "@typescript-eslint/no-explicit-any": "off",
        },
    },

    prettier,
];