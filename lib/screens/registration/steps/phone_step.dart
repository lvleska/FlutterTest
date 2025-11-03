import 'package:flutter/material.dart';

class PhoneStep extends StatelessWidget {
  final String phone;
  final Function(String) onPhoneChange;
  final VoidCallback onNext;
  final VoidCallback onBack;

  const PhoneStep({
    Key? key,
    required this.phone,
    required this.onPhoneChange,
    required this.onNext,
    required this.onBack,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Введите номер телефона'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: onBack,
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Номер телефона',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 8),
            TextField(
              decoration: const InputDecoration(
                hintText: '+7 (___) ___-__-__',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.phone,
              onChanged: onPhoneChange,
              controller: TextEditingController(text: phone)
                ..selection = TextSelection.collapsed(offset: phone.length),
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: phone.isNotEmpty ? onNext : null,
              child: const Text('Продолжить'),
            ),
          ],
        ),
      ),
    );
  }
}
