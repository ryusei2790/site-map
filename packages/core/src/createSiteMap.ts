import type { SiteMapConfig, SiteMapInstance, TreeNode } from './types.js';
import type { DataSourceAdapter } from './adapters/index.js';
import { SitemapAdapter } from './adapters/sitemap.js';
import { CrawlAdapter } from './adapters/crawl.js';
import { StaticAdapter } from './adapters/static.js';
import { LocalStorageCache } from './cache/localStorage.js';
import type { CacheLayer } from './cache/index.js';
import { buildTree } from './builders/treeBuilder.js';

const DEFAULT_TTL = 30 * 60 * 1000; // 30 分

/**
 * 設定に応じて DataSourceAdapter の優先順リストを返す。
 * 'auto' では sitemap を試みて失敗時に crawl へフォールバックする。
 */
function selectAdapters(config: SiteMapConfig): DataSourceAdapter[] {
  switch (config.strategy) {
    case 'sitemap': return [new SitemapAdapter()];
    case 'crawl':   return [new CrawlAdapter()];
    case 'static':  return [new StaticAdapter()];
    default:        return [new SitemapAdapter(), new CrawlAdapter()];
  }
}

/**
 * @site-map/core のメインエントリポイント。
 *
 * adapter と cache を組み立て、load / refresh / clearCache を持つ
 * SiteMapInstance を返す。UI を持たない pure logic 層。
 *
 * @example
 * const siteMap = createSiteMap({ baseUrl: 'https://example.com' });
 * const tree = await siteMap.load();
 */
export function createSiteMap(config: SiteMapConfig): SiteMapInstance {
  const cache: CacheLayer = new LocalStorageCache();
  const cacheKey = `site-map:${config.baseUrl}`;
  const ttl = config.ttl ?? DEFAULT_TTL;
  const adapters = selectAdapters(config);

  /** adapter を順番に試し、最初に 1 件以上返したものを採用 */
  async function fetchUrls() {
    for (const adapter of adapters) {
      const urls = await adapter.fetch(config);
      if (urls.length > 0) return urls;
    }
    return [];
  }

  async function load(): Promise<TreeNode> {
    const cached = await cache.get<TreeNode>(cacheKey);
    if (cached) return cached;

    const urls = await fetchUrls();
    const tree = buildTree(
      urls,
      config.baseUrl,
      config.maxDepth ?? 10,
      config.maxNodes ?? 500
    );

    await cache.set(cacheKey, tree, ttl);
    return tree;
  }

  async function refresh(): Promise<void> {
    await cache.clear(cacheKey);
    await load();
  }

  function clearCache(): void {
    // 同期的に呼べるよう void で Promise を捨てる（localStorage は同期なので安全）
    void cache.clear(cacheKey);
  }

  return { load, refresh, clearCache };
}
