import { useRef, useState, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { ThemeOptions } from '@site-map/core';
import { generateStyles } from '../styles/panel.css.js';

interface Props {
  theme?: ThemeOptions;
  children: ReactNode;
}

/**
 * Shadow DOM を生成し、children をその中にレンダリングする。
 *
 * React の createPortal を使って Shadow Root 内に仮想 DOM を投影する。
 * attachShadow は一度だけ実行し、以降は同じ Shadow Root を再利用する。
 * theme が変わったときのみ <style> タグの内容を更新する。
 */
export function ShadowHost({ theme, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  // Shadow Root の生成は一度だけ（strict mode の二重 effect でも attachShadow は冪等）
  useEffect(() => {
    if (!hostRef.current) return;
    // すでに Shadow Root が付いている場合はスキップ
    if (hostRef.current.shadowRoot) {
      setShadowRoot(hostRef.current.shadowRoot);
      return;
    }

    const root = hostRef.current.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = generateStyles(theme);
    root.appendChild(style);
    setShadowRoot(root);
  // theme は別の effect で更新するため、初回のみ実行
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // theme 変更時のみスタイルを差し替える
  useEffect(() => {
    if (!shadowRoot) return;
    const style = shadowRoot.querySelector('style');
    if (style) style.textContent = generateStyles(theme);
  }, [theme, shadowRoot]);

  return (
    <div ref={hostRef} data-site-map-host="">
      {shadowRoot && createPortal(children, shadowRoot)}
    </div>
  );
}
