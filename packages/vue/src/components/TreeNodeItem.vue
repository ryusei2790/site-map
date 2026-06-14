<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TreeNode } from '@site-map/core';
// Vue 3 では同名ファイルを import すると再帰コンポーネントとして機能する
import TreeNodeItem from './TreeNodeItem.vue';

const props = defineProps<{
  node: TreeNode;
  currentPath: string;
  depth: number;
}>();

const isCurrent = computed(() => matchesPath(props.node.url, props.currentPath));
const hasChildren = computed(() => props.node.children.length > 0);

// 現在ページまたは現在ページの祖先なら最初から展開する
const isExpanded = ref(
  isCurrent.value || hasDescendantMatchingPath(props.node, props.currentPath)
);

function toggle(e: MouseEvent) {
  if (hasChildren.value) {
    e.preventDefault();
    isExpanded.value = !isExpanded.value;
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' && hasChildren.value && !isExpanded.value) {
    e.preventDefault();
    isExpanded.value = true;
  } else if (e.key === 'ArrowLeft' && isExpanded.value) {
    e.preventDefault();
    isExpanded.value = false;
  }
}

function matchesPath(url: string, currentPath: string): boolean {
  try {
    const pathname = new URL(url).pathname.replace(/\/$/, '') || '/';
    const current = currentPath.replace(/\/$/, '') || '/';
    return pathname === current;
  } catch {
    return false;
  }
}

function hasDescendantMatchingPath(node: TreeNode, currentPath: string): boolean {
  for (const child of node.children) {
    if (matchesPath(child.url, currentPath)) return true;
    if (hasDescendantMatchingPath(child, currentPath)) return true;
  }
  return false;
}
</script>

<template>
  <li
    class="sm-tree-node"
    role="treeitem"
    :aria-expanded="hasChildren ? isExpanded : undefined"
  >
    <a
      :href="node.url"
      class="sm-tree-row"
      :class="{ current: isCurrent }"
      :style="{ paddingLeft: `${8 + depth * 14}px` }"
      :aria-current="isCurrent ? 'page' : undefined"
      tabindex="0"
      @click="toggle"
      @keydown="onKeyDown"
    >
      <span
        v-if="hasChildren"
        class="sm-expand-btn"
        :class="{ expanded: isExpanded }"
        aria-hidden="true"
      >▶</span>
      <span class="sm-node-title">{{ node.title ?? node.pathSegment }}</span>
    </a>

    <ul v-if="hasChildren && isExpanded" class="sm-tree-children" role="group">
      <TreeNodeItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :current-path="currentPath"
        :depth="depth + 1"
      />
    </ul>
  </li>
</template>
