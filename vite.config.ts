import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import { defineConfig as defineVitestConfig } from 'vitest/config';

const aliases = {
  '@': path.resolve(__dirname, './src'),
  '@assets': path.resolve(__dirname, './src/assets'),
  '@atoms': path.resolve(__dirname, './src/components/atoms'),
  '@molecules': path.resolve(__dirname, './src/components/molecules'),
  '@organisms': path.resolve(__dirname, './src/components/organisms'),
  '@templates': path.resolve(__dirname, './src/components/templates'),
  '@styles': path.resolve(__dirname, './src/styles'),
  '@utils': path.resolve(__dirname, './src/utils')
};

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: aliases
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'StackAndFlowDesignSystem',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react', /^lucide-react\/.*/],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
          'lucide-react': 'LucideReact'
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: false,
    alias: aliases,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/components/**/*.ts', 'src/components/**/*.tsx'],
      exclude: ['src/components/**/*.stories.tsx', 'src/components/**/*.test.*', 'src/components/**/index.ts']
    }
  }
});
