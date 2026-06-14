/**
 * Worker スレッドとメインスレッド間で共有する型定義。
 * Comlink の型引数として使われる。
 */
import type { UrlEntry, SiteMapConfig } from '../types.js';

/** Worker が公開する API。Comlink.expose() の対象 */
export interface WorkerApi {
  /**
   * 設定に従い adapter でURLリストを取得する。
   * 重いネットワーク処理（fetch + parse）を Worker 内で実行する。
   */
  fetchUrls(config: SiteMapConfig): Promise<UrlEntry[]>;
}

export type { UrlEntry, SiteMapConfig };
