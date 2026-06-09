import type { CacheLayer } from './index.js';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  /** スキーマ変更時に古いキャッシュを自動破棄するためのバージョン */
  schemaVersion: string;
}

/** このバージョンを変えると既存キャッシュは全て破棄される */
const SCHEMA_VERSION = '1';

/**
 * localStorage を使ったキャッシュ実装（v0.1）。
 * localStorage が使えない環境（SSR・プライベートブラウジング）では
 * 全操作を無音でスキップする。
 */
export class LocalStorageCache implements CacheLayer {
  async get<T>(key: string): Promise<T | null> {
    if (!isLocalStorageAvailable()) return null;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;

      const entry: CacheEntry<T> = JSON.parse(raw);

      if (entry.schemaVersion !== SCHEMA_VERSION) {
        localStorage.removeItem(key);
        return null;
      }

      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }

      return entry.value;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    if (!isLocalStorageAvailable()) return;

    try {
      const entry: CacheEntry<T> = {
        value,
        expiresAt: Date.now() + ttl,
        schemaVersion: SCHEMA_VERSION,
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // localStorage が容量オーバーや制限されている場合は無音でスキップ
    }
  }

  async clear(key?: string): Promise<void> {
    if (!isLocalStorageAvailable()) return;

    if (key) {
      localStorage.removeItem(key);
      return;
    }

    // キーが未指定なら "site-map:" プレフィックスのエントリのみ削除
    // （他アプリの localStorage を誤って消さないための安全策）
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith('site-map:')) keysToRemove.push(k);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
}

function isLocalStorageAvailable(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage !== null;
  } catch {
    return false;
  }
}
