import { useState, useCallback } from 'react';
import type { SiteMapConfig } from '@site-map/core';
import { ShadowHost } from './ShadowHost.js';
import { FloatingIcon } from './FloatingIcon.js';
import { PanelContainer } from './PanelContainer.js';
import { useSiteTree } from '../hooks/useSiteTree.js';
import { useCurrentPath } from '../hooks/useCurrentPath.js';

/** <SiteMap /> コンポーネントが受け取る props（SiteMapConfig と同じ） */
export type SiteMapProps = SiteMapConfig;

/**
 * @site-map/react の公開コンポーネント。
 * ホストサイトの任意の場所に1行追加するだけで
 * 左下フローティング階層マップが有効になる。
 *
 * @example
 * // React アプリのルートコンポーネントに追加
 * <SiteMap baseUrl="https://example.com" />
 */
export function SiteMap(props: SiteMapProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { tree } = useSiteTree(props);
  const currentPath = useCurrentPath();

  const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);
  const handleClose  = useCallback(() => setIsOpen(false), []);

  // SSR ガード: window が存在しない環境（Next.js SSR 等）では何も描画しない
  if (typeof window === 'undefined') return null;

  return (
    <ShadowHost theme={props.theme}>
      <FloatingIcon isOpen={isOpen} onClick={handleToggle} />
      <PanelContainer
        isOpen={isOpen}
        tree={tree}
        currentPath={currentPath}
        baseUrl={props.baseUrl}
        onClose={handleClose}
      />
    </ShadowHost>
  );
}
