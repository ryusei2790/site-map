/** サイトマップのツリー構造の1ノード */
export interface TreeNode {
  /** URL パスを ID として使用（例: "/docs/api"） */
  id: string;
  /** このノードの絶対 URL */
  url: string;
  /** ページタイトル（sitemap や <title> タグから取得） */
  title?: string;
  /** パスの末尾セグメント（例: "api"） */
  pathSegment: string;
  /** ルートからの深さ（ルート = 0） */
  depth: number;
  /** 子ノード一覧 */
  children: TreeNode[];
}

/** sitemap.xml や DOM クロールから取得した URL 情報 */
export interface UrlEntry {
  url: string;
  title?: string;
  lastmod?: string;
}

/** データソース選択戦略 */
export type AdapterStrategy = 'auto' | 'sitemap' | 'crawl' | 'static' | 'api';

/** フローティング UI のテーマオプション */
export interface ThemeOptions {
  /** ハイライト色（現在ページノード） */
  primaryColor?: string;
  /** パネル背景色 */
  backgroundColor?: string;
  /** テキスト色 */
  textColor?: string;
  /** フォントファミリ */
  fontFamily?: string;
}

/** createSiteMap() に渡す設定オブジェクト */
export interface SiteMapConfig {
  /** クロール対象のサイトベース URL（例: "https://example.com"） */
  baseUrl: string;
  /**
   * キャッシュの有効期間（ミリ秒）
   * @default 1800000 (30分)
   */
  ttl?: number;
  /**
   * データソース戦略
   * - 'auto': sitemap.xml を試み、失敗時に crawl へフォールバック
   * @default 'auto'
   */
  strategy?: AdapterStrategy;
  /** StaticAdapter 用: ユーザーが直接指定する URL 一覧 */
  staticUrls?: UrlEntry[];
  /** ApiAdapter 用（v1.0）: ホスト型 API エンドポイント */
  apiEndpoint?: string;
  /** ApiAdapter 用（v1.0）: API キー */
  apiKey?: string;
  /** UI テーマ設定 */
  theme?: ThemeOptions;
  /**
   * ツリーの最大深度
   * @default 10
   */
  maxDepth?: number;
  /**
   * 最大ノード数（クロール上限）
   * @default 500
   */
  maxNodes?: number;
  /**
   * カスタム fetch 関数（CORS 回避やテスト用モックに使用）
   * @default globalThis.fetch
   */
  fetchFn?: typeof fetch;
}

/** createSiteMap() が返すインスタンス */
export interface SiteMapInstance {
  /** ツリーを取得（キャッシュがあれば返し、なければ取得） */
  load(): Promise<TreeNode>;
  /** キャッシュをクリアしてツリーを再取得 */
  refresh(): Promise<void>;
  /** このサイトのキャッシュを同期的にクリア */
  clearCache(): void;
}
