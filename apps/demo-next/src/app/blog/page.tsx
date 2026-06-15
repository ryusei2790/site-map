import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Blog' };

const posts = [
  { slug: 'post-1', title: 'Getting Started with site-map', date: '2026-06-01', desc: 'React プロジェクトへの導入方法を解説します。' },
  { slug: 'post-2', title: 'Vue 3 Integration Guide',        date: '2026-06-10', desc: 'Vue 3 Composition API を使った統合方法。' },
];

export default function Blog() {
  return (
    <main className="page">
      <div className="page-header">
        <span className="badge">Blog</span>
        <h1>ブログ</h1>
        <p>使い方のガイドや事例紹介を掲載しています。</p>
      </div>

      {posts.map(post => (
        <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '6px' }}>{post.date}</p>
            <h2>{post.title}</h2>
            <p>{post.desc}</p>
          </div>
        </Link>
      ))}
    </main>
  );
}
