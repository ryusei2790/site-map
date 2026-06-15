import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Getting Started' };

export default function GettingStarted() {
  return (
    <main className="page">
      <Link href="/docs" style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>← Docs へ</Link>
      <div className="page-header" style={{ marginTop: '20px' }}>
        <span className="badge">Getting Started</span>
        <h1>はじめかた</h1>
        <p>3 ステップで導入できます。</p>
      </div>

      <div className="card">
        <h2>Step 1: インストール</h2>
        <pre>{`npm install @site-map/react @site-map/core`}</pre>
      </div>

      <div className="card">
        <h2>Step 2: コンポーネントを配置</h2>
        <pre>{`// app/layout.tsx
'use client'
import { SiteMap } from '@site-map/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SiteMap config={{ baseUrl: 'https://your-site.com' }} />
      </body>
    </html>
  )
}`}</pre>
      </div>

      <div className="card">
        <h2>Step 3: 確認</h2>
        <p>ブラウザを開くと左下にアイコンが表示されます。クリックするとサイトマップが展開されます。</p>
      </div>
    </main>
  );
}
