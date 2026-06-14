// --- メインエントリ ---
export { createSiteMap } from './createSiteMap.js';

// --- 型定義 ---
export type {
  TreeNode,
  UrlEntry,
  SiteMapConfig,
  SiteMapInstance,
  AdapterStrategy,
  ThemeOptions,
} from './types.js';

// --- Adapter インターフェース（外部から拡張できるよう公開） ---
export type { DataSourceAdapter } from './adapters/index.js';
export { SitemapAdapter } from './adapters/sitemap.js';
export { CrawlAdapter } from './adapters/crawl.js';
export { StaticAdapter } from './adapters/static.js';

// --- Cache インターフェース（外部から差し替えられるよう公開） ---
export type { CacheLayer } from './cache/index.js';
export { LocalStorageCache } from './cache/localStorage.js';
export { IndexedDBCache } from './cache/indexedDB.js';

// --- Builder（SSG 連携等の上級用途向けに公開） ---
export { buildTree } from './builders/treeBuilder.js';
export { normalizePath, getPathSegments } from './builders/pathUtils.js';

// --- Worker クライアント型（import.meta.url を使うため実装は dist/worker/client.js を直接 import すること）---
export type { WorkerApi } from './worker/api.js';
