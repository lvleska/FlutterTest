import React, { useState } from 'react';
import { RegistrationHeader } from '../RegistrationHeader';

interface Role {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
  requiresOrg: boolean;
}

interface Props {
  selectedRole: string | null;
  organizationType: string;
  onRoleSelect: (roleId: string) => void;
  onOrganizationTypeChange: (type: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const availableRoles: Role[] = [
  {
    id: 'executor',
    title: 'Исполнитель',
    subtitle: 'Я хочу выполнять задания',
    description: 'Находите заказы, выполняйте работу и получайте оплату',
    color: 'blue',
    requiresOrg: false
  },
  {
    id: 'contractor',
    title: 'Подрядчик',
    subtitle: 'Я управляю проектами и командами',
    description: 'Берите заказы, формируйте команды, управляйте исполнением',
    color: 'purple',
    requiresOrg: true
  },
  {
    id: 'exhibitor',
    title: 'Экспонент',
    subtitle: 'Я участвую в выставках',
    description: 'Участвуйте в мероприятиях, находите подрядчиков для стендов',
    color: 'green',
    requiresOrg: true
  },
  {
    id: 'organizer',
    title: 'Организатор',
    subtitle: 'Я организую мероприятия',
    description: 'Создавайте выставки, модерируйте заявки, управляйте событиями',
    color: 'orange',
    requiresOrg: true
  }
];

export const RoleStep: React.FC<Props> = ({
  selectedRole,
  organizationType,
  onRoleSelect,
  onOrganizationTypeChange,
  onNext,
  onBack,
}) => {
  const [shake, setShake] = useState(false);

  const getColorClasses = (color: 'blue' | 'purple' | 'green' | 'orange') => {
    const colors = {
      blue: {
        bg: '#EFF6FF',
        text: '#2563EB',
        border: '#BFDBFE',
        gradientFrom: '#3B82F6',
        gradientTo: '#2563EB'
      },
      purple: {
        bg: '#F5F3FF',
        text: '#7C3AED',
        border: '#DDD6FE',
        gradientFrom: '#8B5CF6',
        gradientTo: '#7C3AED'
      },
      green: {
        bg: '#F0FDF4',
        text: '#16A34A',
        border: '#BBF7D0',
        gradientFrom: '#10B981',
        gradientTo: '#059669'
      },
      orange: {
        bg: '#FFF7ED',
        text: '#EA580C',
        border: '#FED7AA',
        gradientFrom: '#F97316',
        gradientTo: '#EA580C'
      }
    };
    return colors[color];
  };

  const handleRoleSelect = (roleId: string) => {
    onRoleSelect(roleId);
    // Автоматически устанавливаем тип организации на основе выбранной роли
    // Для исполнителя (executor) тип организации не нужен
    if (roleId === 'executor') {
      onOrganizationTypeChange('');
    } else {
      onOrganizationTypeChange(roleId);
    }
  };

  const handleSubmit = () => {
    if (!selectedRole) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    onNext();
  };

  return (
    <div style={styles.container}>
      <RegistrationHeader onBack={onBack} />

      <div style={styles.content}>
        <h1 style={styles.pageTitle}>Как вы планируете работать?</h1>
        <p style={styles.subtitle}>
          Выберите роль для начала работы. Вы сможете добавить еще позже.
        </p>

        <div style={styles.rolesContainer}>
          {availableRoles.map(role => {
            const isSelected = selectedRole === role.id;
            const colors = getColorClasses(role.color);

            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                style={{
                  ...styles.roleCard,
                  borderColor: isSelected ? colors.border : '#e5e7eb',
                  ...(isSelected ? styles.roleCardActive : {}),
                  ...(shake && !selectedRole ? styles.shake : {}),
                }}
              >
                <div
                  style={{
                    ...styles.roleIconContainer,
                    backgroundColor: colors.bg,
                  }}
                >
                  {/* SVG Icons */}
                  {role.id === 'executor' && (
                    <svg style={{ ...styles.roleIcon, color: colors.text }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  {role.id === 'contractor' && (
                    <svg style={{ ...styles.roleIcon, color: colors.text }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  {role.id === 'exhibitor' && (
                    <svg style={{ ...styles.roleIcon, color: colors.text }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {role.id === 'organizer' && (
                    <svg style={{ ...styles.roleIcon, color: colors.text }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>

                <div style={styles.roleTextContent}>
                  <h3 style={styles.roleTitle}>{role.title}</h3>
                  <p style={styles.roleSubtitle}>{role.subtitle}</p>
                  <p style={styles.roleDescription}>{role.description}</p>

                  {role.requiresOrg && (
                    <div style={styles.requiresOrgBadge}>
                      <svg style={styles.requiresOrgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Требуется организация</span>
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div
                    style={{
                      ...styles.checkmark,
                      background: `linear-gradient(135deg, ${colors.gradientFrom} 0%, ${colors.gradientTo} 100%)`,
                    }}
                  >
                    <svg style={styles.checkmarkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={styles.footer}>
        <button
          onClick={handleSubmit}
          disabled={!selectedRole}
          style={{
            ...styles.submitButton,
            ...(selectedRole ? {} : styles.submitButtonDisabled),
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
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    paddingTop: 'calc(var(--header-height, 64px) + 20px)',
    paddingBottom: '100px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    height: 'calc(100dvh - var(--header-height, 64px))',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#000',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '24px',
    textAlign: 'left',
  },
  rolesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  roleCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    paddingRight: '48px',
    border: '2px solid #e5e7eb',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#fff',
    textAlign: 'left',
    position: 'relative',
    width: '100%',
  },
  roleCardActive: {
    background: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  roleIconContainer: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleIcon: {
    width: '28px',
    height: '28px',
  },
  roleTextContent: {
    flex: 1,
    minWidth: 0,
  },
  roleTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#000',
    marginBottom: '4px',
  },
  roleSubtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  roleDescription: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '8px',
  },
  requiresOrgBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#999',
  },
  requiresOrgIcon: {
    width: '14px',
    height: '14px',
  },
  checkmark: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkmarkIcon: {
    width: '14px',
    height: '14px',
    color: '#fff',
    strokeWidth: 3,
  },
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
  shake: {
    animation: 'shake 0.5s',
  } as React.CSSProperties,
};
