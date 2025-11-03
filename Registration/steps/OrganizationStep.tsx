import React, { useState, useEffect, useRef } from 'react';
import { RegistrationHeader } from '../RegistrationHeader';

interface OrganizationResult {
  inn: string;
  name: string;
  shortName?: string;
  kpp?: string;
  ogrn?: string;
  address?: string;
  phone?: string;
  email?: string;
  management?: {
    name?: string;
    post?: string;
  };
}

interface Props {
  selectedOrganization: OrganizationResult | null;
  onOrganizationSelect: (org: OrganizationResult | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export const OrganizationStep: React.FC<Props> = ({
  selectedOrganization,
  onOrganizationSelect,
  onNext,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<OrganizationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Removed cleanup to preserve organization data when moving to next step

  // Removed auto-focus - user should click to activate input
  // useEffect(() => {
  //   if (isFreelancer === false && inputRef.current) {
  //     setTimeout(() => inputRef.current?.focus(), 300);
  //   }
  // }, [isFreelancer]);

  // Auto-search with debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchError('');
      return;
    }

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for auto-search after 1 second
    debounceTimerRef.current = setTimeout(() => {
      handleSearch();
    }, 1000);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://localhost:3004/api';
      const response = await fetch(`${apiUrl}/organizations/search-dadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Ошибка поиска организации');
      }

      const data: { results?: OrganizationResult[] } = await response.json();

      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
        // Скрываем клавиатуру после получения результатов
        if (inputRef.current) {
          inputRef.current.blur();
        }
      } else {
        setSearchError('Организация не найдена');
        setSearchResults([]);
        // Скрываем клавиатуру при отсутствии результатов
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    } catch (error) {
      setSearchError('Ошибка поиска. Попробуйте позже.');
      setSearchResults([]);
      // Скрываем клавиатуру при ошибке
      if (inputRef.current) {
        inputRef.current.blur();
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleOrganizationSelect = (org: OrganizationResult) => {
    onOrganizationSelect(org);
    setSearchResults([]);
  };

  const handleSubmit = async () => {
    if (!selectedOrganization) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    // Просто переходим к следующему шагу
    // Организация будет сохранена на последнем шаге вместе с регистрацией пользователя
    onNext();
  };

  return (
    <div style={styles.container}>
      <RegistrationHeader onBack={onBack} />

      <div style={styles.content}>
        <h1 style={styles.pageTitle}>Найдите вашу организацию</h1>
        <p style={styles.searchSubtitle}>
          Мы поможем найти вашу организацию по ИНН или названию
        </p>

        <div style={styles.searchContainer}>
          <div style={styles.searchInputWrapper}>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ИНН или название организации"
              style={styles.searchInput}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {isSearching && (
              <div style={styles.spinner}>
                <svg style={styles.spinnerIcon} viewBox="0 0 24 24">
                  <circle style={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {(searchError || searchResults.length > 0) && (
          <div style={styles.resultsList}>
      {searchError ? (
        <div style={styles.noResultItem}>
          <svg style={styles.noResultIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={styles.noResultText}>{searchError}</div>
        </div>
      ) : (
        searchResults.map((org, index) => (
          <div
            key={index}
            onClick={() => handleOrganizationSelect(org)}
            style={styles.resultItem}
          >
            <div style={styles.resultInn}>
              ИНН: {org.inn}
              {org.kpp && (
                <span style={styles.resultKpp}> • КПП: {org.kpp}</span>
              )}
            </div>
            <div style={styles.resultName}>{org.name}</div>
            {org.address && (
              <div style={styles.resultAddress}>{org.address}</div>
            )}
          </div>
        ))
      )}
          </div>
        )}

        {selectedOrganization && (
        <div
          style={{
            ...styles.selectedOrg,
            ...(shake && !selectedOrganization ? styles.shake : {}),
          }}
        >
          <div style={styles.selectedOrgTitle}>Выбранная организация:</div>
          <div style={styles.selectedOrgInn}>
            ИНН: {selectedOrganization.inn}
            {selectedOrganization.kpp && (
              <span style={styles.selectedOrgKpp}> • КПП: {selectedOrganization.kpp}</span>
            )}
          </div>
          <div style={styles.selectedOrgName}>{selectedOrganization.name}</div>
          {selectedOrganization.address && (
            <div style={styles.selectedOrgAddress}>{selectedOrganization.address}</div>
          )}
          {selectedOrganization.phone && (
            <div style={styles.selectedOrgContact}>Телефон: {selectedOrganization.phone}</div>
          )}
          {selectedOrganization.email && (
            <div style={styles.selectedOrgContact}>Почта: {selectedOrganization.email}</div>
          )}
        </div>
      )}
      </div>

      <div style={styles.footer}>
        <button
          onClick={handleSubmit}
          disabled={!selectedOrganization}
          style={{
            ...styles.submitButton,
            ...(selectedOrganization ? {} : styles.submitButtonDisabled),
          }}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    minHeight: '100dvh', // Растягиваем на всю высоту экрана
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    boxSizing: 'border-box',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '20px',
    paddingTop: 'calc(var(--header-height, 64px) + 20px)', // Отступ для хедера
    paddingBottom: 'calc(80px + 20px)', // Отступ для футера
    boxSizing: 'border-box',
    overflowY: 'auto', // Прокрутка только контента
    WebkitOverflowScrolling: 'touch',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#000',
    textAlign: 'left',
  },
  searchSubtitle: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '32px',
    textAlign: 'left',
  },
  searchContainer: {
    marginBottom: '16px',
  },
  searchInputWrapper: {
    position: 'relative',
    width: '100%',
  },
  searchInput: {
    width: '100%',
    padding: '16px',
    paddingRight: '40px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fff',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    boxShadow: 'none',
    WebkitBoxShadow: 'none',
    MozBoxShadow: 'none',
    WebkitTapHighlightColor: 'transparent',
  } as React.CSSProperties,
  spinner: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
  },
  spinnerIcon: {
    width: '100%',
    height: '100%',
    animation: 'spin 1s linear infinite',
    color: '#666',
  } as React.CSSProperties,
  spinnerCircle: {
    strokeDasharray: '50, 150',
    strokeDashoffset: '0',
  } as React.CSSProperties,
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    marginTop: '8px',
    marginBottom: '12px',
  },
  resultsList: {
    marginTop: '16px',
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid #ddd',
    borderRadius: '12px',
    background: '#fff',
  },
  resultItem: {
    padding: '16px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  resultInn: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '6px',
  },
  resultKpp: {
    marginLeft: '4px',
  },
  resultName: {
    fontSize: '15px',
    color: '#000',
    fontWeight: '500',
    lineHeight: '1.4',
  },
  resultAddress: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '4px',
    lineHeight: '1.4',
  },
  noResultItem: {
    padding: '32px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  noResultIcon: {
    width: '48px',
    height: '48px',
    color: '#ccc',
    marginBottom: '12px',
  },
  noResultText: {
    fontSize: '15px',
    color: '#999',
    lineHeight: '1.4',
  },
  selectedOrg: {
    marginTop: '16px',
    padding: '16px',
    background: '#f9f9f9',
    borderRadius: '8px',
  },
  selectedOrgTitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  selectedOrgInn: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px',
  },
  selectedOrgKpp: {
    marginLeft: '4px',
  },
  selectedOrgName: {
    fontSize: '16px',
    color: '#000',
    fontWeight: '600',
  },
  selectedOrgAddress: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '6px',
    lineHeight: '1.4',
  },
  selectedOrgContact: {
    fontSize: '13px',
    color: '#374151',
    marginTop: '4px',
  },
  selectedOrgMeta: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '2px',
  },
  shake: {
    animation: 'shake 0.5s',
  } as React.CSSProperties,
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px',
    background: '#fff',
    borderTop: '1px solid #f0f0f0',
    boxSizing: 'border-box',
    zIndex: 1000,
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
    transition: 'opacity 0.2s',
    width: '100%',
  },
  submitButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
};
