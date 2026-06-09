# site-map

**Web サイト任意の場所に1行追加するだけで、左下フローティング階層マップが現れる npm パッケージ。**

`sitemap.xml` の自動取得と内部リンクのクローリングによりサイト構造を自動把握するため、ページを追加・削除しても設定変更不要。Shadow DOM による CSS 完全隔離で、ホストサイトのデザインを壊しません。

---

## デモ

```
[左下アイコン] をクリック
        ↓
┌─────────────────────┐
│ 📍 サイトマップ       │
├─────────────────────┤
│ ▶ blog              │
│   ├ post-1          │
│   └ post-2  ← 現在地│ ◀ ハイライト
│ ▶ docs              │
│   ├ getting-started │
│   └ api             │
│ about               │
└─────────────────────┘
```

---

## パッケージ構成

| パッケージ | 説明 |
|-----------|------|
| [`@site-map/core`](./packages/core) | フレームワーク非依存のロジック層（sitemap パース・クロール・ツリー構築・キャッシュ） |
| [`@site-map/react`](./packages/react) | React 18 adapter（Shadow DOM + フローティング UI コンポーネント） |

---

## インストール

```bash
# React プロジェクト
npm install @site-map/core @site-map/react
# or
pnpm add @site-map/core @site-map/react
```

---

## 使い方

### React

```tsx
import { SiteMap } from '@site-map/react';

export default function App() {
  return (
    <>
      <YourApp />
      {/* これだけで左下に階層マップが出現する */}
      <SiteMap baseUrl="https://your-site.com" />
    </>
  );
}
```

### Next.js（App Router）

```tsx
// app/layout.tsx
'use client';
import { SiteMap } from '@site-map/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SiteMap baseUrl="https://your-site.com" />
      </body>
    </html>
  );
}
```

### Vanilla JS（core のみ）

```ts
import { createSiteMap } from '@site-map/core';

const siteMap = createSiteMap({ baseUrl: 'https://your-site.com' });
const tree = await siteMap.load();
console.log(tree); // TreeNode（階層ツリー）
```

---

## Props（SiteMap コンポーネント）

| Prop | 型 | デフォルト | 説明 |
|------|----|-----------|------|
| `baseUrl` | `string` | **必須** | クロール対象のサイトベース URL |
| `ttl` | `number` | `1800000`（30分） | キャッシュ有効期間（ミリ秒） |
| `strategy` | `'auto' \| 'sitemap' \| 'crawl' \| 'static'` | `'auto'` | データソース戦略 |
| `staticUrls` | `UrlEntry[]` | — | `strategy: 'static'` 時に使う URL 一覧 |
| `maxDepth` | `number` | `10` | ツリーの最大深度 |
| `maxNodes` | `number` | `500` | クロール上限ノード数 |
| `theme` | `ThemeOptions` | — | カラー・フォントのカスタマイズ |
| `fetchFn` | `typeof fetch` | `globalThis.fetch` | カスタム fetch（CORS 回避・テスト用） |

### テーマカスタマイズ

```tsx
<SiteMap
  baseUrl="https://your-site.com"
  theme={{
    primaryColor: '#8b5cf6',    // ハイライト色
    backgroundColor: '#1e1e2e', // パネル背景
    textColor: '#cdd6f4',       // テキスト色
    fontFamily: 'JetBrains Mono, monospace',
  }}
/>
```

---

## データソース戦略

| strategy | 動作 |
|---------|------|
| `'auto'`（デフォルト） | `/sitemap.xml` を取得 → 失敗時は同一オリジンをクロール |
| `'sitemap'` | `/sitemap.xml`（+ `sitemap_index.xml` 再帰対応）のみ |
| `'crawl'` | BFS クロールのみ（sitemap なしサイト向け） |
| `'static'` | `staticUrls` に渡した URL 配列をそのまま使用 |

---

## アーキテクチャ

```
@site-map/react
  SiteMap（公開コンポーネント）
  └── ShadowHost（Shadow DOM + createPortal）
       ├── FloatingIcon（左下アイコン）
       └── PanelContainer（パネル外枠）
            └── TreeView > TreeNodeItem（再帰ツリー）

@site-map/core
  createSiteMap()
  ├── DataSourceAdapter（interface）
  │   ├── SitemapAdapter   ← fast-xml-parser
  │   ├── CrawlAdapter     ← fetch + DOMParser
  │   └── StaticAdapter    ← ユーザー指定 JSON
  ├── TreeBuilder          ← URL[] → TreeNode
  └── CacheLayer（interface）
      └── LocalStorageCache（v0.1）
```

---

## 開発環境のセットアップ

### 必要なもの
- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

### 起動

```bash
git clone https://github.com/ryusei2790/site-map.git
cd site-map

# Docker で開発環境を起動（Node 22 開発コンテナ + nginx テストサイト）
docker compose up

# または ホスト環境で直接起動
pnpm install
pnpm dev
```

| URL | 内容 |
|-----|------|
| `http://localhost:6006` | Storybook（コンポーネント開発） |
| `http://localhost:8080` | nginx テストサイト（sitemap.xml あり） |

### テスト

```bash
pnpm test                          # 全パッケージのテストを実行
pnpm --filter @site-map/core test  # core のみ
```

### ビルド

```bash
pnpm build  # Turborepo が依存順にビルド（core → react）
```

---

## リリースロードマップ

| バージョン | 内容 |
|-----------|------|
| **v0.1**（現在） | MVP：sitemap.xml / クロール・LocalStorage キャッシュ・React adapter |
| v0.2 | Web Worker（Comlink）+ IndexedDB キャッシュ・Vue adapter 追加 |
| v1.0 | ホスト型 API（Cloudflare Workers + KV）オプション・大規模サイト対応 |

---

## 技術スタック

- **言語**：TypeScript 5.x
- **モノレポ**：pnpm workspace + Turborepo
- **ビルド**：tsup（esbuild ベース）
- **テスト**：Vitest
- **スタイリング**：Shadow DOM + CSS テキスト注入（ホストサイトと完全隔離）
- **CI/CD**：GitHub Actions（Node 20/22 マトリクス）
- **リリース管理**：changesets

---

## ライセンス

MIT

---

<p align="center">
  Made with ❤️ — <a href="https://github.com/ryusei2790/site-map">ryusei2790/site-map</a>
</p>
