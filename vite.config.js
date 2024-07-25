import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "src",
  base: "./",
  server: {
    host: true,
    port: 5173,
    open: "/index.html", // Abre automaticamente a página de login
    proxy: {
      "/api": {
        target: "https://api.grupobrf1.com:10000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    emptyOutDir: true,
    outDir: "../dist",
    rollupOptions: {
      input: {
        login: resolve(__dirname, "src/index.html"),
        sorteios: resolve(__dirname, "src/sorteios.html"),
        styles: resolve(__dirname, "src/styles.css"),
        main: resolve(__dirname, "src/main.js"),
        loginJs: resolve(__dirname, "src/login.js"),
        iconBrf1: resolve(__dirname, "public/brf1.png"),
        eyeIcon: resolve(__dirname, "src/icons/eye.svg"),
        eyeOffIcon: resolve(__dirname, "src/icons/eye-off.svg"),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    {
      name: "html-rewrite",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/sorteios") {
            req.url = "/sorteios.html";
          }
          next();
        });
      },
    },
  ],
});
