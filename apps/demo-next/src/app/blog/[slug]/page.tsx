import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const posts: Record<string, { title: string; date: string; content: string }> = {
  'post-1': {
    title: 'Getting Started with site-map',
    date: '2026-06-01',
    content: `
## インストール

\`\`\`bash
npm install @site-map/react @site-map/core
\`\`\`

## 基本的な使い方

\`\`\`tsx
import { SiteMap } from '@site-map/react'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <SiteMap config={{ baseUrl: 'https://your-site.com' }} />
    </>
  )
}
\`\`\`

## strategy の選択

- \`auto\`（デフォルト）: sitemap.xml を取得、失敗時は crawl へフォールバック
- \`sitemap\`: sitemap.xml のみ使用
- \`crawl\`: BFS でリンクをクロール
- \`static\`: URL リストを直接指定
    `,
  },
  'post-2': {
    title: 'Vue 3 Integration Guide',
    date: '2026-06-10',
    content: `
## インストール

\`\`\`bash
npm install @site-map/vue @site-map/core
\`\`\`

## style.css の読み込み

\`\`\`ts
import '@site-map/vue/dist/style.css'
\`\`\`

## コンポーネントの使用

\`\`\`vue
<script setup>
import { SiteMap } from '@site-map/vue'
const config = { baseUrl: 'https://your-site.com' }
</script>

<template>
  <SiteMap :config="config" />
</template>
\`\`\`
    `,
  },
};

export function generateStaticParams() {
  return Object.keys(posts).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: posts[slug]?.title ?? 'Post' };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <main className="page">
      <Link href="/blog" style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>← Blog 一覧へ</Link>
      <div className="page-header" style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '8px' }}>{post.date}</p>
        <h1>{post.title}</h1>
      </div>
      <div className="card">
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem', background: 'none', padding: 0, color: 'var(--text)' }}>
          {post.content.trim()}
        </pre>
      </div>
    </main>
  );
}
