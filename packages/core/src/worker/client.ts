/**
 * Web Worker + Comlink を使って createSiteMap() 相当の処理を
 * バックグラウンドスレッドで実行するクライアント。
 *
 * メインスレッドは Comlink.wrap() で包んだ関数を呼ぶだけ。
 * 重いネットワーク処理は Worker 側（siteMapWorker.ts）で動く。
 *
 * 使用するバンドラー（Vite / Webpack 5 / Parcel 2）は
 * `new URL(..., import.meta.url)` の構文を Worker として認識し、
 * ビルド時に自動でバンドルを分割する。
 */
import { wrap, type Remote } from 'comlink';
import type { WorkerApi } from './api.js';
import type { SiteMapConfig, SiteMapInstance, TreeNode } from '../types.js';
import { LocalStorageCache } from '../cache/localStorage.js';
import type { CacheLayer } from '../cache/index.js';
import { buildTree } from '../builders/treeBuilder.js';

const DEFAULT_TTL = 30 * 60 * 1000;

/**
 * Worker 接続を管理するシングルトン。
 * 同一ページで何度呼ばれても Worker は 1 本だけ起動する。
 */
let workerInstance: Worker | null = null;
let remoteApi: Remote<WorkerApi> | null = null;

function getRemoteApi(): Remote<WorkerApi> | null {
  // SSR（Node.js）や Worker 未対応環境ではメインスレッドフォールバックを呼び出し元に委ねる
  if (typeof Worker === 'undefined') return null;

  if (!remoteApi) {
    workerInstance = new Worker(
      // バンドラーが import.meta.url を基準に Worker ファイルのパスを解決する
      new URL('./siteMapWorker.js', import.meta.url),
      { type: 'module' }
    );
    remoteApi = wrap<WorkerApi>(workerInstance);
  }

  return remoteApi;
}

/**
 * Worker が不要になったタイミングで呼ぶ。
 * Worker を terminate して次回 getRemoteApi() で再生成できるようリセットする。
 */
export function terminateSiteMapWorker(): void {
  workerInstance?.terminate();
  workerInstance = null;
  remoteApi = null;
}

/**
 * Web Worker を使って URL 取得をバックグラウンドで行う SiteMapInstance を生成する。
 * Worker が使えない環境（SSR / 未対応ブラウザ）では null を返す。
 * null の場合は通常の createSiteMap() にフォールバックすること。
 *
 * @example
 * const siteMap = createSiteMapWorker(config) ?? createSiteMap(config);
 * const tree = await siteMap.load();
 */
export function createSiteMapWorker(
  config: SiteMapConfig,
  cache: CacheLayer = new LocalStorageCache()
): SiteMapInstance | null {
  const remote = getRemoteApi();
  if (!remote) return null;

  // クロージャ内で TypeScript が null 絞り込みを維持できるよう明示的に型付けした const に再束縛する
  const boundRemote: Remote<WorkerApi> = remote;

  const cacheKey = `site-map:${config.baseUrl}`;
  const ttl = config.ttl ?? DEFAULT_TTL;

  async function load(): Promise<TreeNode> {
    const cached = await cache.get<TreeNode>(cacheKey);
    if (cached) return cached;

    // 重いネットワーク処理だけ Worker に委譲する
    const urls = await boundRemote.fetchUrls(config);
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
    void cache.clear(cacheKey);
  }

  return { load, refresh, clearCache };
}
