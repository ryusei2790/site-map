/**
 * Web Worker エントリポイント。
 * メインスレッドから切り離してネットワーク処理（fetch + parse）を実行する。
 * Comlink の expose() でメインスレッドから関数として呼び出せるようにする。
 */
import { expose } from 'comlink';
import type { WorkerApi } from './api.js';
import type { SiteMapConfig, UrlEntry } from '../types.js';
import { SitemapAdapter } from '../adapters/sitemap.js';
import { CrawlAdapter } from '../adapters/crawl.js';
import { StaticAdapter } from '../adapters/static.js';
import type { DataSourceAdapter } from '../adapters/index.js';

function selectAdapters(config: SiteMapConfig): DataSourceAdapter[] {
  switch (config.strategy) {
    case 'sitemap': return [new SitemapAdapter()];
    case 'crawl':   return [new CrawlAdapter()];
    case 'static':  return [new StaticAdapter()];
    default:        return [new SitemapAdapter(), new CrawlAdapter()];
  }
}

const api: WorkerApi = {
  async fetchUrls(config: SiteMapConfig): Promise<UrlEntry[]> {
    const adapters = selectAdapters(config);
    for (const adapter of adapters) {
      const urls = await adapter.fetch(config);
      if (urls.length > 0) return urls;
    }
    return [];
  },
};

// Comlink が Worker の MessagePort を乗っ取り、メインスレッドから RPC 呼び出し可能にする
expose(api);
