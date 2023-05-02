/// <reference types="vitest" />
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: resolve('../../node_modules/vue'),
    },
    dedupe: ['vue'],
  },
  test: {
    reporters: ['verbose'],
    include: ['tests/**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
  },
})
