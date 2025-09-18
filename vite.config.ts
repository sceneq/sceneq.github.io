import path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
    'process.env': '{}',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      formats: ['es'],
      fileName: () => 'recipe.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
