import { useState, useEffect } from 'react';

/**
 * 現在の URL パス名を追跡する。
 * SPA（React Router / Next.js 等）の pushState / replaceState にも対応するため
 * History API を monkey-patch する（オプトイン、コンポーネントアンマウント時に復元）。
 */
export function useCurrentPath(): string {
  const [path, setPath] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handlePop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePop);

    // SPA のルーター（React Router / Next.js Router 等）は popstate を発火しない場合がある。
    // pushState / replaceState を一時的にラップして変更を検知する。
    const origPush    = history.pushState.bind(history);
    const origReplace = history.replaceState.bind(history);

    history.pushState = (...args) => {
      origPush(...args);
      setPath(window.location.pathname);
    };
    history.replaceState = (...args) => {
      origReplace(...args);
      setPath(window.location.pathname);
    };

    return () => {
      window.removeEventListener('popstate', handlePop);
      history.pushState    = origPush;
      history.replaceState = origReplace;
    };
  }, []);

  return path;
}
