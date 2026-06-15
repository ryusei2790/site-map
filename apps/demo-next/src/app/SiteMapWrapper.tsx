'use client';

/**
 * @site-map/react は useState / useEffect を使うため 'use client' が必須。
 * Server Component の layout.tsx からはこのラッパー経由で呼び出す。
 */
import { useEffect, useState } from 'react';
import { SiteMap } from '@site-map/react';

export function SiteMapWrapper() {
  const [baseUrl, setBaseUrl] = useState('');

  // SSR では window が存在しないため onMount で取得する
  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  if (!baseUrl) return null;

  // SiteMapProps = SiteMapConfig なのでプロパティをフラットに渡す
  return (
    <SiteMap
      baseUrl={baseUrl}
      strategy="static"
      staticUrls={[
        { url: `${baseUrl}/`,                       title: 'Home' },
        { url: `${baseUrl}/about`,                  title: 'About' },
        { url: `${baseUrl}/blog`,                   title: 'Blog' },
        { url: `${baseUrl}/blog/post-1`,            title: 'Getting Started with site-map' },
        { url: `${baseUrl}/blog/post-2`,            title: 'Vue 3 Integration Guide' },
        { url: `${baseUrl}/docs`,                   title: 'Documentation' },
        { url: `${baseUrl}/docs/getting-started`,   title: 'Getting Started' },
        { url: `${baseUrl}/docs/api`,               title: 'API Reference' },
      ]}
    />
  );
}
