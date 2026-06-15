import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'API Reference' };

const props = [
  { name: 'baseUrl',     type: 'string',                required: true,  desc: 'クロール対象サイトのベース URL（例: https://example.com）' },
  { name: 'strategy',   type: "'auto'|'sitemap'|'crawl'|'static'", required: false, desc: 'データ取得戦略。デフォルト: auto' },
  { name: 'staticUrls', type: 'UrlEntry[]',             required: false, desc: 'strategy: static のときに使う URL リスト' },
  { name: 'ttl',        type: 'number',                 required: false, desc: 'キャッシュの有効期間（ms）。デフォルト: 1800000（30分）' },
  { name: 'maxDepth',   type: 'number',                 required: false, desc: 'ツリーの最大階層数。デフォルト: 10' },
  { name: 'maxNodes',   type: 'number',                 required: false, desc: '最大ノード数。デフォルト: 500' },
  { name: 'theme',      type: 'ThemeOptions',           required: false, desc: 'テーマカラーのカスタマイズ' },
];

export default function ApiReference() {
  return (
    <main className="page">
      <Link href="/docs" style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>← Docs へ</Link>
      <div className="page-header" style={{ marginTop: '20px' }}>
        <span className="badge">API Reference</span>
        <h1>SiteMapConfig</h1>
        <p>&lt;SiteMap config={'{...}'} /&gt; に渡す設定オブジェクトの全プロパティ。</p>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px' }}>プロパティ</th>
              <th style={{ padding: '10px 12px' }}>型</th>
              <th style={{ padding: '10px 12px' }}>必須</th>
              <th style={{ padding: '10px 12px' }}>説明</th>
            </tr>
          </thead>
          <tbody>
            {props.map(p => (
              <tr key={p.name} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--accent)' }}>{p.name}</td>
                <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--muted)', fontSize: '0.8rem' }}>{p.type}</td>
                <td style={{ padding: '10px 12px', color: p.required ? '#ef4444' : 'var(--muted)' }}>{p.required ? '✓' : '-'}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text)' }}>{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
