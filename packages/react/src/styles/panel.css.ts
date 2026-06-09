import type { ThemeOptions } from '@site-map/core';

/**
 * Shadow DOM 内に <style> タグとして注入する CSS テキストを生成する。
 * ホストサイトの CSS とは完全に隔離されるため、セレクタの衝突を心配する必要がない。
 * theme 変更時に再生成される。
 */
export function generateStyles(theme: ThemeOptions = {}): string {
  const {
    primaryColor = '#3b82f6',
    backgroundColor = '#ffffff',
    textColor = '#1f2937',
    fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  } = theme;

  return `
    :host {
      all: initial;
      font-family: ${fontFamily};
      color: ${textColor};
    }

    * { box-sizing: border-box; }

    /* ---- フローティングアイコン ---- */
    .floating-icon {
      position: fixed;
      bottom: 24px;
      left: 24px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: ${primaryColor};
      color: #fff;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.18);
      z-index: 2147483647;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .floating-icon:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(0,0,0,0.24);
    }
    .floating-icon:focus-visible {
      outline: 3px solid ${primaryColor};
      outline-offset: 3px;
    }

    /* ---- パネル外枠 ---- */
    .panel {
      position: fixed;
      bottom: 80px;
      left: 24px;
      width: 280px;
      max-height: 480px;
      background: ${backgroundColor};
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      z-index: 2147483646;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.16s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .panel-header {
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 600;
      color: ${textColor};
      border-bottom: 1px solid #e5e7eb;
      flex-shrink: 0;
    }

    .panel-body {
      overflow-y: auto;
      padding: 6px 0;
      flex: 1;
    }

    /* ---- ツリー ---- */
    .tree-root,
    .tree-children {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .tree-node { list-style: none; }

    .tree-node-row {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 5px 8px;
      border-radius: 6px;
      margin: 1px 6px;
      font-size: 13px;
      color: ${textColor};
      text-decoration: none;
      cursor: pointer;
      transition: background 0.1s;
      user-select: none;
    }
    .tree-node-row:hover { background: #f3f4f6; }
    .tree-node-row:focus-visible {
      outline: 2px solid ${primaryColor};
      outline-offset: -2px;
    }

    /* 現在ページのスタイル */
    .tree-node-row.current {
      background: #eff6ff;
      color: ${primaryColor};
      font-weight: 600;
    }
    .tree-node-row.current::before {
      content: '';
      display: block;
      width: 3px;
      height: 16px;
      background: ${primaryColor};
      border-radius: 2px;
      flex-shrink: 0;
    }

    .expand-btn {
      width: 14px;
      height: 14px;
      font-size: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #9ca3af;
      transition: transform 0.15s;
    }
    .expand-btn.expanded { transform: rotate(90deg); }

    .node-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;
}
