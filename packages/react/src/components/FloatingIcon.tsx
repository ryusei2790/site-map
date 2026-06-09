interface Props {
  isOpen: boolean;
  onClick: () => void;
}

/** 画面左下に固定表示されるフローティングアイコンボタン。 */
export function FloatingIcon({ isOpen, onClick }: Props) {
  return (
    <button
      className="floating-icon"
      onClick={onClick}
      aria-label={isOpen ? 'サイトマップを閉じる' : 'サイトマップを開く'}
      aria-expanded={isOpen}
      aria-controls="site-map-panel"
    >
      {/* サイトマップを表す格子状アイコン */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <path d="M14 17h7M17.5 14v7" />
      </svg>
    </button>
  );
}
