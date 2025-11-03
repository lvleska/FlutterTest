import React from 'react';

interface Props {
  onBack?: () => void;
}

export const RegistrationHeader: React.FC<Props> = ({ onBack }) => {
  if (!onBack) return null;

  return (
    <div style={styles.header}>
      <button onClick={onBack} style={styles.backButton}>
        ←
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--header-height, 64px)',
    background: '#fff',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    zIndex: 1000,
    boxSizing: 'border-box',
  },
  backButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
    color: '#000',
  },
};
