import { useState, useCallback } from 'react';
import type { TreeNode } from '@site-map/core';

interface Props {
  node: TreeNode;
  currentPath: string;
  baseUrl: string;
  depth?: number;
}

/**
 * ツリーの1ノード。子があれば折り畳み可能。
 * 現在ページは背景ハイライト + 左ボーダーで強調する。
 * 現在ページの祖先ノードは初期状態で自動展開する。
 */
export function TreeNodeItem({ node, currentPath, baseUrl, depth = 0 }: Props) {
  const isCurrent = matchesPath(node.url, currentPath);
  const hasChildren = node.children.length > 0;

  // 現在ページまたは現在ページの祖先なら展開済みにする
  const [isExpanded, setIsExpanded] = useState(() =>
    isCurrent || hasDescendantMatchingPath(node, currentPath)
  );

  const handleToggle = useCallback((e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(prev => !prev);
    }
  }, [hasChildren]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        if (hasChildren && !isExpanded) {
          e.preventDefault();
          setIsExpanded(true);
        }
        break;
      case 'ArrowLeft':
        if (isExpanded) {
          e.preventDefault();
          setIsExpanded(false);
        }
        break;
    }
  }, [hasChildren, isExpanded]);

  return (
    <li
      className="tree-node"
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
    >
      <a
        className={`tree-node-row${isCurrent ? ' current' : ''}`}
        href={node.url}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-current={isCurrent ? 'page' : undefined}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        {hasChildren && (
          <span
            className={`expand-btn${isExpanded ? ' expanded' : ''}`}
            aria-hidden="true"
          >
            ▶
          </span>
        )}
        <span className="node-title">
          {node.title ?? node.pathSegment}
        </span>
      </a>

      {hasChildren && isExpanded && (
        <ul className="tree-children" role="group">
          {node.children.map(child => (
            <TreeNodeItem
              key={child.id}
              node={child}
              currentPath={currentPath}
              baseUrl={baseUrl}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/** URL のパス名が currentPath と一致するか判定 */
function matchesPath(url: string, currentPath: string): boolean {
  try {
    const pathname = new URL(url).pathname.replace(/\/$/, '') || '/';
    const current  = currentPath.replace(/\/$/, '') || '/';
    return pathname === current;
  } catch {
    return false;
  }
}

/** 子孫に currentPath に一致するノードがあるか再帰検索 */
function hasDescendantMatchingPath(node: TreeNode, currentPath: string): boolean {
  for (const child of node.children) {
    if (matchesPath(child.url, currentPath)) return true;
    if (hasDescendantMatchingPath(child, currentPath)) return true;
  }
  return false;
}
