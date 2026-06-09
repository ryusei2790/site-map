/**
 * URL を baseUrl からの相対パスに正規化する。
 * 末尾スラッシュを除去し、異なるオリジンの URL は空文字列を返す。
 */
export function normalizePath(url: string, baseUrl: string): string {
  try {
    const urlObj = new URL(url);
    const baseObj = new URL(baseUrl);

    if (urlObj.origin !== baseObj.origin) return '';

    let path = urlObj.pathname;
    // ルート以外の末尾スラッシュを除去（"/blog/" → "/blog"）
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    return path;
  } catch {
    return '';
  }
}

/**
 * パス文字列をセグメント配列に分解する。
 * "/docs/api/core" → ["docs", "api", "core"]
 */
export function getPathSegments(path: string): string[] {
  return path.split('/').filter(Boolean);
}

/**
 * ベース URL を正規化（末尾スラッシュを除去）する。
 */
export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '');
}
