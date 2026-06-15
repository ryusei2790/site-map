import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About' };

export default function About() {
  return (
    <main className="page">
      <div className="page-header">
        <span className="badge">About</span>
        <h1>site-map について</h1>
        <p>どのウェブサイトにも数行で導入できるサイトマッププラグインです。</p>
      </div>

      <div className="card">
        <h2>モチベーション</h2>
        <p>
          大規模なドキュメントサイトやブログでは、ユーザーが現在地を見失いがちです。
          site-map は画面左下にフローティング UI を表示し、
          全ページの階層マップと現在ページを一目で確認できます。
        </p>
      </div>

      <div className="card">
        <h2>技術スタック</h2>
        <p>TypeScript / React 18 / Vue 3 / Web Worker / IndexedDB</p>
      </div>

      <div className="card">
        <h2>対応フレームワーク</h2>
        <p>Next.js / Nuxt / Vite / Astro など主要なフレームワークで動作します。</p>
      </div>
    </main>
  );
}
