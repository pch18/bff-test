import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import bffLoaderVitePlugin from "@bff-sdk/web/bffLoaderVitePlugin";
import tsconfigPaths from "vite-tsconfig-paths";

import Inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspect(),
    react({
      babel: {
        plugins: [
          "babel-plugin-styled-windicss",
          "babel-plugin-styled-components",
        ],
      },
    }),
    bffLoaderVitePlugin({ apiDevPort: 7016 }),
    tsconfigPaths(),
  ],
  // build: {
  //   sourcemap: true,
  //   minify: false,
  // },
});
