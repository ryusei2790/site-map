/**
 * IndexedDB を使ったキャッシュ実装（v0.2）。
 * LocalStorageCache（5MB 上限・同期）の課題を解消する：
 *   - 容量制限なし（ブラウザが許す限り）
 *   - 非同期 API なのでメインスレッドをブロックしない
 *   - SSR 環境（Node.js）では全操作を無音でスキップする
 */
import { openDB, type IDBPDatabase } from 'idb';
import type { CacheLayer } from './index.js';

const DB_NAME = 'site-map-cache';
const DB_VERSION = 1;
const STORE_NAME = 'entries';

/** スキーマ変更時にこのバージョンを上げると古いキャッシュを自動破棄する */
const SCHEMA_VERSION = '1';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  schemaVersion: string;
}

/**
 * IndexedDB を使ったキャッシュ実装。
 * idb ライブラリ（IDBDatabase の Promise ラッパー）を使用する。
 */
export class IndexedDBCache implements CacheLayer {
  /** DB 接続を遅延初期化して保持する。SSR では null のまま */
  private dbPromise: Promise<IDBPDatabase> | null = null;

  private getDb(): Promise<IDBPDatabase> | null {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      return null;
    }

    if (!this.dbPromise) {
      this.dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        },
      });
    }

    return this.dbPromise;
  }

  async get<T>(key: string): Promise<T | null> {
    const dbPromise = this.getDb();
    if (!dbPromise) return null;

    try {
      const db = await dbPromise;
      const entry: CacheEntry<T> | undefined = await db.get(STORE_NAME, key);

      if (!entry) return null;

      if (entry.schemaVersion !== SCHEMA_VERSION) {
        await db.delete(STORE_NAME, key);
        return null;
      }

      if (Date.now() > entry.expiresAt) {
        await db.delete(STORE_NAME, key);
        return null;
      }

      return entry.value;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    const dbPromise = this.getDb();
    if (!dbPromise) return;

    try {
      const db = await dbPromise;
      const entry: CacheEntry<T> = {
        value,
        expiresAt: Date.now() + ttl,
        schemaVersion: SCHEMA_VERSION,
      };
      await db.put(STORE_NAME, entry, key);
    } catch {
      // クォータ超過など予期せぬエラーは無音でスキップ
    }
  }

  async clear(key?: string): Promise<void> {
    const dbPromise = this.getDb();
    if (!dbPromise) return;

    try {
      const db = await dbPromise;

      if (key) {
        await db.delete(STORE_NAME, key);
        return;
      }

      // キーが未指定なら "site-map:" プレフィックスのエントリのみ削除
      const allKeys = await db.getAllKeys(STORE_NAME);
      const tx = db.transaction(STORE_NAME, 'readwrite');
      await Promise.all(
        allKeys
          .filter((k): k is string => typeof k === 'string' && k.startsWith('site-map:'))
          .map(k => tx.store.delete(k))
      );
      await tx.done;
    } catch {
      // 無音でスキップ
    }
  }
}
