import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@types': path.resolve(__dirname, 'src/types'),
      '@mocks': path.resolve(__dirname, 'src/mocks'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  },
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/services/**/*']
    }
  }
});
