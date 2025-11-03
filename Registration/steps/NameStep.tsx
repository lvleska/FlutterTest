import React, { useState } from 'react';
import { BottomSheet } from '../../BottomSheet';
import { apiService, User } from '../../../services/api';

interface Props {
  lastName: string;
  firstName: string;
  middleName: string;
  agreedToTerms: boolean;
  agreedToPersonalData: boolean;
  phone: string;
  onLastNameChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onMiddleNameChange: (value: string) => void;
  onAgreedChange: (value: boolean) => void;
  onAgreedPersonalDataChange: (value: boolean) => void;
  onNext: (user: User) => void;
  onBack: () => void;
}

export const NameStep: React.FC<Props> = ({
  lastName,
  firstName,
  middleName,
  agreedToTerms,
  agreedToPersonalData,
  phone,
  onLastNameChange,
  onFirstNameChange,
  onMiddleNameChange,
  onAgreedChange,
  onAgreedPersonalDataChange,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sheetContent, setSheetContent] = useState<{ title: string; content: string } | null>(null);
  const [shakeTerms, setShakeTerms] = useState(false);
  const [shakePersonalData, setShakePersonalData] = useState(false);
  const [focusedField, setFocusedField] = useState<'lastName' | 'firstName' | 'middleName' | null>(null);

  // Clear autocomplete data on mount
  React.useEffect(() => {
    if (!lastName && !firstName && !middleName) {
      onLastNameChange('');
      onFirstNameChange('');
      onMiddleNameChange('');
    }
  }, []);

  const validateName = (value: string, field: string, optional = false) => {
    if (!value.trim() && !optional) {
      return `${field} обязательно для заполнения`;
    }
    if (value.trim() && !/^[а-яА-ЯёЁ\s-]+$/.test(value)) {
      return 'Используйте только русские буквы';
    }
    return '';
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onLastNameChange(value);
    if (errors.lastName) {
      const error = validateName(value, 'Фамилия');
      setErrors(prev => ({ ...prev, lastName: error }));
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFirstNameChange(value);
    if (errors.firstName) {
      const error = validateName(value, 'Имя');
      setErrors(prev => ({ ...prev, firstName: error }));
    }
  };

  const handleMiddleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onMiddleNameChange(value);
    if (errors.middleName) {
      const error = validateName(value, 'Отчество', true);
      setErrors(prev => ({ ...prev, middleName: error }));
    }
  };

  const handleSubmit = async () => {
    const lastNameError = validateName(lastName, 'Фамилия');
    const firstNameError = validateName(firstName, 'Имя');
    const middleNameError = validateName(middleName, 'Отчество', true);

    if (lastNameError || firstNameError || middleNameError) {
      setErrors({
        lastName: lastNameError,
        firstName: firstNameError,
        middleName: middleNameError,
      });
      return;
    }

    if (!agreedToTerms) {
      setShakeTerms(true);
      setTimeout(() => setShakeTerms(false), 500);
      return;
    }

    if (!agreedToPersonalData) {
      setShakePersonalData(true);
      setTimeout(() => setShakePersonalData(false), 500);
      return;
    }

    try {
      // Register user without role/organization info
      const response = await apiService.register(
        phone,
        firstName,
        lastName,
        middleName
      );

      onNext(response.user);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Ошибка регистрации. Попробуйте снова.');
    }
  };

  const openSheet = (type: 'terms' | 'privacy' | 'personalData') => {
    const sheets = {
      terms: {
        title: 'Публичная оферта',
        content: `
          <h3>1. Общие положения</h3>
          <p>Настоящая публичная оферта (далее — «Оферта») определяет условия использования сервиса и представляет собой официальное предложение заключить договор на оказание услуг.</p>
          <p>Используя сервис, вы полностью принимаете условия настоящей оферты без каких-либо оговорок и исключений и обязуетесь их соблюдать.</p>

          <h3>2. Предмет договора</h3>
          <p>Оператор предоставляет Пользователю доступ к функциональности сервиса для обмена сообщениями, управления задачами и совместной работы над проектами.</p>
          <p>Пользователь получает право использовать сервис в соответствии с его функциональными возможностями в пределах, установленных настоящей офертой.</p>

          <h3>3. Условия использования</h3>
          <p>Пользователь обязуется использовать сервис исключительно в законных целях и в соответствии с действующим законодательством Российской Федерации.</p>
          <p>Запрещается использовать сервис для распространения противоправной информации, спама, вредоносного программного обеспечения или любого другого контента, нарушающего права третьих лиц.</p>
          <p>Пользователь несет полную ответственность за достоверность предоставленных при регистрации данных.</p>

          <h3>4. Права и обязанности сторон</h3>
          <p>Оператор сервиса обязуется обеспечить функционирование платформы в режиме 24/7, за исключением времени проведения технических работ.</p>
          <p>Оператор имеет право изменять функциональность сервиса, вводить новые возможности или ограничивать существующие с предварительным уведомлением пользователей.</p>
          <p>Пользователь обязуется не предпринимать действий, которые могут нарушить работу сервиса или причинить вред другим пользователям.</p>

          <h3>5. Ограничение ответственности</h3>
          <p>Оператор не несет ответственности за любые прямые или косвенные убытки, возникшие в результате использования или невозможности использования сервиса.</p>
          <p>Сервис предоставляется "как есть" без каких-либо гарантий, явных или подразумеваемых.</p>

          <h3>6. Изменение условий</h3>
          <p>Оператор оставляет за собой право в любое время изменять условия настоящей оферты в одностороннем порядке.</p>
          <p>Новая редакция оферты вступает в силу с момента ее размещения на сайте, если иное не предусмотрено новой редакцией оферты.</p>
        `,
      },
      privacy: {
        title: 'Политика конфиденциальности',
        content: `
          <h3>1. Сбор и использование информации</h3>
          <p>Мы собираем следующую информацию при регистрации и использовании сервиса:</p>
          <ul>
            <li>Фамилия, имя, отчество</li>
            <li>Номер мобильного телефона</li>
            <li>IP-адрес и данные об устройстве</li>
            <li>Информация об использовании сервиса (логи активности)</li>
          </ul>
          <p>Собранная информация используется для следующих целей:</p>
          <ul>
            <li>Регистрация и аутентификация пользователей</li>
            <li>Предоставление функциональности сервиса</li>
            <li>Связь с пользователями по вопросам технической поддержки</li>
            <li>Улучшение качества работы сервиса</li>
            <li>Предотвращение мошенничества и злоупотреблений</li>
          </ul>

          <h3>2. Хранение данных</h3>
          <p>Персональные данные хранятся на защищенных серверах с использованием современных технологий шифрования и защиты информации.</p>
          <p>Мы применяем административные, технические и физические меры безопасности для защиты ваших данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>
          <p>Доступ к персональным данным имеют только уполномоченные сотрудники, которые обязаны соблюдать конфиденциальность информации.</p>

          <h3>3. Передача данных третьим лицам</h3>
          <p>Мы не передаем ваши персональные данные третьим лицам, за исключением следующих случаев:</p>
          <ul>
            <li>С вашего явного согласия</li>
            <li>По требованию государственных органов в соответствии с законодательством</li>
            <li>Для предотвращения мошенничества или технических проблем</li>
          </ul>

          <h3>4. Ваши права</h3>
          <p>В соответствии с действующим законодательством вы имеете следующие права:</p>
          <ul>
            <li>Право на доступ к своим персональным данным</li>
            <li>Право на исправление неточных или неполных данных</li>
            <li>Право на удаление персональных данных</li>
            <li>Право на ограничение обработки данных</li>
            <li>Право на возражение против обработки</li>
            <li>Право на переносимость данных</li>
          </ul>

          <h3>5. Файлы cookie</h3>
          <p>Мы используем файлы cookie и аналогичные технологии для улучшения работы сервиса, анализа посещаемости и персонализации контента.</p>
          <p>Вы можете настроить свой браузер для отказа от cookie, однако это может ограничить функциональность сервиса.</p>

          <h3>6. Контактная информация</h3>
          <p>Если у вас есть вопросы относительно обработки ваших персональных данных или вы хотите воспользоваться своими правами, пожалуйста, свяжитесь с нами по адресу: support@example.com</p>
        `,
      },
      personalData: {
        title: 'Согласие на обработку персональных данных',
        content: `
          <h3>1. Цели обработки персональных данных</h3>
          <p>Я даю свое согласие на обработку моих персональных данных для следующих целей:</p>
          <ul>
            <li>Регистрация и авторизация в системе</li>
            <li>Предоставление услуг платформы и доступа к функциональности сервиса</li>
            <li>Связь со мной по вопросам использования сервиса и технической поддержки</li>
            <li>Улучшение качества работы сервиса и разработка новых функций</li>
            <li>Обеспечение безопасности сервиса и предотвращение мошенничества</li>
            <li>Выполнение обязательств, предусмотренных законодательством РФ</li>
          </ul>

          <h3>2. Объем обрабатываемых персональных данных</h3>
          <p>Я даю согласие на обработку следующих персональных данных:</p>
          <ul>
            <li>Фамилия, имя, отчество</li>
            <li>Номер мобильного телефона</li>
            <li>Адрес электронной почты (при предоставлении)</li>
            <li>IP-адрес и данные об используемом устройстве</li>
            <li>Данные об использовании сервиса (логи активности, история действий)</li>
            <li>Иная информация, предоставленная мной при использовании сервиса</li>
          </ul>

          <h3>3. Способы обработки персональных данных</h3>
          <p>Обработка персональных данных осуществляется с использованием следующих действий:</p>
          <ul>
            <li>Сбор, запись, систематизация, накопление</li>
            <li>Хранение, уточнение (обновление, изменение)</li>
            <li>Извлечение, использование, передача (предоставление, доступ)</li>
            <li>Обезличивание, блокирование, удаление, уничтожение</li>
          </ul>
          <p>Обработка персональных данных осуществляется как с использованием средств автоматизации, так и без их использования.</p>

          <h3>4. Срок обработки персональных данных</h3>
          <p>Персональные данные обрабатываются:</p>
          <ul>
            <li>В течение всего срока использования мной сервиса</li>
            <li>В течение 3 (трех) лет после прекращения использования сервиса</li>
            <li>До момента отзыва настоящего согласия</li>
          </ul>

          <h3>5. Права субъекта персональных данных</h3>
          <p>Я понимаю, что в соответствии с законодательством РФ я имею право:</p>
          <ul>
            <li>На получение информации об обработке моих персональных данных</li>
            <li>Требовать уточнения, блокирования или уничтожения моих данных</li>
            <li>Отозвать настоящее согласие в любой момент</li>
            <li>Обжаловать действия оператора в уполномоченный орган по защите прав субъектов персональных данных или в судебном порядке</li>
          </ul>

          <h3>6. Отзыв согласия</h3>
          <p>Я понимаю, что могу отозвать настоящее согласие, направив письменное уведомление оператору.</p>
          <p>Отзыв согласия не влияет на законность обработки персональных данных, осуществленной до момента отзыва.</p>

          <h3>7. Подтверждение</h3>
          <p>Устанавливая соответствующую отметку, я подтверждаю, что:</p>
          <ul>
            <li>Ознакомлен(а) с условиями обработки персональных данных</li>
            <li>Понимаю цели и способы обработки моих данных</li>
            <li>Даю добровольное согласие на обработку указанных данных</li>
          </ul>
        `,
      },
    };
    setSheetContent(sheets[type]);
  };

  const getUnderlineStyle = (field: 'lastName' | 'firstName' | 'middleName') => ({
    ...styles.inputUnderline,
    ...(focusedField === field ? styles.inputUnderlineActive : {}),
    ...(errors[field] ? styles.inputUnderlineError : {}),
  });

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.header}>Как вас зовут?</h1>

        <p style={styles.subtitle}>Пожалуйста, укажите ваши ФИО как в паспорте, это важно для проверки.</p>

        <div style={styles.inputGroup}>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={lastName}
              onChange={handleLastNameChange}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
              placeholder="Фамилия"
              style={styles.input}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-form-type="other"
            />
            <div style={getUnderlineStyle('lastName')} />
          </div>
          {errors.lastName && <div style={styles.error}>{errors.lastName}</div>}
        </div>

        <div style={styles.inputGroup}>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={firstName}
              onChange={handleFirstNameChange}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
              placeholder="Имя"
              style={styles.input}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-form-type="other"
            />
            <div style={getUnderlineStyle('firstName')} />
          </div>
          {errors.firstName && <div style={styles.error}>{errors.firstName}</div>}
        </div>

        <div style={styles.inputGroup}>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={middleName}
              onChange={handleMiddleNameChange}
              onFocus={() => setFocusedField('middleName')}
              onBlur={() => setFocusedField(null)}
              placeholder="Отчество"
              style={styles.input}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-form-type="other"
            />
            <div style={getUnderlineStyle('middleName')} />
          </div>
          {errors.middleName && <div style={styles.error}>{errors.middleName}</div>}
        </div>

        <label
          style={{
            ...styles.checkboxLabel,
            ...(shakeTerms ? styles.shake : {}),
          }}
        >
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => onAgreedChange(e.target.checked)}
            style={{
              ...styles.checkbox,
              accentColor: shakeTerms ? '#e74c3c' : '#000',
            }}
          />
          <span style={styles.checkboxText}>
            Принимаю{' '}
            <span onClick={() => openSheet('terms')} style={styles.link}>
              публичную оферту
            </span>
            {', '}
            <span onClick={() => openSheet('terms')} style={styles.link}>
              условия использования
            </span>
            {', '}
            <span onClick={() => openSheet('privacy')} style={styles.link}>
              политику конфиденциальности
            </span>
          </span>
        </label>

        <label
          style={{
            ...styles.checkboxLabel,
            ...(shakePersonalData ? styles.shake : {}),
          }}
        >
          <input
            type="checkbox"
            checked={agreedToPersonalData}
            onChange={(e) => onAgreedPersonalDataChange(e.target.checked)}
            style={{
              ...styles.checkbox,
              accentColor: shakePersonalData ? '#e74c3c' : '#000',
            }}
          />
          <span style={styles.checkboxText}>
            Даю{' '}
            <span onClick={() => openSheet('personalData')} style={styles.link}>
              согласие на обработку персональных данных
            </span>
          </span>
        </label>

        <button
          onClick={handleSubmit}
          style={styles.submitButton}
        >
          Далее
        </button>
      </div>

      <BottomSheet
        isOpen={!!sheetContent}
        onClose={() => setSheetContent(null)}
        title={sheetContent?.title || ''}
        content={sheetContent?.content || ''}
      />
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
    textAlign: 'left',
  },
  subtitle: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '40px',
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: '24px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    padding: '0 0 12px 0',
    fontSize: '16px',
    border: 'none',
    outline: 'none',
    color: '#000',
    background: 'transparent',
    boxSizing: 'border-box',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    boxShadow: 'none',
    WebkitBoxShadow: 'none',
    MozBoxShadow: 'none',
    WebkitTapHighlightColor: 'transparent',
  } as React.CSSProperties,
  inputUnderline: {
    width: '100%',
    height: '1px',
    background: '#ddd',
    transformOrigin: 'left center',
    transition: 'background 0.2s ease, transform 0.2s ease',
  } as React.CSSProperties,
  inputUnderlineActive: {
    background: '#000',
    transform: 'scaleY(1.6)',
  } as React.CSSProperties,
  inputUnderlineError: {
    background: '#e74c3c',
    transform: 'scaleY(1.6)',
  } as React.CSSProperties,
  error: {
    color: '#e74c3c',
    fontSize: '12px',
    marginTop: '5px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: '16px',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '12px',
    marginTop: '2px',
    width: '22px',
    height: '22px',
    flexShrink: 0,
    cursor: 'pointer',
    accentColor: '#000',
  },
  checkboxText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
  },
  link: {
    color: '#007AFF',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  shake: {
    animation: 'shake 0.5s',
  } as React.CSSProperties,
  submitButton: {
    background: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '24px',
    transition: 'opacity 0.2s',
    width: '100%',
  },
};
