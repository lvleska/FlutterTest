import 'package:flutter/material.dart';
import '../../../theme/registration_theme.dart';

class SuccessStep extends StatelessWidget {
  final VoidCallback onComplete;

  const SuccessStep({
    Key? key,
    required this.onComplete,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RegistrationTheme.backgroundColor,
      body: RegistrationTheme.buildContent(
        scrollable: false,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Spacer(),
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: const Color(0xFF2ECC71).withOpacity(0.1),
            ),
            child: const Icon(
              Icons.check_circle,
              size: 80,
              color: Color(0xFF2ECC71),
            ),
          ),
          const SizedBox(height: 32),
          const Text(
            'Регистрация завершена!',
            style: RegistrationTheme.headerStyle,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          const Text(
            'Добро пожаловать в приложение',
            style: RegistrationTheme.subtitleStyle,
            textAlign: TextAlign.center,
          ),
          const Spacer(),
          ElevatedButton(
            onPressed: onComplete,
            style: RegistrationTheme.getButtonStyle(),
            child: const Text('Начать'),
          ),
        ],
      ),
    );
  }
}
