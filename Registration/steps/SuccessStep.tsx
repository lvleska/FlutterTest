import React, { useEffect } from 'react';

interface Props {
  onComplete: () => void;
}

export const SuccessStep: React.FC<Props> = ({ onComplete }) => {
  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.iconContainer}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="40" fill="#4CAF50" />
            <path
              d="M25 40 L35 50 L55 30"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 style={styles.title}>Регистрация завершена!</h1>

        <p style={styles.subtitle}>
          Добро пожаловать! Сейчас вы будете перенаправлены в приложение.
        </p>

        <button onClick={onComplete} style={styles.button}>
          Завершить регистрацию
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '400px',
  },
  iconContainer: {
    marginBottom: '30px',
    animation: 'scaleIn 0.5s ease-out',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '40px',
    textAlign: 'center',
  },
  button: {
    background: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '18px 40px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
};
