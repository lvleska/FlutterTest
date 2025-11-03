import 'package:flutter/material.dart';

class CodeStep extends StatelessWidget {
  final String phone;
  final String code;
  final Function(String) onCodeChange;
  final VoidCallback onNext;
  final VoidCallback onBack;
  final Function(dynamic user, String token) onUserExists;

  const CodeStep({
    Key? key,
    required this.phone,
    required this.code,
    required this.onCodeChange,
    required this.onNext,
    required this.onBack,
    required this.onUserExists,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Введите код'),
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
            Text(
              'Код отправлен на номер $phone',
              style: const TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 16),
            TextField(
              decoration: const InputDecoration(
                hintText: '____',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              maxLength: 4,
              onChanged: onCodeChange,
              controller: TextEditingController(text: code)
                ..selection = TextSelection.collapsed(offset: code.length),
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: code.length == 4 ? onNext : null,
              child: const Text('Подтвердить'),
            ),
          ],
        ),
      ),
    );
  }
}
