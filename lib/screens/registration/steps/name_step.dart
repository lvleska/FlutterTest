import 'package:flutter/material.dart';

class NameStep extends StatelessWidget {
  final String lastName;
  final String firstName;
  final String middleName;
  final bool agreedToTerms;
  final bool agreedToPersonalData;
  final String phone;
  final Function(String) onLastNameChange;
  final Function(String) onFirstNameChange;
  final Function(String) onMiddleNameChange;
  final Function(bool) onAgreedChange;
  final Function(bool) onAgreedPersonalDataChange;
  final Function(dynamic user) onNext;
  final VoidCallback onBack;

  const NameStep({
    Key? key,
    required this.lastName,
    required this.firstName,
    required this.middleName,
    required this.agreedToTerms,
    required this.agreedToPersonalData,
    required this.phone,
    required this.onLastNameChange,
    required this.onFirstNameChange,
    required this.onMiddleNameChange,
    required this.onAgreedChange,
    required this.onAgreedPersonalDataChange,
    required this.onNext,
    required this.onBack,
  }) : super(key: key);

  bool get _isFormValid =>
      lastName.isNotEmpty &&
      firstName.isNotEmpty &&
      agreedToTerms &&
      agreedToPersonalData;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Личные данные'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: onBack,
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              decoration: const InputDecoration(
                labelText: 'Фамилия*',
                border: OutlineInputBorder(),
              ),
              onChanged: onLastNameChange,
              controller: TextEditingController(text: lastName)
                ..selection = TextSelection.collapsed(offset: lastName.length),
            ),
            const SizedBox(height: 16),
            TextField(
              decoration: const InputDecoration(
                labelText: 'Имя*',
                border: OutlineInputBorder(),
              ),
              onChanged: onFirstNameChange,
              controller: TextEditingController(text: firstName)
                ..selection = TextSelection.collapsed(offset: firstName.length),
            ),
            const SizedBox(height: 16),
            TextField(
              decoration: const InputDecoration(
                labelText: 'Отчество',
                border: OutlineInputBorder(),
              ),
              onChanged: onMiddleNameChange,
              controller: TextEditingController(text: middleName)
                ..selection =
                    TextSelection.collapsed(offset: middleName.length),
            ),
            const SizedBox(height: 24),
            CheckboxListTile(
              value: agreedToTerms,
              onChanged: (value) => onAgreedChange(value ?? false),
              title: const Text('Я согласен с условиями использования'),
              controlAffinity: ListTileControlAffinity.leading,
              contentPadding: EdgeInsets.zero,
            ),
            CheckboxListTile(
              value: agreedToPersonalData,
              onChanged: (value) => onAgreedPersonalDataChange(value ?? false),
              title: const Text('Я согласен на обработку персональных данных'),
              controlAffinity: ListTileControlAffinity.leading,
              contentPadding: EdgeInsets.zero,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isFormValid ? () => onNext(null) : null,
              child: const Text('Продолжить'),
            ),
          ],
        ),
      ),
    );
  }
}
