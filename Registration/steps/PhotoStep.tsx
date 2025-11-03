import React, { useRef, useState } from 'react';
import { RegistrationHeader } from '../RegistrationHeader';

interface Props {
  photo: File | null;
  onPhotoChange: (photo: File | null) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const PhotoStep: React.FC<Props> = ({ photo, onPhotoChange, onNext, onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5 МБ');
      return;
    }

    setError('');
    onPhotoChange(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onPhotoChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    // Photo is optional, just proceed
    onNext();
  };

  return (
    <div style={styles.container}>
      <RegistrationHeader onBack={onBack} />

      <div style={styles.content}>
        <div style={styles.photoContainer}>
          {preview ? (
            <div style={styles.previewContainer}>
              <img src={preview} alt="Preview" style={styles.previewImage} />
              <button onClick={handleRemovePhoto} style={styles.removeButton}>
                ✕
              </button>
            </div>
          ) : (
            <div style={styles.placeholderContainer}>
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                style={styles.placeholderIcon}
              >
                <circle cx="60" cy="40" r="20" fill="#ccc" />
                <path
                  d="M20 100 C20 70, 40 60, 60 60 C80 60, 100 70, 100 100 Z"
                  fill="#ccc"
                />
              </svg>
            </div>
          )}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          style={styles.uploadButton}
        >
          {photo ? 'Изменить фото' : 'Прикрепить фото'}
        </button>

        <button
          onClick={handleSubmit}
          style={styles.submitButton}
        >
          {photo ? 'Далее' : 'Пропустить'}
        </button>
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
    alignItems: 'center',
    padding: '20px',
    paddingTop: 'calc(var(--header-height, 64px) + 20px)',
    boxSizing: 'border-box',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    minHeight: 0,
  },
  photoContainer: {
    marginBottom: '20px',
  },
  placeholderContainer: {
    width: '200px',
    height: '200px',
    borderRadius: '20px',
    border: '3px dashed #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fafafa',
  },
  placeholderIcon: {
    opacity: 0.5,
  },
  previewContainer: {
    position: 'relative',
    width: '200px',
    height: '200px',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '20px',
  },
  removeButton: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    marginTop: '10px',
    textAlign: 'center',
  },
  uploadButton: {
    background: 'none',
    color: '#667eea',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '12px',
    marginBottom: '16px',
  },
  submitButton: {
    background: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '300px',
    transition: 'opacity 0.2s',
    flexShrink: 0,
  },
  submitButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
};
