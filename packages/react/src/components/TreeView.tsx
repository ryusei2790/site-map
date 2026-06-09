import type { TreeNode } from '@site-map/core';
import { TreeNodeItem } from './TreeNodeItem.js';

interface Props {
  tree: TreeNode;
  currentPath: string;
  baseUrl: string;
}

/** ルートの直下の子ノードを一覧表示する。ルート自身（ "/"）は表示しない。 */
export function TreeView({ tree, currentPath, baseUrl }: Props) {
  return (
    <ul className="tree-root" role="tree" aria-label="サイトマップ">
      {tree.children.map(node => (
        <TreeNodeItem
          key={node.id}
          node={node}
          currentPath={currentPath}
          baseUrl={baseUrl}
        />
      ))}
    </ul>
  );
}
