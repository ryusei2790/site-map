import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteMapWrapper } from './SiteMapWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: { template: '%s | site-map demo', default: 'site-map demo' },
  description: '@site-map/react の動作デモ。画面左下のアイコンをクリックしてください。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <nav className="nav" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', maxWidth: '100%' }}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/docs">Docs</Link>
        </nav>

        {children}

        {/* @site-map/react のフローティング UI（全ページ共通） */}
        <SiteMapWrapper />
      </body>
    </html>
  );
}
