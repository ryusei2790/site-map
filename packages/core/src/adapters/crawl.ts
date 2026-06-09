import type { DataSourceAdapter } from './index.js';
import type { UrlEntry, SiteMapConfig } from '../types.js';

/**
 * 同一オリジン内のリンクを BFS でクロールするアダプタ。
 * sitemap.xml が存在しないサイト向けのフォールバック。
 *
 * 制約：
 * - 同一オリジンのリンクのみ追跡（外部リンク・クロスオリジン無視）
 * - maxNodes を超えた時点でクロール停止
 * - DOMParser が存在しない環境（Node.js テスト等）では空配列を返す
 */
export class CrawlAdapter implements DataSourceAdapter {
  readonly name = 'crawl';

  async fetch(config: SiteMapConfig): Promise<UrlEntry[]> {
    const fetchFn = config.fetchFn ?? globalThis.fetch.bind(globalThis);
    const base = config.baseUrl.replace(/\/$/, '');
    const maxNodes = config.maxNodes ?? 500;

    const visited = new Set<string>();
    const queue: string[] = [`${base}/`];
    const entries: UrlEntry[] = [];

    while (queue.length > 0 && entries.length < maxNodes) {
      const url = queue.shift()!;
      const normalized = normalizeForVisited(url);

      if (visited.has(normalized)) continue;
      visited.add(normalized);

      try {
        const links = await this.extractLinks(url, base, fetchFn);
        entries.push({ url });

        for (const link of links) {
          if (!visited.has(normalizeForVisited(link))) {
            queue.push(link);
          }
        }
      } catch {
        // フェッチ失敗ページはスキップして続行
      }
    }

    return entries;
  }

  private async extractLinks(
    url: string,
    base: string,
    fetchFn: typeof fetch
  ): Promise<string[]> {
    // DOMParser が使えない環境（Worker や SSR 等）ではスキップ
    if (typeof DOMParser === 'undefined') return [];

    const res = await fetchFn(url);
    if (!res.ok) return [];

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const links: string[] = [];

    doc.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(anchor => {
      try {
        const parsed = new URL(anchor.href, url);
        const baseOrigin = new URL(base).origin;
        // 同一オリジン・フラグメント無し・クエリパラメータ有りは許容
        if (parsed.origin === baseOrigin && !parsed.hash) {
          links.push(parsed.href);
        }
      } catch {
        // 無効な URL はスキップ
      }
    });

    return [...new Set(links)];
  }
}

/**
 * 訪問済み判定に使う正規化キー。
 * 末尾スラッシュ・フラグメントを除去して重複訪問を防ぐ。
 */
function normalizeForVisited(url: string): string {
  try {
    const u = new URL(url);
    let path = u.pathname;
    if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
    return u.origin + path;
  } catch {
    return url;
  }
}
