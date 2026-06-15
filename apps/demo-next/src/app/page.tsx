import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Home' };

export default function Home() {
  return (
    <main className="page">
      <div className="page-header">
        <span className="badge">npm package demo</span>
        <h1>@site-map/react</h1>
        <p>
          どのウェブサイトにも導入できる、フローティング型サイトマップ UI。<br />
          画面左下のアイコンをクリックして動作を確認してください。
        </p>
      </div>

      <div className="hint">
        💡 左下のアイコンをクリック → 全ページの階層マップが表示されます
      </div>

      <div className="card">
        <h2>インストール</h2>
        <pre>{`npm install @site-map/react @site-map/core`}</pre>
      </div>

      <div className="card">
        <h2>使い方（React / Next.js）</h2>
        <pre>{`'use client'
import { SiteMap } from '@site-map/react'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <SiteMap config={{ baseUrl: 'https://your-site.com' }} />
    </>
  )
}`}</pre>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/docs/getting-started" className="card" style={{ flex: '1', minWidth: '200px' }}>
          <h2>📖 Getting Started</h2>
          <p>インストールと基本設定</p>
        </Link>
        <Link href="/docs/api" className="card" style={{ flex: '1', minWidth: '200px' }}>
          <h2>🔧 API Reference</h2>
          <p>Props と設定オプション</p>
        </Link>
        <Link href="/blog" className="card" style={{ flex: '1', minWidth: '200px' }}>
          <h2>📝 Blog</h2>
          <p>使い方と事例紹介</p>
        </Link>
      </div>
    </main>
  );
}
