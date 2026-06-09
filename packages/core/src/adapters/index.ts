import type { UrlEntry, SiteMapConfig } from '../types.js';

/**
 * データソースを抽象化するインターフェース。
 * 新しいデータソース（CMS API、GraphQL 等）はこの型を実装するだけで
 * createSiteMap() に差し込める。
 */
export interface DataSourceAdapter {
  readonly name: string;
  fetch(config: SiteMapConfig): Promise<UrlEntry[]>;
}

export type { UrlEntry };
