import React, { useState, useRef } from 'react';
import { RegistrationHeader } from '../RegistrationHeader';
import { apiService } from '../../../services/api';

interface Props {
  onNext: () => void;
  onBack?: () => void;
}

export const VerificationStep: React.FC<Props> = ({ onNext, onBack }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Validate file types
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const invalidFiles = fileArray.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError('Пожалуйста, загружайте только PDF или изображения (JPG, PNG)');
      return;
    }

    // Validate file sizes (max 10MB per file)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = fileArray.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setError('Размер файла не должен превышать 10MB');
      return;
    }

    setError(null);
    setSelectedFiles(prev => [...prev, ...fileArray]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setError('Необходимо загрузить хотя бы один документ');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await apiService.submitVerification(selectedFiles);
      setUploading(false);
      onNext();
    } catch (err) {
      setUploading(false);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки документов. Попробуйте снова.';
      setError(errorMessage);
    }
  };

  const handleSkip = () => {
    // Пропускаем верификацию и переходим дальше
    onNext();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
  };

  return (
    <div style={styles.container}>
      <RegistrationHeader onBack={onBack} />

      <div style={styles.content}>
        <h1 style={styles.title}>Подтверждение прав организации</h1>

        <div style={styles.subtitle}>
          Загрузите документы сейчас для быстрой верификации, или сделайте это позже в настройках профиля
        </div>

        <div style={styles.description}>
          Документы, подтверждающие ваши полномочия:
        </div>

        <ul style={styles.documentList}>
          <li>Приказ о назначении на должность</li>
          <li>Доверенность</li>
          <li>Выписка из ЕГРЮЛ</li>
          <li>Устав организации</li>
        </ul>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          onChange={handleFileSelect}
          style={styles.hiddenInput}
        />

        <button
          onClick={handleUploadClick}
          style={styles.uploadButton}
          disabled={uploading}
        >
          Выбрать файлы
        </button>

        {selectedFiles.length > 0 && (
          <div style={styles.fileList}>
            {selectedFiles.map((file, index) => (
              <div key={index} style={styles.fileItem}>
                <div style={styles.fileInfo}>
                  <div style={styles.fileName}>{file.name}</div>
                  <div style={styles.fileSize}>{formatFileSize(file.size)}</div>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  style={styles.removeButton}
                  disabled={uploading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
      </div>

      <div style={styles.footer}>
        <button
          onClick={handleSubmit}
          style={styles.primaryButton}
          disabled={uploading}
        >
          {uploading ? 'Загрузка...' : 'Загрузить документы'}
        </button>
        <button
          onClick={handleSkip}
          style={styles.secondaryButton}
          disabled={uploading}
        >
          Продолжить без верификации
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
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    paddingTop: 'calc(var(--header-height, 64px) + 20px)',
    paddingBottom: '100px',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#000',
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  description: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '12px',
  },
  documentList: {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.8',
    marginBottom: '24px',
    paddingLeft: '20px',
  },
  hiddenInput: {
    display: 'none',
  },
  uploadButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#667eea',
    background: '#fff',
    border: '2px dashed #667eea',
    borderRadius: '12px',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  fileList: {
    marginTop: '16px',
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    background: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#000',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileSize: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px',
  },
  removeButton: {
    marginLeft: '12px',
    width: '32px',
    height: '32px',
    fontSize: '18px',
    color: '#ff3b30',
    background: 'transparent',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    marginTop: '16px',
    padding: '12px',
    fontSize: '14px',
    color: '#ff3b30',
    background: '#ffebee',
    borderRadius: '8px',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px 20px',
    background: '#fff',
    borderTop: '1px solid #eee',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  primaryButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    background: '#000',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  secondaryButton: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#667eea',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};
