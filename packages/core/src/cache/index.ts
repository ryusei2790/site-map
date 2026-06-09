/**
 * キャッシュ層の抽象インターフェース。
 * v0.1 は LocalStorageCache、v0.2 以降は IndexedDBCache に差し替える。
 */
export interface CacheLayer {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl: number): Promise<void>;
  /** key を省略するとプレフィックス "site-map:" の全エントリを削除 */
  clear(key?: string): Promise<void>;
}
