import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../../../services/api';

interface Props {
  phone: string;
  onPhoneChange: (phone: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PhoneStep: React.FC<Props> = ({ phone, onPhoneChange, onNext, onBack }) => {
  const [error, setError] = useState('');
  const [rawDigits, setRawDigits] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const formatPhoneDisplay = (digits: string) => {
    // Format: XXX XXX XX XX
    let formatted = digits.substring(0, 3);
    if (digits.length >= 3) {
      formatted += ' ' + digits.substring(3, 6);
    }
    if (digits.length >= 6) {
      formatted += ' ' + digits.substring(6, 8);
    }
    if (digits.length >= 8) {
      formatted += ' ' + digits.substring(8, 10);
    }
    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Extract only digits
    const digits = input.replace(/\D/g, '').substring(0, 10);

    setRawDigits(digits);

    // Store full phone with +7 and digits without formatting
    const fullPhone = digits ? `+7${digits}` : '+7';
    onPhoneChange(fullPhone);
    setError('');

    // Auto-submit when complete
    if (digits.length === 10) {
      setTimeout(() => handleSubmit(digits), 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      if (rawDigits.length > 0) {
        const newDigits = rawDigits.slice(0, -1);
        setRawDigits(newDigits);
        const fullPhone = newDigits ? `+7${newDigits}` : '+7';
        onPhoneChange(fullPhone);
        setError('');
      }
    }
  };

  const handleSubmit = async (digits?: string) => {
    const phoneDigits = digits || rawDigits;

    if (phoneDigits.length !== 10) {
      setError('Введите корректный номер телефона');
      return;
    }

    try {
      const fullPhone = `+7${phoneDigits}`;
      await apiService.sendSmsCode(fullPhone);
      onNext();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка отправки кода');
    }
  };

  const isValid = rawDigits.length === 10;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.header}>Вход или регистрация</h1>

        <div style={styles.subtitle}>
          Укажите ваш номер телефона
        </div>

        <div style={styles.inputWrapper}>
          <label style={styles.label}>Телефон</label>
          <div style={styles.phoneInputContainer}>
            <span style={styles.flag}>🇷🇺</span>
            <span style={styles.prefix}>+7</span>
            <input
              ref={inputRef}
              type="tel"
              value={formatPhoneDisplay(rawDigits)}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder=""
              style={styles.phoneInput}
              inputMode="numeric"
            />
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.infoText}>
          Работает для всех операторов связи
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
  header: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '40px',
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: '#999',
    marginBottom: '8px',
    paddingLeft: '4px',
  },
  phoneInputContainer: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: '#fff',
  },
  flag: {
    fontSize: '20px',
    marginRight: '8px',
  },
  prefix: {
    fontSize: '18px',
    fontWeight: '400',
    marginRight: '4px',
    color: '#000',
  },
  phoneInput: {
    background: 'transparent',
    border: '0',
    fontSize: '18px',
    outline: '0',
    color: '#000',
    flex: 1,
    boxShadow: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    caretColor: '#333',
  } as React.CSSProperties,
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    marginTop: '10px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  infoText: {
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
    marginTop: '20px',
  },
};
