# Flutter Registration Flow

Это перевод процесса регистрации/авторизации с TypeScript React на Flutter.

## Структура проекта

```
lib/
├── main.dart                           # Точка входа приложения
├── models/
│   └── registration_data.dart          # Модели данных регистрации
├── screens/
│   └── registration/
│       ├── registration_screen.dart    # Главный экран регистрации
│       └── steps/
│           ├── phone_step.dart         # Шаг: ввод телефона
│           ├── code_step.dart          # Шаг: ввод кода
│           ├── name_step.dart          # Шаг: ввод ФИО
│           ├── role_step.dart          # Шаг: выбор роли
│           ├── skills_step.dart        # Шаг: выбор навыков
│           ├── organization_step.dart  # Шаг: выбор организации
│           ├── photo_step.dart         # Шаг: загрузка фото
│           └── success_step.dart       # Шаг: успешная регистрация
└── services/
    └── api_service.dart                # API сервис
```

## Основные отличия от React версии

### 1. Управление состоянием
- **React**: использует `useState` хуки
- **Flutter**: использует `StatefulWidget` и `setState`

### 2. Навигация между шагами
- **React**: условный рендеринг на основе `currentStep`
- **Flutter**: переключение виджетов в методе `_buildCurrentStep()`

### 3. Передача данных
- **React**: пропсы и колбэки
- **Flutter**: параметры конструктора и callback функции

### 4. Обработка форм
- **React**: контролируемые компоненты с `onChange`
- **Flutter**: `TextEditingController` или прямое обновление состояния через `onChanged`

## Установка

1. Убедитесь, что у вас установлен Flutter SDK (версия 3.0.0 или выше)

2. Установите зависимости:
```bash
flutter pub get
```

3. Запустите приложение:
```bash
flutter run
```

## Зависимости

- **http** (^1.1.0) - для HTTP запросов к API
- **image_picker** (^1.0.4) - для выбора фото профиля

## Настройка API

Откройте файл `lib/services/api_service.dart` и замените `baseUrl` на URL вашего API:

```dart
static const String baseUrl = 'https://your-api.com';
```

## Использование

### Основное использование

```dart
import 'package:flutter/material.dart';
import 'screens/registration/registration_screen.dart';

// В вашем виджете:
Navigator.of(context).push(
  MaterialPageRoute(
    builder: (context) => RegistrationScreen(
      onLogin: (user) {
        // Обработка успешной регистрации/входа
        print('User logged in: $user');
        // Сохраните данные пользователя или перейдите на главный экран
      },
    ),
  ),
);
```

## Поток регистрации

1. **PhoneStep** - Ввод номера телефона
2. **CodeStep** - Ввод кода подтверждения из SMS
3. **NameStep** - Ввод личных данных (ФИО) и согласие с условиями
4. **RoleStep** - Выбор роли (подрядчик, экспонент, организатор, исполнитель)
5. **SkillsStep** или **OrganizationStep** - В зависимости от роли:
   - Исполнитель (физ. лицо) → выбор навыков
   - Другие роли → выбор/регистрация организации
6. **PhotoStep** - Загрузка фото профиля (опционально)
7. **SuccessStep** - Успешное завершение регистрации

## Кастомизация

### Изменение стилей

Глобальные стили настраиваются в `main.dart` в `MaterialApp.theme`:

```dart
theme: ThemeData(
  primarySwatch: Colors.blue,
  scaffoldBackgroundColor: Colors.white,
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      minimumSize: const Size(double.infinity, 50),
      // ... другие настройки
    ),
  ),
),
```

### Добавление новых шагов

1. Создайте новый виджет в `lib/screens/registration/steps/`
2. Добавьте новый шаг в enum `RegistrationStep` в `registration_data.dart`
3. Добавьте обработку нового шага в `_buildCurrentStep()` в `registration_screen.dart`

### Интеграция с вашим API

Все API методы находятся в `lib/services/api_service.dart`. Измените их в соответствии с вашим API:

```dart
Future<Map<String, dynamic>> sendSmsCode(String phone) async {
  // Ваша реализация
}
```

## Сравнение ключевых концепций

| Концепция | React/TypeScript | Flutter/Dart |
|-----------|------------------|--------------|
| Состояние компонента | `useState` | `StatefulWidget` + `setState` |
| Эффекты | `useEffect` | `initState`, `didUpdateWidget` |
| Условный рендеринг | `{condition && <Component />}` | `if (condition) Widget()` |
| Списки | `.map()` | `.map().toList()` |
| Стили | CSS-in-JS объекты | Widget properties |
| Навигация | React Router / условный рендеринг | Navigator + Routes |
| Формы | Controlled components | TextEditingController |

## Дополнительные улучшения (TODO)

- [ ] Добавить валидацию форм
- [ ] Добавить обработку ошибок API
- [ ] Добавить индикаторы загрузки
- [ ] Добавить кэширование данных
- [ ] Добавить тесты
- [ ] Добавить локализацию (i18n)
- [ ] Интегрировать state management (Provider/Riverpod/Bloc)

## Лицензия

MIT
