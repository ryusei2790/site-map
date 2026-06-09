import type { UrlEntry, TreeNode } from '../types.js';
import { normalizePath, getPathSegments, normalizeBaseUrl } from './pathUtils.js';

/**
 * URL 配列からサイト階層ツリーを構築する。
 *
 * アルゴリズム：
 * 1. 全 URL を URL 文字列でソート（親が子より先に現れるよう）
 * 2. 各 URL をパスセグメントに分解
 * 3. ルートノードに再帰的に挿入
 */
export function buildTree(
  entries: UrlEntry[],
  baseUrl: string,
  maxDepth = 10,
  maxNodes = 500
): TreeNode {
  const base = normalizeBaseUrl(baseUrl);

  const root: TreeNode = {
    id: '/',
    url: base + '/',
    title: 'Home',
    pathSegment: '/',
    depth: 0,
    children: [],
  };

  // URL 文字列でソートすると親パスが子パスより先に来る
  const sorted = [...entries].sort((a, b) => a.url.localeCompare(b.url));

  let nodeCount = 1;

  for (const entry of sorted) {
    if (nodeCount >= maxNodes) break;

    const path = normalizePath(entry.url, base);
    if (!path) continue;

    if (path === '/') {
      if (entry.title) root.title = entry.title;
      continue;
    }

    const segments = getPathSegments(path);
    if (segments.length > maxDepth) continue;

    insertNode(root, segments, entry, base, 0);
    nodeCount++;
  }

  return root;
}

/** ルートノードからセグメント配列を辿り、適切な位置にノードを挿入・更新する */
function insertNode(
  parent: TreeNode,
  segments: string[],
  entry: UrlEntry,
  base: string,
  depth: number
): void {
  if (segments.length === 0) return;

  const [segment, ...rest] = segments;

  let child = parent.children.find(c => c.pathSegment === segment);

  if (!child) {
    child = {
      id: buildId(parent.id, segment),
      url: buildUrl(parent.url, base, segment),
      title: segment,
      pathSegment: segment,
      depth: depth + 1,
      children: [],
    };
    parent.children.push(child);
  }

  if (rest.length === 0) {
    // このエントリがこのノードに対応する → 実データで上書き
    child.url = entry.url;
    if (entry.title) child.title = entry.title;
  } else {
    insertNode(child, rest, entry, base, depth + 1);
  }
}

function buildId(parentId: string, segment: string): string {
  return parentId === '/' ? `/${segment}` : `${parentId}/${segment}`;
}

function buildUrl(parentUrl: string, base: string, segment: string): string {
  // ルートノードの url は "https://example.com/" なので正規化して連結
  const cleanParent = parentUrl.replace(/\/$/, '');
  return `${cleanParent}/${segment}`;
}
