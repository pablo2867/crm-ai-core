import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "."),
    },
  },

  test: {
    environment: "node",

    exclude: [
      "node_modules/**",
      ".git/**",
      ".next/**",
      "tests/e2e/**",
    ],

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/",
        ".next/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
      ],
    },
  },
});
