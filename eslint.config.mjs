import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // UI legacy boundary:
  // the presentation layer may contain legacy any usage,
  // while platform and API layers remain strictly typed.
  {
    files: [
      "components/**/*.{ts,tsx}",
      "app/dashboard/**/*.backup.{ts,tsx}",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Backups are historical artifacts and are not part of the active application.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "audit-backups/**",
    "utf8-backup/**",
  ]),
]);

export default eslintConfig;
