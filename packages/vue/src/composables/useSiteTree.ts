/**
 * サイトツリーを取得する composable。
 * config.baseUrl が変化したときだけ再フェッチする。
 * Vue props は reactive なので watch source に () => config.baseUrl を使う。
 */
import { ref, watch } from 'vue';
import { createSiteMap } from '@site-map/core';
import type { SiteMapConfig, TreeNode } from '@site-map/core';

export function useSiteTree(config: SiteMapConfig) {
  const tree = ref<TreeNode | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  async function fetchTree() {
    if (!config.baseUrl) return;

    loading.value = true;
    error.value = null;

    try {
      const siteMap = createSiteMap(config);
      tree.value = await siteMap.load();
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
    } finally {
      loading.value = false;
    }
  }

  // baseUrl の変化だけを監視。config オブジェクト参照の変化では再フェッチしない。
  watch(() => config.baseUrl, fetchTree, { immediate: true });

  return { tree, loading, error };
}
