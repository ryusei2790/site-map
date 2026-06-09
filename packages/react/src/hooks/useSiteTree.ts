import { useState, useEffect, useRef } from 'react';
import { createSiteMap } from '@site-map/core';
import type { TreeNode, SiteMapConfig } from '@site-map/core';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseSiteTreeResult {
  tree: TreeNode | null;
  status: Status;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * @site-map/core の load() を React state に橋渡しするフック。
 * baseUrl が変わったときのみ再取得する。
 */
export function useSiteTree(config: SiteMapConfig): UseSiteTreeResult {
  const [tree, setTree]     = useState<TreeNode | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError]   = useState<Error | null>(null);

  // config オブジェクトの参照が毎レンダーで変わっても baseUrl が同じなら再取得しない
  const instanceRef = useRef(createSiteMap(config));

  useEffect(() => {
    instanceRef.current = createSiteMap(config);
    void load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.baseUrl]);

  async function load() {
    setStatus('loading');
    setError(null);
    try {
      const result = await instanceRef.current.load();
      setTree(result);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setStatus('error');
    }
  }

  async function refresh() {
    await instanceRef.current.refresh();
    await load();
  }

  return { tree, status, error, refresh };
}
