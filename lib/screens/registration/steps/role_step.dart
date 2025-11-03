import 'package:flutter/material.dart';

class RoleStep extends StatelessWidget {
  final String? selectedRole;
  final String organizationType;
  final Function(String?) onRoleSelect;
  final Function(String) onOrganizationTypeChange;
  final VoidCallback onNext;
  final VoidCallback onBack;

  const RoleStep({
    Key? key,
    required this.selectedRole,
    required this.organizationType,
    required this.onRoleSelect,
    required this.onOrganizationTypeChange,
    required this.onNext,
    required this.onBack,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final roles = [
      {'value': 'contractor', 'label': 'Подрядчик'},
      {'value': 'exhibitor', 'label': 'Экспонент'},
      {'value': 'organizer', 'label': 'Организатор'},
      {'value': 'freelancer', 'label': 'Исполнитель (физ. лицо)'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Выберите роль'),
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
              'Кем вы являетесь?',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 16),
            ...roles.map((role) {
              return RadioListTile<String>(
                value: role['value']!,
                groupValue: selectedRole,
                onChanged: onRoleSelect,
                title: Text(role['label']!),
              );
            }).toList(),
            const Spacer(),
            ElevatedButton(
              onPressed: selectedRole != null ? onNext : null,
              child: const Text('Продолжить'),
            ),
          ],
        ),
      ),
    );
  }
}
