import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // happy-dom: DOM API（DOMParser・fetch）をエミュレート
    environment: 'happy-dom',
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});
