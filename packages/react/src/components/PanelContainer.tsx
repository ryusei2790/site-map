import type { TreeNode } from '@site-map/core';
import { TreeView } from './TreeView.js';
import { useEscapeClose } from '../hooks/useEscapeClose.js';

interface Props {
  isOpen: boolean;
  tree: TreeNode | null;
  currentPath: string;
  baseUrl: string;
  onClose: () => void;
}

/**
 * ツリーを表示するフローティングパネル。
 * isOpen が false のときは DOM に存在しない（アニメーションは CSS @keyframes で処理）。
 */
export function PanelContainer({ isOpen, tree, currentPath, baseUrl, onClose }: Props) {
  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      id="site-map-panel"
      className="panel"
      role="dialog"
      aria-label="サイトマップ"
      aria-modal="false"
    >
      <div className="panel-header">📍 サイトマップ</div>
      <div className="panel-body">
        {tree ? (
          <TreeView tree={tree} currentPath={currentPath} baseUrl={baseUrl} />
        ) : (
          <p style={{ padding: '16px', color: '#9ca3af', fontSize: '13px', margin: 0 }}>
            読み込み中...
          </p>
        )}
      </div>
    </div>
  );
}
