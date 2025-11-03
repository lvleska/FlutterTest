import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../theme/registration_theme.dart';
import '../../../services/api_service.dart';

class PhoneStep extends StatefulWidget {
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
  State<PhoneStep> createState() => _PhoneStepState();
}

class _PhoneStepState extends State<PhoneStep> {
  final ApiService _apiService = ApiService();
  late TextEditingController _controller;
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.phone);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _getPhoneDigits() {
    return _controller.text.replaceAll(RegExp(r'[^\d]'), '');
  }

  bool _isValidPhone() {
    final digits = _getPhoneDigits();
    return digits.length == 11 && digits.startsWith('7');
  }

  Future<void> _handleNext() async {
    if (!_isValidPhone()) {
      setState(() {
        _error = 'Введите корректный номер телефона';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final phoneDigits = _getPhoneDigits().substring(1); // Remove leading 7
      final fullPhone = '+7$phoneDigits';

      await _apiService.sendSmsCode(fullPhone);

      widget.onPhoneChange(fullPhone);
      widget.onNext();
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Ошибка отправки кода. Попробуйте снова.';
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
        scrollable: false,
        children: [
          const Text(
            'Номер телефона',
            style: RegistrationTheme.headerStyle,
          ),
          const SizedBox(height: RegistrationTheme.headerBottomMargin),
          const Text(
            'Введите ваш номер телефона для входа или регистрации',
            style: RegistrationTheme.subtitleStyle,
          ),
          const SizedBox(height: RegistrationTheme.subtitleBottomMargin),
          TextField(
            controller: _controller,
            decoration: RegistrationTheme.getInputDecoration(
              label: 'Телефон',
              hint: '+7 (___) ___-__-__',
              error: _error,
            ),
            keyboardType: TextInputType.phone,
            style: RegistrationTheme.inputStyle,
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(11),
            ],
            onChanged: (value) {
              setState(() {
                _error = null;
              });
              widget.onPhoneChange('+$value');
            },
          ),
          const Spacer(),
          ElevatedButton(
            onPressed: _isLoading ? null : _handleNext,
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
}
