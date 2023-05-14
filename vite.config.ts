import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import eslint from 'vite-plugin-eslint'
import stylelint from 'vite-plugin-stylelint'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),

    {
      ...eslint(),
      apply: 'build'
    },
    {
      ...eslint({
        failOnWarning: false,
        failOnError: false
      }),
      apply: 'serve',
      enforce: 'post'
    },

    {
      ...stylelint(),
      apply: 'build'
    },
    {
      ...stylelint({
        emitError: true,
        emitWarning: true
      }),
      apply: 'serve',
      enforce: 'post'
    }
  ],
  css: {
    modules: {
      generateScopedName: '[local]-[hash:base64:5]'
    }
  }
})
