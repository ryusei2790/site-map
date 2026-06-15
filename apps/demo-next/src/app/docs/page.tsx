import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Documentation' };

export default function Docs() {
  return (
    <main className="page">
      <div className="page-header">
        <span className="badge">Docs</span>
        <h1>ドキュメント</h1>
        <p>@site-map/react / @site-map/vue の詳細なドキュメントです。</p>
      </div>

      <Link href="/docs/getting-started" style={{ display: 'block', textDecoration: 'none' }}>
        <div className="card" style={{ cursor: 'pointer' }}>
          <h2>📖 Getting Started</h2>
          <p>インストールと基本設定の手順を説明します。</p>
        </div>
      </Link>

      <Link href="/docs/api" style={{ display: 'block', textDecoration: 'none' }}>
        <div className="card" style={{ cursor: 'pointer' }}>
          <h2>🔧 API Reference</h2>
          <p>SiteMapConfig Props の全オプション一覧。</p>
        </div>
      </Link>
    </main>
  );
}
