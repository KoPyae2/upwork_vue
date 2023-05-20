import vue from "@vitejs/plugin-vue";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import { loadEnv } from "vite";
import mkcert from "vite-plugin-mkcert";
// https://vitejs.dev/config/

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: env.VITE_APP_NAME,
            icon: env.VITE_FAV_ICON,
          },
        },
      }),
      // mkcert(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {},
          javascriptEnabled: true,
        },
        scss: {
          additionalData: `@import "src/styles/index.scss";`,
        },
      },
      devSourcemap: true,
    },
    server: {
      host: true,
      port: 3000,
      // https: true,
      open: true,
      proxy: {
        "/api": {
          target: env.VITE_SERVER_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
        "/v2": {
          target: env.VITE_IMAGE_HOST,
          changeOrigin: true,
        },
      },
    },
    define: {
      
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
  };
};
