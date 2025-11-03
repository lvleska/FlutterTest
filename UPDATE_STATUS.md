# Статус обновления Flutter Registration

## ✅ Полностью обновлено

### 1. API Service (`lib/services/api_service.dart`)
**Изменения:**
- ✅ Обновлены все endpoints в соответствии с актуальными
- ✅ `sendSmsCode()` - `/auth/send-code`
- ✅ `verifyCode()` - `/auth/verify-code` (проверка `exists`)
- ✅ `register()` - `/auth/register`
- ✅ `createIndividualContext()` - `/users/contexts` + `{type: 'individual'}`
- ✅ `createOrganizationContext()` - `/users/contexts` + `{type: 'organization'}`
- ✅ `updateUserSkills()` - PUT `/users/skills`
- ✅ `getSkillCategories()` - GET `/users/skill-categories`
- ✅ `searchOrganization()` - POST `/organizations/search-dadata`
- ✅ `uploadProfilePhoto()` - POST `/auth/profile/upload-photo`
- ✅ `getMe()` - GET `/auth/me`

### 2. Registration Theme (`lib/theme/registration_theme.dart`)
**Создан новый файл со стилями, полностью соответствующими `registration.css`:**
- ✅ Все цвета (#000, #666, #999, #ddd, #e74c3c, #007AFF)
- ✅ Типография (fontSize, fontWeight, lineHeight)
- ✅ Поля ввода с нижним подчеркиванием
- ✅ Кнопки с border-radius: 12px, padding: 16px
- ✅ Чекбоксы с accent-color: #000
- ✅ Контейнеры с padding: 20px
- ✅ Отступы (margins, paddings)

### 3. PhoneStep (`lib/screens/registration/steps/phone_step.dart`)
**Полностью обновлен:**
- ✅ Использует `RegistrationTheme` для всех стилей
- ✅ Вызывает `sendSmsCode()` API
- ✅ Валидация номера телефона (11 цифр, начинается с 7)
- ✅ Индикатор загрузки
- ✅ Обработка ошибок с показом сообщений
- ✅ Форматирование ввода (только цифры, макс 11)

### 4. CodeStep (`lib/screens/registration/steps/code_step.dart`)
**Полностью обновлен:**
- ✅ Использует `RegistrationTheme`
- ✅ Вызывает `verifyCode()` API
- ✅ Проверяет `exists` в ответе
- ✅ Если user exists → вызывает `onUserExists()`
- ✅ Если new user → переходит к регистрации
- ✅ Валидация кода (4 цифры)
- ✅ Индикатор загрузки
- ✅ Кнопка "Изменить номер"

### 5. NameStep (`lib/screens/registration/steps/name_step.dart`)
**Полностью обновлен:**
- ✅ Использует `RegistrationTheme`
- ✅ Вызывает `register()` API
- ✅ Три поля: фамилия*, имя*, отчество
- ✅ Два чекбокса со стилями из CSS
- ✅ Валидация обязательных полей
- ✅ Индикатор загрузки
- ✅ Scrollable контент

## 🔄 Требуют обновления

### 6. RoleStep (`lib/screens/registration/steps/role_step.dart`)
**Что нужно:**
- [ ] Применить `RegistrationTheme`
- [ ] Убрать AppBar
- [ ] Добавить header и subtitle
- [ ] Стилизовать RadioListTile

### 7. SkillsStep (`lib/screens/registration/steps/skills_step.dart`)
**Что нужно:**
- [ ] Загружать категории через `getSkillCategories()`
- [ ] Показывать группы по категориям
- [ ] Применять цвета категорий (orange, purple, blue, yellow, green)
- [ ] Применить `RegistrationTheme`
- [ ] Индикатор загрузки при загрузке категорий

**Структура ответа API:**
```json
{
  "categories": [
    {
      "id": "construction",
      "title": "Строительство",
      "color": "orange",
      "skills": [
        {"id": 1, "name": "Проектирование"},
        {"id": 2, "name": "Монтаж"}
      ]
    }
  ]
}
```

### 8. OrganizationStep (`lib/screens/registration/steps/organization_step.dart`)
**Что нужно:**
- [ ] Использовать `searchOrganization(query)` вместо search by INN
- [ ] Поиск по названию или ИНН
- [ ] Показывать список результатов
- [ ] Применить `RegistrationTheme`
- [ ] Индикатор загрузки при поиске

### 9. PhotoStep (`lib/screens/registration/steps/photo_step.dart`)
**Что нужно:**
- [ ] Применить `RegistrationTheme`
- [ ] Обработать ответ с `photoUrl`
- [ ] Убрать AppBar

### 10. SuccessStep (`lib/screens/registration/steps/success_step.dart`)
**Что нужно:**
- [ ] Применить `RegistrationTheme`
- [ ] Улучшить дизайн success экрана

### 11. RegistrationScreen (`lib/screens/registration/registration_screen.dart`)
**Что нужно обновить:**

#### handleSkillsComplete()
```dart
// БЫЛО
await apiService.createIndividualContext();
await apiService.updateUserSkills(skillIds);

// СТАЛО
final contextResponse = await apiService.createIndividualContext();
await apiService.updateUserSkills(skillIds);
```

#### handleOrganizationComplete()
```dart
// БЫЛО
await apiService.saveOrganization({...});

// СТАЛО
final contextResponse = await apiService.createOrganizationContext(
  inn: selectedOrg.inn,
  name: selectedOrg.name,
  organizationType: registrationData.organizationType,
  // ...
);

// Обработать ответ
if (contextResponse['needsVerification'] == true) {
  updateData({ needsVerification: true });
}
```

### 12. main.dart (`lib/main.dart`)
**Что нужно:**
- [ ] Применить `RegistrationTheme.buildTheme()` в `MaterialApp`

```dart
MaterialApp(
  theme: RegistrationTheme.buildTheme(),
  home: RegistrationScreen(...),
);
```

## Краткий чек-лист

- [x] API Service обновлен
- [x] RegistrationTheme создан
- [x] PhoneStep - полностью готов
- [x] CodeStep - полностью готов
- [x] NameStep - полностью готов
- [ ] RoleStep - применить стили
- [ ] SkillsStep - категории + стили
- [ ] OrganizationStep - поиск + стили
- [ ] PhotoStep - стили
- [ ] SuccessStep - стили
- [ ] RegistrationScreen - contexts API
- [ ] main.dart - тема

## Следующие шаги

1. Обновить оставшиеся 6 step виджетов
2. Обновить RegistrationScreen с новым API для contexts
3. Применить тему в main.dart
4. Тестирование всего потока

## Команды для запуска

```bash
# Установить зависимости
flutter pub get

# Запустить
flutter run

# При ошибках компиляции
flutter clean
flutter pub get
flutter run
```

## Важные замечания

### API Endpoints
Все endpoints обновлены в соответствии с актуальными:
- `POST /auth/send-code`
- `POST /auth/verify-code`
- `POST /auth/register`
- `POST /users/contexts` (для individual и organization)
- `PUT /users/skills`
- `GET /users/skill-categories`
- `POST /organizations/search-dadata`

### Стили
Все стили полностью соответствуют `registration.css`:
- Цвета точно совпадают
- Размеры шрифтов совпадают
- Отступы совпадают
- Border-radius совпадают
- Поля ввода с нижним подчеркиванием

### Логика
- PhoneStep → отправляет код
- CodeStep → проверяет код, определяет exists или new user
- NameStep → регистрирует нового пользователя
- RoleStep → определяет тип (individual vs organization)
- SkillsStep (для individual) → выбор навыков
- OrganizationStep (для contractor/exhibitor/organizer) → поиск организации
- PhotoStep → загрузка фото (optional)
- SuccessStep → завершение

## Оценка прогресса

**Завершено:** 50% (5 из 10 файлов полностью обновлены)

**Осталось:**
- 4 step виджета (RoleStep, SkillsStep, OrganizationStep, PhotoStep, SuccessStep)
- 1 главный экран (RegistrationScreen)
- 1 конфигурация (main.dart)

**Время на завершение:** ~1-2 часа работы
