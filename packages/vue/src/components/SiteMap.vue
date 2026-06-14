<script setup lang="ts">
/**
 * site-map のメインコンポーネント（Vue 3 版）。
 * <teleport to="body"> でフローティング UI を body 直下に描画する。
 * SSR 環境では isClient が false のまま何も描画しない。
 */
import { ref, onMounted } from 'vue';
import type { SiteMapConfig } from '@site-map/core';
import { useSiteTree } from '../composables/useSiteTree.js';
import { useCurrentPath } from '../composables/useCurrentPath.js';
import { useEscapeClose } from '../composables/useEscapeClose.js';
import TreeNodeItem from './TreeNodeItem.vue';

const props = defineProps<{
  config: SiteMapConfig;
}>();

// SSR ガード：onMounted はブラウザでのみ実行される
const isClient = ref(false);
onMounted(() => { isClient.value = true; });

const isOpen = ref(false);
const toggle = () => { isOpen.value = !isOpen.value; };
const close = () => { isOpen.value = false; };

const { tree, loading } = useSiteTree(props.config);
const { path: currentPath } = useCurrentPath();
useEscapeClose(isOpen, close);

const primaryColor = props.config.theme?.primaryColor ?? '#3b82f6';
const backgroundColor = props.config.theme?.backgroundColor ?? '#ffffff';
const textColor = props.config.theme?.textColor ?? '#1f2937';
const fontFamily = props.config.theme?.fontFamily ?? 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
</script>

<template>
  <teleport v-if="isClient" to="body">
    <div class="sm-root" :style="{ fontFamily, color: textColor }">
      <!-- フローティングアイコンボタン -->
      <button
        class="sm-icon"
        :style="{ background: primaryColor }"
        :aria-expanded="isOpen"
        aria-controls="sm-panel"
        aria-label="サイトマップを開く"
        @click="toggle"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      </button>

      <!-- パネル -->
      <transition name="sm-slide">
        <div
          v-if="isOpen"
          id="sm-panel"
          class="sm-panel"
          :style="{ background: backgroundColor }"
          role="dialog"
          aria-modal="false"
          aria-label="サイトマップ"
        >
          <div class="sm-header" :style="{ color: textColor }">
            <span>Site Map</span>
            <button class="sm-close" :style="{ color: textColor }" @click="close" aria-label="閉じる">✕</button>
          </div>

          <div class="sm-body">
            <p v-if="loading" class="sm-loading">読み込み中…</p>
            <ul v-else-if="tree" class="sm-tree" role="tree">
              <TreeNodeItem
                :node="tree"
                :current-path="currentPath"
                :depth="0"
              />
            </ul>
            <p v-else class="sm-empty">ページが見つかりませんでした</p>
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<style scoped>
/* scoped で data-v-xxx 属性が付くため他の要素と衝突しない */
.sm-root {
  all: initial;
  font-family: inherit;
  color: inherit;
}

.sm-icon {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  z-index: 2147483647;
  transition: transform 0.15s, box-shadow 0.15s;
}
.sm-icon:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.24);
}
.sm-icon:focus-visible {
  outline: 3px solid currentColor;
  outline-offset: 3px;
}

.sm-panel {
  position: fixed;
  bottom: 80px;
  left: 24px;
  width: 280px;
  max-height: 480px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 2147483646;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.sm-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
  border-radius: 4px;
  line-height: 1;
}
.sm-close:hover { background: #f3f4f6; }

.sm-body {
  overflow-y: auto;
  padding: 6px 0;
  flex: 1;
}

.sm-loading,
.sm-empty {
  font-size: 13px;
  color: #9ca3af;
  padding: 12px 16px;
  margin: 0;
}

/* ---- ツリー（non-scoped と衝突しないよう sm- プレフィックス統一） ---- */
.sm-tree,
:deep(.sm-tree-children) {
  list-style: none;
  margin: 0;
  padding: 0;
}

:deep(.sm-tree-node) { list-style: none; }

:deep(.sm-tree-row) {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border-radius: 6px;
  margin: 1px 6px;
  font-size: 13px;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.1s;
  user-select: none;
}
:deep(.sm-tree-row:hover) { background: #f3f4f6; }
:deep(.sm-tree-row:focus-visible) {
  outline: 2px solid currentColor;
  outline-offset: -2px;
}

:deep(.sm-tree-row.current) {
  background: #eff6ff;
  color: v-bind(primaryColor);
  font-weight: 600;
}
:deep(.sm-tree-row.current::before) {
  content: '';
  display: block;
  width: 3px;
  height: 16px;
  background: v-bind(primaryColor);
  border-radius: 2px;
  flex-shrink: 0;
}

:deep(.sm-expand-btn) {
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
:deep(.sm-expand-btn.expanded) { transform: rotate(90deg); }

:deep(.sm-node-title) {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---- パネルのスライドアニメーション ---- */
.sm-slide-enter-active,
.sm-slide-leave-active {
  transition: opacity 0.16s ease-out, transform 0.16s ease-out;
}
.sm-slide-enter-from,
.sm-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
