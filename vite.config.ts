import vue from "@vitejs/plugin-vue"
import legacy from "@vitejs/plugin-legacy"
import { createHtmlPlugin } from "vite-plugin-html"
import path from "path"
import { defineConfig } from "vite"
import { fileURLToPath } from "url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

// Configuration simplifiée pour le déploiement Netlify
const contextName = "MAAS Group"
const benefitCount = 30 // Valeur approximative

export default defineConfig({
  server: {
    port: 8080,
    strictPort: true,
  },
  build: {
    manifest: true,
    rollupOptions: {
      external: ['node:fs', 'fs', 'path', 'url'],
      output: {
        globals: {
          'node:fs': 'fs',
          'fs': 'fs',
          'path': 'path',
          'url': 'url'
        },
        assetFileNames: (assetInfo) => {
          const extension = (assetInfo.name || "").match(/.*\.([a-z0-9]*)$/i)
          if (extension && extension[1]) {
            return `assets/[name]-[hash][extname]`
          } else {
            return `assets/[name]-[hash][extname]`
          }
        },
        chunkFileNames: () => {
          return `assets/js/[name]-[hash].js`
        },
        entryFileNames: () => {
          return `assets/js/[name]-[hash].js`
        },
      },
    },
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [
    vue(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          VITE_TITLE: `Évaluez vos droits aux aides avec le simulateur de ${contextName}`,
          VITE_DESCRIPTION: `7 minutes suffisent pour évaluer vos droits à ${benefitCount} aides avec le simulateur de ${contextName}.`,
          VITE_BASE_URL: "/",
          VITE_CONTEXT_NAME: contextName,
          VITE_ROBOTS: "index,follow",
        },
      },
    }),
    legacy({
      targets: ["defaults"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@lib": path.resolve(__dirname, "lib"),
      "@data": path.resolve(__dirname, "data"),
      "generator:benefits": path.resolve(__dirname, "data/all.js"),
      "generator:institutions": path.resolve(__dirname, "data/all.js"),
      "generator:*": path.resolve(__dirname, "data/all.js"),
      "lodash-es": path.resolve(__dirname, "node_modules/lodash/lodash.js"),
      "lodash": path.resolve(__dirname, "node_modules/lodash/lodash.js"),
      "vue": path.resolve(__dirname, "node_modules/vue/dist/vue.esm-bundler.js"),
      "vue-router": path.resolve(__dirname, "node_modules/vue-router/dist/vue-router.esm-bundler.js"),
      "vuex": path.resolve(__dirname, "node_modules/vuex/dist/vuex.esm-bundler.js"),
      "axios": path.resolve(__dirname, "node_modules/axios/dist/axios.js"),
    },
  },
  define: {
    "process.env": {
      VITE_BENEFIT_COUNT: benefitCount,
      VITE_CONTEXT_NAME: contextName,
      VITE_BASE_URL: "/",
      VITE_CONTEXT: "production",
      VITE_1J1S_URL: "https://www.1jeune1solution.gouv.fr",
      VITE_TITLE: `Évaluez vos droits aux aides avec le simulateur de ${contextName}`,
      VITE_DESCRIPTION: `7 minutes suffisent pour évaluer vos droits à ${benefitCount} aides avec le simulateur de ${contextName}.`,
      VITE_ROBOTS: "index,follow",
    },
  },
})
