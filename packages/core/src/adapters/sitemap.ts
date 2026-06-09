import { XMLParser } from 'fast-xml-parser';
import type { DataSourceAdapter } from './index.js';
import type { UrlEntry, SiteMapConfig } from '../types.js';

/** sitemap_index の再帰を防ぐための最大深度 */
const MAX_SITEMAP_DEPTH = 3;

/**
 * /sitemap.xml を fetch してパースするアダプタ。
 * sitemap_index.xml の再帰構造にも対応（最大 3 階層）。
 */
export class SitemapAdapter implements DataSourceAdapter {
  readonly name = 'sitemap';

  async fetch(config: SiteMapConfig): Promise<UrlEntry[]> {
    const fetchFn = config.fetchFn ?? globalThis.fetch.bind(globalThis);
    const sitemapUrl = `${config.baseUrl.replace(/\/$/, '')}/sitemap.xml`;

    try {
      return await this.fetchSitemap(sitemapUrl, fetchFn, 0);
    } catch {
      return [];
    }
  }

  private async fetchSitemap(
    url: string,
    fetchFn: typeof fetch,
    depth: number
  ): Promise<UrlEntry[]> {
    if (depth >= MAX_SITEMAP_DEPTH) return [];

    const res = await fetchFn(url);
    if (!res.ok) return [];

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: true });
    const parsed = parser.parse(xml) as Record<string, unknown>;

    // sitemap_index: 複数の sub-sitemap を束ねるインデックス
    if (parsed.sitemapindex) {
      const index = parsed.sitemapindex as { sitemap?: unknown };
      const sitemaps = toArray<{ loc: unknown }>(index.sitemap);
      const results = await Promise.all(
        sitemaps.map(sm => this.fetchSitemap(String(sm.loc), fetchFn, depth + 1))
      );
      return results.flat();
    }

    // 通常の urlset
    if (parsed.urlset) {
      const urlset = parsed.urlset as { url?: unknown };
      const urls = toArray<{ loc: unknown; lastmod?: unknown }>(urlset.url);
      return urls.map(u => ({
        url: String(u.loc),
        lastmod: u.lastmod != null ? String(u.lastmod) : undefined,
      }));
    }

    return [];
  }
}

/** XML パーサの出力は単一要素でも配列でもありうるため、統一的に配列へ変換 */
function toArray<T>(value: unknown): T[] {
  if (!value) return [];
  return Array.isArray(value) ? (value as T[]) : ([value] as T[]);
}
