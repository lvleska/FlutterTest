import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../../../services/api';

interface Props {
  phone: string;
  code: string;
  onCodeChange: (code: string) => void;
  onNext: () => void;
  onBack: () => void;
  onUserExists?: (user: any, token: string) => void;
}

export const CodeStep: React.FC<Props> = ({ phone, code, onCodeChange, onNext, onBack, onUserExists }) => {
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [shake, setShake] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // No auto-focus behavior - let user control keyboard manually

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    // Auto-verify when 6 digits entered
    if (code.length === 6) {
      handleVerify();
    }
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    onCodeChange(value);
    setError('');
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }

    if (isBlocked) {
      return; // Don't allow verification if blocked
    }

    try {
      const response = await apiService.verifyCode(phone, code);

      if (response.exists && response.user && response.token) {
        // User already exists, log them in
        if (onUserExists) {
          onUserExists(response.user, response.token);
        }
      } else {
        // New user, continue registration
        onNext();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Код не подходит.';

      // Check if this is a blocking error
      if (errorMessage.includes('blocked') || errorMessage.includes('заблокирован')) {
        setIsBlocked(true);
      }

      setError(errorMessage);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      onCodeChange(''); // Clear code on error
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await apiService.sendSmsCode(phone);
      setTimer(59);
      setCanResend(false);
      setError('');
      setIsBlocked(false); // Reset block state on resend
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Ошибка отправки кода';
      setError(errorMessage);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={styles.container}>
      {/* Hidden input for numeric keyboard */}
      <input
        ref={inputRef}
        type="text"
        value={code}
        onChange={handleChange}
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
        }}
        inputMode="numeric"
        maxLength={6}
        autoFocus
      />

      <div style={styles.content}>
        <h1 style={styles.title}>Введите код из СМС</h1>

        <div style={styles.phoneText}>
          Отправили код на номер<br />
          <strong>{phone}</strong>
        </div>

        {/* Visual digit indicators */}
        <div
          style={{
            ...styles.digitContainer,
            ...(shake ? styles.shake : {}),
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              style={{
                ...styles.digitBox,
                borderBottomColor: error ? '#e74c3c' : (code[index] ? '#000' : '#e0e0e0'),
              }}
            >
              {code[index] || ''}
            </div>
          ))}
        </div>

        <div style={styles.errorContainer}>
          {error && (
            <div style={{
              ...styles.error,
              ...(isBlocked ? styles.errorBlocked : {}),
            }}>
              {error}
            </div>
          )}
        </div>

        <div style={styles.actionsContainer}>
          <button onClick={onBack} style={styles.changePhoneLink}>
            Изменить номер
          </button>

          <div style={styles.resendSection}>
            {canResend ? (
              <button onClick={handleResend} style={styles.resendButton}>
                Отправить код ещё раз
              </button>
            ) : (
              <div style={styles.timerText}>
                Отправить повторно через <strong>{formatTime(timer)}</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    maxHeight: 'calc(var(--vh, 1vh) * 100)',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    overflow: 'hidden',
    touchAction: 'none',
    transition: 'max-height 0.2s ease-out',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    minHeight: 0,
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#000',
    textAlign: 'center',
  },
  phoneText: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.5',
    textAlign: 'center',
    marginBottom: '40px',
  },
  digitContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  shake: {
    animation: 'shake 0.5s',
  } as React.CSSProperties,
  digitBox: {
    width: '40px',
    height: '50px',
    borderBottom: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: '600',
    transition: 'border-color 0.2s',
  },
  errorContainer: {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    textAlign: 'center',
    lineHeight: '1.4',
  },
  errorBlocked: {
    fontWeight: '600',
    backgroundColor: '#ffe6e6',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ffcccc',
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '20px',
    alignItems: 'center',
  },
  changePhoneLink: {
    background: 'none',
    border: 'none',
    color: '#007AFF',
    fontSize: '15px',
    cursor: 'pointer',
    padding: '6px',
  },
  resendSection: {
    textAlign: 'center',
  },
  resendButton: {
    background: 'none',
    border: 'none',
    color: '#007AFF',
    fontSize: '15px',
    cursor: 'pointer',
    padding: '6px',
  },
  timerText: {
    color: '#666',
    fontSize: '14px',
  },
};
