import { defineConfig } from 'vite';
import { peerDependencies } from './package.json';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      name: 'react-hooks-deep-state',
      fileName: 'react-hooks-deep-state'
    },
    rollupOptions: {
      // Exclude all peer dependencies from being bundled
      external: [...Object.keys(peerDependencies)],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.app.json'
    })
  ]
});

