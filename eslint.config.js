import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                L: "readonly"
            },
            ecmaVersion: 2021,
            sourceType: "module"
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "warn"
        }
    }
];
