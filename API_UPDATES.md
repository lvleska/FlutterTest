# API Updates - Flutter Registration

## Изменения в API сервисе

### ✅ Обновленные endpoints

| Старый | Новый | Статус |
|--------|-------|--------|
| `/auth/send-code` | `/auth/send-code` | ✅ Correct |
| `/auth/verify-code` | `/auth/verify-code` | ✅ Correct |
| `/auth/register` | `/auth/register` | ✅ Correct |
| `/user/context/individual` | `/users/contexts` + `{type: 'individual'}` | ✅ Updated |
| `/user/organization` | `/users/contexts` + `{type: 'organization', organization: {...}}` | ✅ Updated |
| `/user/skills` (POST) | `/users/skills` (PUT) | ✅ Updated |
| `/organization/search?inn=` | `/organizations/search-dadata` (POST) | ✅ Updated |
| `/user/photo` | `/auth/profile/upload-photo` | ✅ Updated |
| - | `/users/skill-categories` (GET) | ✅ Added |
| - | `/auth/me` (GET) | ✅ Added |

### Новые методы API

#### 1. `getSkillCategories()`
```dart
Future<Map<String, dynamic>> getSkillCategories() async {
  final response = await http.get(
    Uri.parse('$baseUrl/users/skill-categories'),
    headers: _getHeaders(),
  );
  return jsonDecode(response.body);
}
```

**Ответ:**
```json
{
  "categories": [
    {
      "id": "construction",
      "title": "Строительство",
      "color": "orange",
      "skills": [...]
    }
  ]
}
```

#### 2. `createOrganizationContext()`
```dart
Future<Map<String, dynamic>> createOrganizationContext({
  required String inn,
  required String name,
  required String organizationType, // 'organizer' | 'exhibitor' | 'contractor'
  // ... other params
}) async {
  final response = await http.post(
    Uri.parse('$baseUrl/users/contexts'),
    headers: _getHeaders(),
    body: jsonEncode({
      'type': 'organization',
      'organization': {
        'inn': inn,
        'name': name,
        'organizationType': organizationType,
        // ...
      },
    }),
  );
  return jsonDecode(response.body);
}
```

**Ответ:**
```json
{
  "context": {
    "id": "ctx-123",
    "type": "organization",
    "isActive": true,
    "organization": {...},
    "role": "owner"
  },
  "needsVerification": true
}
```

#### 3. `searchOrganization()`
```dart
Future<Map<String, dynamic>> searchOrganization(String query) async {
  final response = await http.post(
    Uri.parse('$baseUrl/organizations/search-dadata'),
    headers: _getHeaders(),
    body: jsonEncode({'query': query}),
  );
  return jsonDecode(response.body);
}
```

**Ответ:**
```json
{
  "results": [
    {
      "inn": "7712345678",
      "name": "ООО Компания",
      "shortName": "Компания",
      "kpp": "771201001",
      "ogrn": "1047712345678",
      "address": "г. Москва, ул. Примерная, д. 1",
      "phone": "+7 (495) 123-45-67",
      "email": "contact@company.ru",
      "management": {
        "name": "Иван Сидоров",
        "post": "Генеральный директор"
      }
    }
  ]
}
```

## Стили Registration Theme

### Создан новый файл `lib/theme/registration_theme.dart`

Все стили соответствуют `registration.css`:

#### Цвета
```dart
static const Color primaryText = Color(0xFF000000);        // #000
static const Color secondaryText = Color(0xFF666666);      // #666
static const Color labelText = Color(0xFF999999);          // #999
static const Color errorText = Color(0xFFE74C3C);          // #e74c3c
static const Color linkColor = Color(0xFF007AFF);          // #007AFF
static const Color inputBorder = Color(0xFFDDDDDD);        // #ddd
static const Color inputBorderFocused = Color(0xFF000000); // #000
static const Color buttonBackground = Color(0xFF000000);   // #000
```

#### Типография
```dart
// .reg-header
static const TextStyle headerStyle = TextStyle(
  fontSize: 28,
  fontWeight: FontWeight.w700,
  color: primaryText,
);

// .reg-subtitle
static const TextStyle subtitleStyle = TextStyle(
  fontSize: 15,
  color: secondaryText,
);

// .reg-input
static const TextStyle inputStyle = TextStyle(
  fontSize: 16,
  color: primaryText,
);

// .reg-button
static const TextStyle buttonStyle = TextStyle(
  fontSize: 16,
  fontWeight: FontWeight.w600,
  color: buttonText,
);
```

#### Поля ввода
Соответствуют `.reg-input` с нижним подчеркиванием:
```dart
static InputDecoration getInputDecoration({
  String? label,
  String? hint,
  String? error,
}) {
  return InputDecoration(
    border: UnderlineInputBorder(
      borderSide: BorderSide(color: inputBorder, width: 1),
    ),
    focusedBorder: UnderlineInputBorder(
      borderSide: BorderSide(color: inputBorderFocused, width: 1),
    ),
    contentPadding: EdgeInsets.only(bottom: 8),
    // ...
  );
}
```

#### Кнопки
Соответствуют `.reg-button`:
```dart
static ButtonStyle getButtonStyle({bool enabled = true}) {
  return ElevatedButton.styleFrom(
    backgroundColor: buttonBackground,        // #000
    foregroundColor: buttonText,             // #fff
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
    padding: EdgeInsets.symmetric(vertical: 16),
    minimumSize: Size(double.infinity, 50),
  );
}
```

#### Контейнеры
Соответствуют `.reg-container` и `.reg-content`:
```dart
// .reg-content
static const EdgeInsets contentPadding = EdgeInsets.all(20);

// Метод для создания контента
static Widget buildContent({
  required List<Widget> children,
  bool scrollable = false,
}) {
  // Соответствует .reg-content или .reg-content-scrollable
}
```

## Обновленные компоненты

### ✅ PhoneStep
- Использует `RegistrationTheme` для стилей
- Вызывает `sendSmsCode()` API
- Валидация номера телефона
- Показывает индикатор загрузки
- Обработка ошибок

### 🔄 CodeStep (требует обновления)
Нужно обновить:
- Использовать `verifyCode()` вместо `verifySmsCode()`
- Проверять `exists` в ответе
- Применить стили из `RegistrationTheme`

### 🔄 NameStep (требует обновления)
Нужно обновить:
- Использовать `register()` вместо `registerUser()`
- Применить стили из `RegistrationTheme`
- Стилизовать чекбоксы согласно `.reg-checkbox`

### 🔄 RoleStep (требует обновления)
- Применить стили из `RegistrationTheme`
- Использовать RadioListTile со стилями

### 🔄 SkillsStep (требует обновления)
Нужно добавить:
- Загрузку категорий через `getSkillCategories()`
- Группировку по категориям с цветами
- Применить стили из `RegistrationTheme`

### 🔄 OrganizationStep (требует обновления)
Нужно обновить:
- Использовать `searchOrganization()` вместо `searchOrganizationByInn()`
- Применить стили из `RegistrationTheme`
- Показывать результаты поиска

### 🔄 PhotoStep (требует обновления)
- Применить стили из `RegistrationTheme`
- Обработка ответа с `photoUrl`

### 🔄 RegistrationScreen (требует обновления)
Нужно обновить:
- Использовать `createOrganizationContext()` вместо `saveOrganization()`
- Обработать ответ `needsVerification` из контекста

## План дальнейших обновлений

### Приоритет 1 (критично)
- [ ] Обновить CodeStep с проверкой `exists`
- [ ] Обновить NameStep с правильным API
- [ ] Обновить SkillsStep с категориями
- [ ] Обновить OrganizationStep с поиском
- [ ] Обновить RegistrationScreen с contexts API

### Приоритет 2 (важно)
- [ ] Применить RegistrationTheme ко всем steps
- [ ] Добавить индикаторы загрузки во все steps
- [ ] Унифицировать обработку ошибок

### Приоритет 3 (улучшения)
- [ ] Добавить форматирование номера телефона
- [ ] Добавить таймер повторной отправки кода
- [ ] Добавить анимации переходов
- [ ] Добавить индикатор прогресса (степпер)

## Использование

### В main.dart
```dart
MaterialApp(
  theme: RegistrationTheme.buildTheme(),
  home: RegistrationScreen(...),
);
```

### В step виджетах
```dart
@override
Widget build(BuildContext context) {
  return Scaffold(
    backgroundColor: RegistrationTheme.backgroundColor,
    body: RegistrationTheme.buildContent(
      children: [
        Text('Header', style: RegistrationTheme.headerStyle),
        Text('Subtitle', style: RegistrationTheme.subtitleStyle),
        TextField(
          decoration: RegistrationTheme.getInputDecoration(
            label: 'Label',
            hint: 'Hint',
          ),
          style: RegistrationTheme.inputStyle,
        ),
        ElevatedButton(
          style: RegistrationTheme.getButtonStyle(),
          child: Text('Button'),
        ),
      ],
    ),
  );
}
```

## Сравнение

### До
```dart
TextField(
  decoration: InputDecoration(
    hintText: '+7 (___) ___-__-__',
    border: OutlineInputBorder(),
  ),
)
```

### После
```dart
TextField(
  decoration: RegistrationTheme.getInputDecoration(
    label: 'Телефон',
    hint: '+7 (___) ___-__-__',
  ),
  style: RegistrationTheme.inputStyle,
)
```

Результат: точно соответствует CSS стилям из `registration.css`

## Файлы для обновления

1. ✅ `lib/services/api_service.dart` - обновлен
2. ✅ `lib/theme/registration_theme.dart` - создан
3. ✅ `lib/screens/registration/steps/phone_step.dart` - обновлен
4. 🔄 `lib/screens/registration/steps/code_step.dart` - требует обновления
5. 🔄 `lib/screens/registration/steps/name_step.dart` - требует обновления
6. 🔄 `lib/screens/registration/steps/role_step.dart` - требует обновления
7. 🔄 `lib/screens/registration/steps/skills_step.dart` - требует обновления
8. 🔄 `lib/screens/registration/steps/organization_step.dart` - требует обновления
9. 🔄 `lib/screens/registration/steps/photo_step.dart` - требует обновления
10. 🔄 `lib/screens/registration/registration_screen.dart` - требует обновления
11. 🔄 `lib/main.dart` - требует обновления (применить тему)
