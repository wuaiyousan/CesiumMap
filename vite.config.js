import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { projName } from "./src/common/ProjConfig";

// 是否生产模式
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
      },
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
    outDir: projName,
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    minify: "terser",
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${resolve(
          __dirname,
          "src/assets/style/variable.less"
        )}";`,
      },
    },
  },
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/icons")],
      symbolId: "icon-[dir]-[name]",
    }),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: "Icon",
        }),
      ],
    }),
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"],
        }),
        ElementPlusResolver(),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    viteCompression(),
  ].concat([
    isProduction
      ? visualizer({
          open: true,
        })
      : [],
  ]),
  base: ["/", projName, "/"].join(""),
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    https: false,
    port: 3001,
    proxy: {
      "/api": {
        // target: 'https://117.172.159.251:9092/lcApi/', // 南江
        // target: 'https://swp.lchoude.com:7080/lcApi/', // 聊城
        // target: "https://www.dongexianslj2023.com/api/", // 巨鹿
        target: "http://172.16.142.40:9092/api/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
      },
      // 模型地址
      "/3dModel": {
        target: "http://172.16.142.40:92/3dModel/", // 巨鹿
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/3dModel/, ""),
        secure: false,
      },
    },
  },
});
