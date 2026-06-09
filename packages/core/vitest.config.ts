import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // node: treeBuilder / pathUtils など DOM 不要なロジックのテスト用
    // CrawlAdapter / LocalStorageCache のテスト追加時に happy-dom へ切り替える
    environment: 'node',
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});
