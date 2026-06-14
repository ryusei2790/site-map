/**
 * 現在の URL パス名を追跡する composable。
 * SPA（Vue Router / Nuxt 等）の pushState / replaceState にも対応するため
 * History API を monkey-patch する（onUnmounted で復元）。
 */
import { ref, onMounted, onUnmounted } from 'vue';

export function useCurrentPath() {
  const path = ref('/');

  function updatePath() {
    path.value = window.location.pathname;
  }

  let origPush: typeof history.pushState;
  let origReplace: typeof history.replaceState;

  onMounted(() => {
    path.value = window.location.pathname;

    window.addEventListener('popstate', updatePath);

    // SPA ルーターは popstate を発火しない場合があるため pushState / replaceState をラップする
    origPush = history.pushState.bind(history);
    origReplace = history.replaceState.bind(history);

    history.pushState = (...args) => {
      origPush(...args);
      updatePath();
    };
    history.replaceState = (...args) => {
      origReplace(...args);
      updatePath();
    };
  });

  onUnmounted(() => {
    window.removeEventListener('popstate', updatePath);
    // monkey-patch を元に戻す
    if (origPush) history.pushState = origPush;
    if (origReplace) history.replaceState = origReplace;
  });

  return { path };
}
