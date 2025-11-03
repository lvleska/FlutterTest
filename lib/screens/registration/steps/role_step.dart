import 'package:flutter/material.dart';
import '../../../theme/registration_theme.dart';

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
      {'value': 'contractor', 'label': 'Подрядчик', 'subtitle': 'Организация-подрядчик'},
      {'value': 'exhibitor', 'label': 'Экспонент', 'subtitle': 'Участник выставки'},
      {'value': 'organizer', 'label': 'Организатор', 'subtitle': 'Организатор мероприятий'},
      {'value': 'freelancer', 'label': 'Исполнитель', 'subtitle': 'Физическое лицо'},
    ];

    return Scaffold(
      backgroundColor: RegistrationTheme.backgroundColor,
      body: RegistrationTheme.buildContent(
        scrollable: false,
        children: [
          const Text(
            'Выберите роль',
            style: RegistrationTheme.headerStyle,
          ),
          const SizedBox(height: RegistrationTheme.headerBottomMargin),
          const Text(
            'Кем вы являетесь?',
            style: RegistrationTheme.subtitleStyle,
          ),
          const SizedBox(height: RegistrationTheme.subtitleBottomMargin),
          ...roles.map((role) {
            final isSelected = selectedRole == role['value'];
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: InkWell(
                onTap: () => onRoleSelect(role['value']),
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: isSelected
                          ? RegistrationTheme.primaryText
                          : RegistrationTheme.inputBorder,
                      width: isSelected ? 2 : 1,
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 20,
                        height: 20,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: isSelected
                                ? RegistrationTheme.primaryText
                                : RegistrationTheme.inputBorder,
                            width: 2,
                          ),
                        ),
                        child: isSelected
                            ? Center(
                                child: Container(
                                  width: 10,
                                  height: 10,
                                  decoration: const BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: RegistrationTheme.primaryText,
                                  ),
                                ),
                              )
                            : null,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              role['label']!,
                              style: RegistrationTheme.inputStyle.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              role['subtitle']!,
                              style: RegistrationTheme.labelStyle,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
          const Spacer(),
          ElevatedButton(
            onPressed: selectedRole != null ? onNext : null,
            style: RegistrationTheme.getButtonStyle(enabled: selectedRole != null),
            child: const Text('Продолжить'),
          ),
        ],
      ),
    );
  }
}
