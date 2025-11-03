# Сравнение React и Flutter реализаций

## Управление состоянием

### React (TypeScript)
```typescript
const [currentStep, setCurrentStep] = useState<RegistrationStep>('phone');
const [registrationData, setRegistrationData] = useState<RegistrationData>({
  phone: '',
  code: '',
  // ...
});

const updateData = (data: Partial<RegistrationData>) => {
  setRegistrationData(prev => ({ ...prev, ...data }));
};
```

### Flutter (Dart)
```dart
class _RegistrationScreenState extends State<RegistrationScreen> {
  RegistrationStep _currentStep = RegistrationStep.phone;
  late RegistrationData _registrationData;

  @override
  void initState() {
    super.initState();
    _registrationData = RegistrationData();
  }

  void _updateData(RegistrationData Function(RegistrationData) update) {
    setState(() {
      _registrationData = update(_registrationData);
    });
  }
}
```

## Навигация между шагами

### React (TypeScript)
```typescript
const goToNextStep = () => {
  const steps: RegistrationStep[] = ['phone', 'code', 'name', ...];
  const currentIndex = steps.indexOf(currentStep);
  if (currentIndex < steps.length - 1) {
    setCurrentStep(steps[currentIndex + 1]);
  }
};

// Условный рендеринг
return (
  <div style={styles.container}>
    {currentStep === 'phone' && <PhoneStep ... />}
    {currentStep === 'code' && <CodeStep ... />}
    {currentStep === 'name' && <NameStep ... />}
  </div>
);
```

### Flutter (Dart)
```dart
void _goToNextStep() {
  final steps = RegistrationStep.values;
  final currentIndex = steps.indexOf(_currentStep);
  if (currentIndex < steps.length - 1) {
    setState(() {
      _currentStep = steps[currentIndex + 1];
    });
  }
}

// Switch в методе build
Widget _buildCurrentStep() {
  switch (_currentStep) {
    case RegistrationStep.phone:
      return PhoneStep(...);
    case RegistrationStep.code:
      return CodeStep(...);
    case RegistrationStep.name:
      return NameStep(...);
  }
}
```

## Модели данных

### React (TypeScript)
```typescript
interface OrganizationResult {
  inn: string;
  name: string;
  shortName?: string;
  kpp?: string;
  // ...
}

interface RegistrationData {
  phone: string;
  code: string;
  lastName: string;
  // ...
}

type RegistrationStep = 'phone' | 'code' | 'name' | 'role' | ...;
```

### Flutter (Dart)
```dart
class OrganizationResult {
  final String inn;
  final String name;
  final String? shortName;
  final String? kpp;
  // ...

  OrganizationResult({
    required this.inn,
    required this.name,
    this.shortName,
    this.kpp,
  });
}

class RegistrationData {
  String phone;
  String code;
  String lastName;
  // ...

  RegistrationData copyWith({...}) { ... }
}

enum RegistrationStep {
  phone,
  code,
  name,
  role,
  // ...
}
```

## Передача данных в дочерние компоненты

### React (TypeScript)
```typescript
<PhoneStep
  phone={registrationData.phone}
  onPhoneChange={(phone) => updateData({ phone })}
  onNext={goToNextStep}
  onBack={() => window.history.back()}
/>
```

### Flutter (Dart)
```dart
PhoneStep(
  phone: _registrationData.phone,
  onPhoneChange: (phone) {
    _updateData((data) => data.copyWith(phone: phone));
  },
  onNext: _goToNextStep,
  onBack: () => Navigator.of(context).pop(),
)
```

## Жизненный цикл компонента

### React (TypeScript)
```typescript
useEffect(() => {
  console.log('Current step changed to:', currentStep);
}, [currentStep]);

useEffect(() => {
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVH();
  window.addEventListener('resize', setVH);
  return () => window.removeEventListener('resize', setVH);
}, []);
```

### Flutter (Dart)
```dart
@override
void initState() {
  super.initState();
  debugPrint('Initial step: ${_currentStep.name}');
}

@override
void didUpdateWidget(RegistrationScreen oldWidget) {
  super.didUpdateWidget(oldWidget);
  // Реакция на изменения
}

@override
void dispose() {
  // Очистка ресурсов
  super.dispose();
}
```

## Обработка асинхронных операций

### React (TypeScript)
```typescript
const handleSkillsComplete = async () => {
  try {
    await apiService.createIndividualContext();
    if (registrationData.selectedSkills.length > 0) {
      await apiService.updateUserSkills(registrationData.selectedSkills);
    }
    setCurrentStep('photo');
  } catch (error) {
    console.error('Skills save failed:', error);
    alert('Ошибка сохранения навыков. Попробуйте снова.');
  }
};
```

### Flutter (Dart)
```dart
Future<void> _handleSkillsComplete() async {
  try {
    await _apiService.createIndividualContext();
    if (_registrationData.selectedSkills.isNotEmpty) {
      await _apiService.updateUserSkills(_registrationData.selectedSkills);
    }
    setState(() {
      _currentStep = RegistrationStep.photo;
    });
  } catch (error) {
    debugPrint('Skills save failed: $error');
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Ошибка сохранения навыков. Попробуйте снова.'),
        ),
      );
    }
  }
}
```

## API сервис

### React (TypeScript)
```typescript
export const apiService = {
  async createIndividualContext(): Promise<void> {
    const response = await fetch(`${API_URL}/context/individual`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to create context');
    }
  },
};
```

### Flutter (Dart)
```dart
class ApiService {
  static const String baseUrl = 'https://api.example.com';
  String? _authToken;

  Future<void> createIndividualContext() async {
    final response = await http.post(
      Uri.parse('$baseUrl/user/context/individual'),
      headers: _getHeaders(),
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to create individual context');
    }
  }

  Map<String, String> _getHeaders() {
    final headers = {'Content-Type': 'application/json'};
    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    return headers;
  }
}
```

## Формы и инпуты

### React (TypeScript)
```typescript
<input
  type="text"
  value={registrationData.phone}
  onChange={(e) => updateData({ phone: e.target.value })}
  placeholder="+7 (___) ___-__-__"
/>
```

### Flutter (Dart)
```dart
TextField(
  decoration: const InputDecoration(
    hintText: '+7 (___) ___-__-__',
    border: OutlineInputBorder(),
  ),
  keyboardType: TextInputType.phone,
  onChanged: onPhoneChange,
  controller: TextEditingController(text: phone)
    ..selection = TextSelection.collapsed(offset: phone.length),
)
```

## Стилизация

### React (TypeScript)
```typescript
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
};

<div style={styles.container}>...</div>
```

### Flutter (Dart)
```dart
// Стили применяются через свойства виджетов
Container(
  color: Colors.white,
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [...],
  ),
)

// Или через Theme
Theme(
  data: ThemeData(
    primarySwatch: Colors.blue,
    scaffoldBackgroundColor: Colors.white,
  ),
  child: ...,
)
```

## Основные различия

| Аспект | React/TypeScript | Flutter/Dart |
|--------|------------------|--------------|
| **Язык** | TypeScript (типизированный JavaScript) | Dart |
| **Парадигма** | Функциональные компоненты + Hooks | Объектно-ориентированные виджеты |
| **Обновление UI** | Virtual DOM + reconciliation | Widget tree + rebuild |
| **Типизация** | Опциональная, через TypeScript | Встроенная в язык |
| **Null safety** | `?` опциональные типы | `?` nullable types (null safety) |
| **Асинхронность** | Promises, async/await | Future, async/await |
| **Состояние** | useState, useReducer, Context | setState, Provider, Bloc |
| **Стили** | CSS, CSS-in-JS | Widget properties, Theme |
| **Навигация** | React Router | Navigator + MaterialPageRoute |
| **Сборка** | npm/webpack | Flutter build system |
| **Hot reload** | Fast Refresh | Hot Reload / Hot Restart |
