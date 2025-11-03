# Быстрый старт

## Предварительные требования

- Flutter SDK 3.0.0 или выше
- Dart SDK 3.0.0 или выше
- Android Studio / Xcode (для мобильной разработки)
- VS Code или Android Studio с плагинами Flutter

## Установка Flutter

### macOS
```bash
# Используя Homebrew
brew install --cask flutter

# Или загрузите с официального сайта
# https://docs.flutter.dev/get-started/install/macos
```

### Linux
```bash
# Загрузите Flutter SDK
wget https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.x.x-stable.tar.xz

# Распакуйте
tar xf flutter_linux_3.x.x-stable.tar.xz

# Добавьте в PATH
export PATH="$PATH:`pwd`/flutter/bin"
```

### Windows
```bash
# Загрузите установщик с
# https://docs.flutter.dev/get-started/install/windows
```

## Проверка установки

```bash
flutter doctor
```

Эта команда проверит вашу установку и покажет, что нужно настроить.

## Запуск проекта

### 1. Установите зависимости

```bash
cd FlutterTest
flutter pub get
```

### 2. Проверьте доступные устройства

```bash
flutter devices
```

### 3. Запустите приложение

#### На эмуляторе Android
```bash
flutter run
```

#### На iOS симуляторе (только macOS)
```bash
open -a Simulator
flutter run
```

#### В веб-браузере
```bash
flutter run -d chrome
```

#### На конкретном устройстве
```bash
flutter run -d <device-id>
```

## Горячая перезагрузка

После запуска приложения:
- Нажмите `r` - для hot reload (быстрая перезагрузка)
- Нажмите `R` - для hot restart (полная перезагрузка)
- Нажмите `q` - для выхода

## Настройка API

Откройте файл [lib/services/api_service.dart](lib/services/api_service.dart) и измените URL:

```dart
static const String baseUrl = 'https://your-api-url.com';
```

## Структура команд

```bash
# Получить зависимости
flutter pub get

# Запустить приложение
flutter run

# Запустить в режиме релиза
flutter run --release

# Собрать APK (Android)
flutter build apk

# Собрать iOS приложение
flutter build ios

# Собрать для веба
flutter build web

# Запустить тесты
flutter test

# Анализ кода
flutter analyze

# Форматирование кода
dart format lib/

# Очистка сборки
flutter clean
```

## Режимы запуска

### Debug (по умолчанию)
```bash
flutter run
```
- Включен hot reload
- Больший размер приложения
- Медленнее работает
- Доступны инструменты отладки

### Profile
```bash
flutter run --profile
```
- Профилирование производительности
- Отключен hot reload
- Работает быстрее debug

### Release
```bash
flutter run --release
```
- Максимальная производительность
- Минимальный размер
- Без инструментов отладки
- Оптимизирован для продакшена

## Сборка для продакшена

### Android

```bash
# APK (один файл для всех архитектур)
flutter build apk

# App Bundle (рекомендуется для Google Play)
flutter build appbundle

# APK для конкретной архитектуры
flutter build apk --split-per-abi
```

Файлы будут в `build/app/outputs/`

### iOS (только macOS)

```bash
flutter build ios

# Или для архива
flutter build ipa
```

Файлы будут в `build/ios/`

### Web

```bash
flutter build web
```

Файлы будут в `build/web/`

## Отладка

### Открыть DevTools

```bash
flutter pub global activate devtools
flutter pub global run devtools
```

### Логирование

```dart
import 'package:flutter/foundation.dart';

debugPrint('Debug message');
print('Console message');
```

### Просмотр логов

```bash
# Все логи
flutter logs

# Фильтр по тегу
flutter logs --grep="Registration"
```

## Устранение проблем

### Проблемы с зависимостями

```bash
flutter pub cache repair
flutter clean
flutter pub get
```

### Проблемы с Gradle (Android)

```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
```

### Проблемы с CocoaPods (iOS)

```bash
cd ios
pod deintegrate
pod install
cd ..
flutter clean
flutter pub get
```

### Версия Flutter не та

```bash
# Обновить Flutter
flutter upgrade

# Переключить канал
flutter channel stable
flutter upgrade

# Проверить версию
flutter --version
```

## Полезные команды разработки

```bash
# Создать новый экран
# Создайте файл: lib/screens/new_screen.dart

# Создать новую модель
# Создайте файл: lib/models/new_model.dart

# Добавить зависимость
flutter pub add package_name

# Удалить зависимость
flutter pub remove package_name

# Проверить устаревшие зависимости
flutter pub outdated

# Обновить зависимости
flutter pub upgrade
```

## IDE настройки

### VS Code

Установите расширения:
- Flutter
- Dart

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Flutter",
      "type": "dart",
      "request": "launch",
      "program": "lib/main.dart"
    }
  ]
}
```

### Android Studio

1. File → Settings → Plugins
2. Установите Flutter plugin
3. Dart plugin установится автоматически

## Производительность

### Проверка размера приложения

```bash
flutter build apk --analyze-size
flutter build ios --analyze-size
```

### Профилирование

```bash
flutter run --profile
# Затем откройте DevTools
```

## Следующие шаги

1. ✅ Установите зависимости: `flutter pub get`
2. ✅ Настройте API URL в `api_service.dart`
3. ✅ Запустите приложение: `flutter run`
4. 🔧 Настройте UI под ваш дизайн
5. 🔧 Интегрируйте с вашим бэкендом
6. 🧪 Добавьте тесты
7. 📦 Соберите релиз

## Дополнительные ресурсы

- [Flutter Docs](https://docs.flutter.dev/)
- [Dart Docs](https://dart.dev/guides)
- [Flutter Cookbook](https://docs.flutter.dev/cookbook)
- [Flutter Packages](https://pub.dev/)
- [Flutter Community](https://flutter.dev/community)

## Поддержка

Если возникли проблемы:

1. Проверьте `flutter doctor`
2. Прочитайте логи `flutter logs`
3. Очистите проект `flutter clean`
4. Переустановите зависимости `flutter pub get`
5. Проверьте GitHub Issues
