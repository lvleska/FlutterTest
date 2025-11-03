import 'package:flutter/material.dart';
import '../../../theme/registration_theme.dart';
import '../../../services/api_service.dart';

class NameStep extends StatefulWidget {
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

  @override
  State<NameStep> createState() => _NameStepState();
}

class _NameStepState extends State<NameStep> {
  final ApiService _apiService = ApiService();
  late TextEditingController _lastNameController;
  late TextEditingController _firstNameController;
  late TextEditingController _middleNameController;
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _lastNameController = TextEditingController(text: widget.lastName);
    _firstNameController = TextEditingController(text: widget.firstName);
    _middleNameController = TextEditingController(text: widget.middleName);
  }

  @override
  void dispose() {
    _lastNameController.dispose();
    _firstNameController.dispose();
    _middleNameController.dispose();
    super.dispose();
  }

  bool get _isFormValid =>
      _lastNameController.text.isNotEmpty &&
      _firstNameController.text.isNotEmpty &&
      widget.agreedToTerms &&
      widget.agreedToPersonalData;

  Future<void> _handleRegister() async {
    if (!_isFormValid) {
      setState(() {
        _error = 'Заполните обязательные поля и примите условия';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await _apiService.register(
        phone: widget.phone,
        firstName: _firstNameController.text,
        lastName: _lastNameController.text,
        middleName: _middleNameController.text.isNotEmpty
            ? _middleNameController.text
            : null,
      );

      widget.onNext(response['user']);
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Ошибка регистрации. Попробуйте снова.';
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RegistrationTheme.backgroundColor,
      body: RegistrationTheme.buildContent(
        scrollable: true,
        children: [
          const Text(
            'Личные данные',
            style: RegistrationTheme.headerStyle,
          ),
          const SizedBox(height: RegistrationTheme.headerBottomMargin),
          const Text(
            'Заполните ваши данные для завершения регистрации',
            style: RegistrationTheme.subtitleStyle,
          ),
          const SizedBox(height: RegistrationTheme.subtitleBottomMargin),
          TextField(
            controller: _lastNameController,
            decoration: RegistrationTheme.getInputDecoration(
              label: 'Фамилия*',
            ),
            style: RegistrationTheme.inputStyle,
            textCapitalization: TextCapitalization.words,
            onChanged: widget.onLastNameChange,
          ),
          const SizedBox(height: RegistrationTheme.inputGroupBottomMargin),
          TextField(
            controller: _firstNameController,
            decoration: RegistrationTheme.getInputDecoration(
              label: 'Имя*',
            ),
            style: RegistrationTheme.inputStyle,
            textCapitalization: TextCapitalization.words,
            onChanged: widget.onFirstNameChange,
          ),
          const SizedBox(height: RegistrationTheme.inputGroupBottomMargin),
          TextField(
            controller: _middleNameController,
            decoration: RegistrationTheme.getInputDecoration(
              label: 'Отчество',
            ),
            style: RegistrationTheme.inputStyle,
            textCapitalization: TextCapitalization.words,
            onChanged: widget.onMiddleNameChange,
          ),
          const SizedBox(height: RegistrationTheme.checkboxTopMargin),
          _buildCheckbox(
            value: widget.agreedToTerms,
            onChanged: widget.onAgreedChange,
            text: 'Я согласен с условиями использования',
          ),
          const SizedBox(height: 12),
          _buildCheckbox(
            value: widget.agreedToPersonalData,
            onChanged: widget.onAgreedPersonalDataChange,
            text: 'Я согласен на обработку персональных данных',
          ),
          if (_error != null) ...[
            const SizedBox(height: 16),
            Text(
              _error!,
              style: RegistrationTheme.errorStyle,
            ),
          ],
          const SizedBox(height: RegistrationTheme.buttonTopMargin),
          ElevatedButton(
            onPressed: _isLoading ? null : _handleRegister,
            style: RegistrationTheme.getButtonStyle(enabled: !_isLoading),
            child: _isLoading
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        RegistrationTheme.buttonText,
                      ),
                    ),
                  )
                : const Text('Продолжить'),
          ),
        ],
      ),
    );
  }

  Widget _buildCheckbox({
    required bool value,
    required Function(bool) onChanged,
    required String text,
  }) {
    return InkWell(
      onTap: () => onChanged(!value),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 24,
            height: 24,
            child: Checkbox(
              value: value,
              onChanged: (val) => onChanged(val ?? false),
              fillColor: MaterialStateProperty.resolveWith<Color>((states) {
                if (states.contains(MaterialState.selected)) {
                  return RegistrationTheme.primaryText;
                }
                return Colors.transparent;
              }),
              checkColor: RegistrationTheme.buttonText,
              side: const BorderSide(
                color: RegistrationTheme.inputBorder,
                width: 1.5,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: RegistrationTheme.checkboxTextStyle,
            ),
          ),
        ],
      ),
    );
  }
}
