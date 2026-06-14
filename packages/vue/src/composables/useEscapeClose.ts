/**
 * パネルが開いている間だけ Escape キーで閉じるリスナーを登録する composable。
 */
import { watch, onUnmounted, type Ref } from 'vue';

export function useEscapeClose(isOpen: Ref<boolean>, close: () => void) {
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  const stopWatch = watch(isOpen, (open) => {
    if (open) {
      document.addEventListener('keydown', onKeyDown);
    } else {
      document.removeEventListener('keydown', onKeyDown);
    }
  });

  onUnmounted(() => {
    stopWatch();
    document.removeEventListener('keydown', onKeyDown);
  });
}
