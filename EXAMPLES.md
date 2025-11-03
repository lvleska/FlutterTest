# Примеры использования

## Базовое использование

### 1. Простая интеграция

```dart
import 'package:flutter/material.dart';
import 'screens/registration/registration_screen.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: RegistrationScreen(
        onLogin: (user) {
          print('User logged in: $user');
        },
      ),
    );
  }
}
```

### 2. С навигацией

```dart
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => RegistrationScreen(
      onLogin: (user) {
        // Сохранить данные пользователя
        saveUserData(user);

        // Перейти на главный экран
        Navigator.pushReplacementNamed(context, '/home');
      },
    ),
  ),
);
```

## Кастомизация темы

### Изменение цветов

```dart
MaterialApp(
  theme: ThemeData(
    primarySwatch: Colors.purple,
    primaryColor: Color(0xFF6C63FF),
    scaffoldBackgroundColor: Colors.white,

    // Кнопки
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: Color(0xFF6C63FF),
        foregroundColor: Colors.white,
        minimumSize: Size(double.infinity, 56),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        elevation: 0,
      ),
    ),

    // Текстовые поля
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Color(0xFFF5F5F5),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: Color(0xFF6C63FF), width: 2),
      ),
      contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
    ),

    // Чекбоксы
    checkboxTheme: CheckboxThemeData(
      fillColor: MaterialStateProperty.resolveWith<Color>((states) {
        if (states.contains(MaterialState.selected)) {
          return Color(0xFF6C63FF);
        }
        return Colors.grey;
      }),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
      ),
    ),
  ),
  home: RegistrationScreen(...),
);
```

## Интеграция с State Management

### Provider

```dart
// 1. Создайте RegistrationProvider

class RegistrationProvider extends ChangeNotifier {
  RegistrationStep _currentStep = RegistrationStep.phone;
  RegistrationData _data = RegistrationData();

  RegistrationStep get currentStep => _currentStep;
  RegistrationData get data => _data;

  void updateData(RegistrationData Function(RegistrationData) update) {
    _data = update(_data);
    notifyListeners();
  }

  void nextStep() {
    final steps = RegistrationStep.values;
    final currentIndex = steps.indexOf(_currentStep);
    if (currentIndex < steps.length - 1) {
      _currentStep = steps[currentIndex + 1];
      notifyListeners();
    }
  }
}

// 2. Оберните приложение в Provider

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => RegistrationProvider(),
      child: MyApp(),
    ),
  );
}

// 3. Используйте в виджетах

class PhoneStep extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<RegistrationProvider>(context);

    return TextField(
      onChanged: (phone) {
        provider.updateData((data) => data.copyWith(phone: phone));
      },
    );
  }
}
```

### Riverpod

```dart
// 1. Создайте providers

final registrationDataProvider = StateProvider<RegistrationData>(
  (ref) => RegistrationData(),
);

final currentStepProvider = StateProvider<RegistrationStep>(
  (ref) => RegistrationStep.phone,
);

// 2. Используйте в виджетах

class PhoneStep extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final data = ref.watch(registrationDataProvider);

    return TextField(
      onChanged: (phone) {
        ref.read(registrationDataProvider.notifier).state =
          data.copyWith(phone: phone);
      },
    );
  }
}
```

## Валидация форм

### Добавление валидации в PhoneStep

```dart
class PhoneStep extends StatefulWidget {
  // ...
}

class _PhoneStepState extends State<PhoneStep> {
  final _formKey = GlobalKey<FormState>();

  bool _isValidPhone(String phone) {
    // Простая проверка российского номера
    final regex = RegExp(r'^\+7\d{10}$');
    return regex.hasMatch(phone.replaceAll(RegExp(r'[\s\(\)-]'), ''));
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            decoration: InputDecoration(
              labelText: 'Номер телефона',
              hintText: '+7 (___) ___-__-__',
            ),
            keyboardType: TextInputType.phone,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Введите номер телефона';
              }
              if (!_isValidPhone(value)) {
                return 'Неверный формат номера';
              }
              return null;
            },
            onChanged: widget.onPhoneChange,
          ),
          SizedBox(height: 20),
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                widget.onNext();
              }
            },
            child: Text('Продолжить'),
          ),
        ],
      ),
    );
  }
}
```

## Индикаторы загрузки

### Добавление LoadingButton

```dart
class LoadingButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;

  const LoadingButton({
    required this.text,
    this.onPressed,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      child: isLoading
          ? SizedBox(
              height: 20,
              width: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            )
          : Text(text),
    );
  }
}

// Использование:
class _CodeStepState extends State<CodeStep> {
  bool _isLoading = false;

  Future<void> _handleVerify() async {
    setState(() => _isLoading = true);

    try {
      await apiService.verifySmsCode(phone, code);
      widget.onNext();
    } catch (e) {
      // Обработка ошибки
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return LoadingButton(
      text: 'Подтвердить',
      isLoading: _isLoading,
      onPressed: _handleVerify,
    );
  }
}
```

## Индикатор прогресса

### Добавление степпера

```dart
class RegistrationScreen extends StatefulWidget {
  // ...
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  int _getCurrentStepIndex() {
    return RegistrationStep.values.indexOf(_currentStep);
  }

  int _getTotalSteps() {
    // Не считаем success step
    return RegistrationStep.values.length - 1;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Индикатор прогресса
          LinearProgressIndicator(
            value: _getCurrentStepIndex() / _getTotalSteps(),
            backgroundColor: Colors.grey[200],
            valueColor: AlwaysStoppedAnimation<Color>(
              Theme.of(context).primaryColor,
            ),
          ),

          // Текстовый индикатор
          Padding(
            padding: EdgeInsets.all(16),
            child: Text(
              'Шаг ${_getCurrentStepIndex() + 1} из ${_getTotalSteps()}',
              style: TextStyle(color: Colors.grey),
            ),
          ),

          Expanded(
            child: _buildCurrentStep(),
          ),
        ],
      ),
    );
  }
}
```

## Локализация

### Добавление поддержки нескольких языков

```dart
// 1. Добавьте в pubspec.yaml
dependencies:
  flutter_localizations:
    sdk: flutter
  intl: ^0.18.0

// 2. Создайте файлы локализации

// lib/l10n/app_en.arb
{
  "phoneStepTitle": "Enter phone number",
  "phoneStepHint": "+1 (___) ___-____",
  "continue": "Continue",
  "back": "Back"
}

// lib/l10n/app_ru.arb
{
  "phoneStepTitle": "Введите номер телефона",
  "phoneStepHint": "+7 (___) ___-__-__",
  "continue": "Продолжить",
  "back": "Назад"
}

// 3. Настройте MaterialApp

MaterialApp(
  localizationsDelegates: [
    AppLocalizations.delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ],
  supportedLocales: [
    Locale('en', ''),
    Locale('ru', ''),
  ],
  // ...
);

// 4. Используйте в виджетах

Text(AppLocalizations.of(context)!.phoneStepTitle)
```

## Обработка ошибок

### Централизованная обработка ошибок

```dart
class ErrorHandler {
  static void handle(BuildContext context, dynamic error) {
    String message;

    if (error is ApiException) {
      message = error.message;
    } else if (error is NetworkException) {
      message = 'Проверьте подключение к интернету';
    } else {
      message = 'Произошла ошибка. Попробуйте снова.';
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        action: SnackBarAction(
          label: 'OK',
          textColor: Colors.white,
          onPressed: () {},
        ),
      ),
    );
  }
}

// Использование:
try {
  await apiService.sendSmsCode(phone);
} catch (e) {
  ErrorHandler.handle(context, e);
}
```

## Сохранение состояния

### Сохранение прогресса регистрации

```dart
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class RegistrationStateManager {
  static const String _key = 'registration_state';

  static Future<void> saveState(RegistrationData data) async {
    final prefs = await SharedPreferences.getInstance();
    final json = jsonEncode({
      'phone': data.phone,
      'firstName': data.firstName,
      'lastName': data.lastName,
      // ... другие поля
    });
    await prefs.setString(_key, json);
  }

  static Future<RegistrationData?> loadState() async {
    final prefs = await SharedPreferences.getInstance();
    final json = prefs.getString(_key);

    if (json != null) {
      final map = jsonDecode(json);
      return RegistrationData(
        phone: map['phone'] ?? '',
        firstName: map['firstName'] ?? '',
        lastName: map['lastName'] ?? '',
        // ... другие поля
      );
    }

    return null;
  }

  static Future<void> clearState() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}

// Использование:
@override
void initState() {
  super.initState();
  _loadSavedState();
}

Future<void> _loadSavedState() async {
  final savedData = await RegistrationStateManager.loadState();
  if (savedData != null) {
    setState(() {
      _registrationData = savedData;
    });
  }
}

void _updateData(RegistrationData Function(RegistrationData) update) {
  setState(() {
    _registrationData = update(_registrationData);
    RegistrationStateManager.saveState(_registrationData);
  });
}
```

## Аналитика

### Отслеживание шагов регистрации

```dart
import 'package:firebase_analytics/firebase_analytics.dart';

class AnalyticsService {
  final FirebaseAnalytics _analytics = FirebaseAnalytics.instance;

  Future<void> logRegistrationStep(RegistrationStep step) async {
    await _analytics.logEvent(
      name: 'registration_step',
      parameters: {
        'step': step.name,
        'step_index': RegistrationStep.values.indexOf(step),
      },
    );
  }

  Future<void> logRegistrationComplete() async {
    await _analytics.logEvent(name: 'registration_complete');
  }
}

// Использование в RegistrationScreen:
void _goToNextStep() {
  // ... существующий код ...

  AnalyticsService().logRegistrationStep(_currentStep);
}
```

## Тестирование

### Unit тесты для моделей

```dart
// test/models/registration_data_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:your_app/models/registration_data.dart';

void main() {
  group('RegistrationData', () {
    test('copyWith creates new instance with updated fields', () {
      final data = RegistrationData(phone: '+71234567890');
      final updated = data.copyWith(firstName: 'John');

      expect(updated.phone, '+71234567890');
      expect(updated.firstName, 'John');
      expect(data.firstName, ''); // Оригинал не изменился
    });
  });
}
```

### Widget тесты

```dart
// test/screens/phone_step_test.dart

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:your_app/screens/registration/steps/phone_step.dart';

void main() {
  testWidgets('PhoneStep displays phone input', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: PhoneStep(
          phone: '',
          onPhoneChange: (_) {},
          onNext: () {},
          onBack: () {},
        ),
      ),
    );

    expect(find.byType(TextField), findsOneWidget);
    expect(find.text('Продолжить'), findsOneWidget);
  });
}
```

## Дополнительные ресурсы

- Примеры в папке `examples/` (если создана)
- Документация по API в `API.md`
- Гайд по стилизации в `STYLING.md`
