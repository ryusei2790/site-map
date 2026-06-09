import type { DataSourceAdapter } from './index.js';
import type { UrlEntry, SiteMapConfig } from '../types.js';

/**
 * ユーザーが config.staticUrls に直接指定した URL 配列をそのまま返すアダプタ。
 * テスト・ビルド時静的生成・Next.js 等のルート情報を手動渡しする用途に使う。
 */
export class StaticAdapter implements DataSourceAdapter {
  readonly name = 'static';

  async fetch(config: SiteMapConfig): Promise<UrlEntry[]> {
    return config.staticUrls ?? [];
  }
}
