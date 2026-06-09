import { describe, it, expect } from 'vitest';
import { buildTree } from '../builders/treeBuilder.js';

const BASE = 'http://example.com';

describe('buildTree', () => {
  it('ルートのみの場合、子が空のルートノードを返す', () => {
    const tree = buildTree([{ url: `${BASE}/` }], BASE);
    expect(tree.id).toBe('/');
    expect(tree.children).toHaveLength(0);
  });

  it('フラットな URL 群を正しくツリー化する', () => {
    const urls = [
      { url: `${BASE}/about` },
      { url: `${BASE}/contact` },
    ];
    const tree = buildTree(urls, BASE);
    expect(tree.children).toHaveLength(2);
    const slugs = tree.children.map(c => c.pathSegment).sort();
    expect(slugs).toEqual(['about', 'contact']);
  });

  it('ネストした URL を正しい階層に配置する', () => {
    const urls = [
      { url: `${BASE}/docs` },
      { url: `${BASE}/docs/api` },
      { url: `${BASE}/docs/api/core` },
    ];
    const tree = buildTree(urls, BASE);
    const docs = tree.children.find(c => c.pathSegment === 'docs')!;
    expect(docs).toBeDefined();
    const api = docs.children.find(c => c.pathSegment === 'api')!;
    expect(api).toBeDefined();
    expect(api.children[0].pathSegment).toBe('core');
  });

  it('depth フィールドが正しく設定される', () => {
    const urls = [
      { url: `${BASE}/a` },
      { url: `${BASE}/a/b` },
    ];
    const tree = buildTree(urls, BASE);
    const a = tree.children[0];
    expect(a.depth).toBe(1);
    expect(a.children[0].depth).toBe(2);
  });

  it('maxDepth を超えた URL は無視される', () => {
    const urls = [
      { url: `${BASE}/a/b/c/d/e` },
    ];
    const tree = buildTree(urls, BASE, 2);
    // 深度 2 を超えるので子が追加されない
    expect(tree.children).toHaveLength(0);
  });

  it('maxNodes を超えた URL は無視される', () => {
    const urls = Array.from({ length: 10 }, (_, i) => ({ url: `${BASE}/page-${i}` }));
    const tree = buildTree(urls, BASE, 10, 3);
    // maxNodes=3 なので最大 2 子まで（ルートが1つ消費）
    expect(tree.children.length).toBeLessThanOrEqual(2);
  });

  it('異なるオリジンの URL は無視される', () => {
    const urls = [
      { url: 'http://other.com/page' },
      { url: `${BASE}/about` },
    ];
    const tree = buildTree(urls, BASE);
    expect(tree.children).toHaveLength(1);
    expect(tree.children[0].pathSegment).toBe('about');
  });

  it('title が指定されていればノードに反映される', () => {
    const urls = [{ url: `${BASE}/about`, title: 'About Us' }];
    const tree = buildTree(urls, BASE);
    expect(tree.children[0].title).toBe('About Us');
  });
});
