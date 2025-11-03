# Диаграмма потока регистрации

## Визуальная схема

```
┌─────────────────────────────────────────────────────────────┐
│                         START                               │
│                      (main.dart)                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────┐
         │  RegistrationScreen     │
         │  (registration_screen)  │
         └──────────┬──────────────┘
                    │
        ┌───────────┴───────────┐
        │  Registration State   │
        │  - currentStep        │
        │  - registrationData   │
        └───────────┬───────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
    ▼               ▼               ▼
┌────────┐    ┌─────────┐    ┌──────────┐
│ Models │    │ Services│    │  Steps   │
└────────┘    └─────────┘    └──────────┘
```

## Пошаговый поток

```
┌──────────────┐
│  PhoneStep   │  1. Ввод номера телефона
└──────┬───────┘     ↓ onNext()
       │
       ▼
┌──────────────┐
│   CodeStep   │  2. Ввод кода из SMS
└──────┬───────┘     ↓ onNext() или onUserExists()
       │
       ▼
┌──────────────┐
│   NameStep   │  3. Ввод ФИО + согласия
└──────┬───────┘     ↓ onNext(user)
       │
       ▼
┌──────────────┐
│   RoleStep   │  4. Выбор роли
└──────┬───────┘
       │
       ├─────────────────┬──────────────────┐
       │                 │                  │
       ▼                 ▼                  ▼
  contractor      exhibitor/          freelancer
  organizer                          (individual)
       │                 │                  │
       ▼                 ▼                  │
┌──────────────┐  ┌──────────────┐         │
│Organization  │  │Organization  │         │
│    Step      │  │    Step      │         │
└──────┬───────┘  └──────┬───────┘         │
       │                 │                  │
       │                 │                  ▼
       │                 │          ┌──────────────┐
       │                 │          │  SkillsStep  │
       │                 │          └──────┬───────┘
       │                 │                 │
       └────────┬────────┴─────────────────┘
                │
                ▼
        ┌──────────────┐
        │  PhotoStep   │  5. Загрузка фото (опционально)
        └──────┬───────┘     ↓ onNext()
               │
               ▼
        ┌──────────────┐
        │ SuccessStep  │  6. Завершение регистрации
        └──────┬───────┘     ↓ onComplete()
               │
               ▼
        ┌──────────────┐
        │  HomeScreen  │  7. Главный экран приложения
        └──────────────┘
```

## Детальный поток данных

### 1. PhoneStep
```
User Input: phone number
   ↓
updateData({ phone: "+7..." })
   ↓
API: sendSmsCode(phone)
   ↓
goToNextStep() → CodeStep
```

### 2. CodeStep
```
User Input: verification code
   ↓
updateData({ code: "1234" })
   ↓
API: verifySmsCode(phone, code)
   ↓
┌─────────────────┴──────────────────┐
│                                    │
▼                                    ▼
User exists?                    New user?
│                                    │
onUserExists(user, token)            goToNextStep() → NameStep
│
└→ Call onLogin() → Navigate home
```

### 3. NameStep
```
User Input: lastName, firstName, middleName
User Action: check agreedToTerms, agreedToPersonalData
   ↓
updateData({
  lastName: "...",
  firstName: "...",
  middleName: "...",
  agreedToTerms: true,
  agreedToPersonalData: true
})
   ↓
API: registerUser(...)
   ↓
updateData({ user: {...} })
   ↓
goToNextStep() → RoleStep
```

### 4. RoleStep
```
User Selection: role
   ↓
updateData({ selectedRole: "..." })
   ↓
handleRoleComplete()
   ↓
┌─────────────────┴──────────────────┐
│                                    │
▼                                    ▼
Requires organization?          Individual (freelancer)?
│                                    │
setCurrentStep(organization)         setCurrentStep(skills)
```

### 5a. SkillsStep (для физ. лиц)
```
User Selection: skills (array of IDs)
   ↓
updateData({ selectedSkills: [1, 2, 3] })
   ↓
API: createIndividualContext()
API: updateUserSkills(selectedSkills)
   ↓
setCurrentStep(photo)
```

### 5b. OrganizationStep (для организаций)
```
User Input: INN search
   ↓
API: searchOrganizationByInn(inn)
   ↓
User Selection: organization from results
   ↓
updateData({ selectedOrganization: {...} })
   ↓
API: saveOrganization({
  inn, name, type, ...
})
   ↓
updateData({ needsVerification: true/false })
   ↓
setCurrentStep(photo)
```

### 6. PhotoStep
```
User Action: select photo (camera or gallery)
   ↓
updateData({ photo: File })
   ↓
API: uploadProfilePhoto(photo)
   ↓
goToNextStep() → SuccessStep
```

### 7. SuccessStep
```
User Action: click "Начать"
   ↓
onComplete()
   ↓
Call onLogin(user)
   ↓
Navigator.pushNamedAndRemoveUntil('/', ...)
```

## API вызовы по шагам

| Шаг | API методы | Описание |
|-----|-----------|----------|
| PhoneStep | `sendSmsCode(phone)` | Отправка SMS кода |
| CodeStep | `verifySmsCode(phone, code)` | Проверка кода |
| NameStep | `registerUser(...)` | Регистрация нового пользователя |
| SkillsStep | `createIndividualContext()`<br>`updateUserSkills(skillIds)` | Создание контекста физ. лица<br>Сохранение навыков |
| OrganizationStep | `searchOrganizationByInn(inn)`<br>`saveOrganization(...)` | Поиск организации<br>Сохранение организации |
| PhotoStep | `uploadProfilePhoto(file)` | Загрузка фото профиля |

## Состояние RegistrationData

```dart
RegistrationData {
  phone: String              // Шаг 1
  code: String               // Шаг 2
  lastName: String           // Шаг 3
  firstName: String          // Шаг 3
  middleName: String         // Шаг 3
  agreedToTerms: bool        // Шаг 3
  agreedToPersonalData: bool // Шаг 3
  user: dynamic              // Шаг 3 (после регистрации)
  selectedRole: String?      // Шаг 4
  organizationType: String   // Шаг 4
  selectedSkills: List<int>  // Шаг 5a
  selectedOrganization: OrganizationResult? // Шаг 5b
  needsVerification: bool    // Шаг 5b
  photo: File?               // Шаг 6
}
```

## Условная логика переходов

```dart
handleRoleComplete() {
  const rolesRequiringOrg = ['contractor', 'exhibitor', 'organizer'];

  if (selectedRole in rolesRequiringOrg) {
    // Организация требуется
    currentStep = organization
  } else {
    // Физ. лицо
    currentStep = skills
  }
}
```

## Обработка ошибок

```
┌─────────────┐
│  API Call   │
└──────┬──────┘
       │
   try {
       │
       ▼
   ┌────────────┐
   │  Success   │
   └──────┬─────┘
          │
          ▼
   Update State
   Go to Next Step

   } catch (error) {
       │
       ▼
   ┌──────────────┐
   │ Show SnackBar│
   │  with Error  │
   └──────────────┘
   Stay on current step
   }
```
