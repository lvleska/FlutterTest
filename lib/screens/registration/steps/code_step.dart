import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../theme/registration_theme.dart';
import '../../../services/api_service.dart';

class CodeStep extends StatefulWidget {
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
  State<CodeStep> createState() => _CodeStepState();
}

class _CodeStepState extends State<CodeStep> {
  final ApiService _apiService = ApiService();
  late TextEditingController _controller;
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.code);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _handleVerify() async {
    if (_controller.text.length != 4) {
      setState(() {
        _error = 'Введите 4-значный код';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await _apiService.verifyCode(
        widget.phone,
        _controller.text,
      );

      if (response['exists'] == true &&
          response['user'] != null &&
          response['token'] != null) {
        // User already exists, log them in
        widget.onUserExists(response['user'], response['token']);
      } else {
        // New user, continue registration
        widget.onCodeChange(_controller.text);
        widget.onNext();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Неверный код. Попробуйте снова.';
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
            'Код подтверждения',
            style: RegistrationTheme.headerStyle,
          ),
          const SizedBox(height: RegistrationTheme.headerBottomMargin),
          Text(
            'Код отправлен на номер ${widget.phone}',
            style: RegistrationTheme.subtitleStyle,
          ),
          const SizedBox(height: RegistrationTheme.subtitleBottomMargin),
          TextField(
            controller: _controller,
            decoration: RegistrationTheme.getInputDecoration(
              label: 'Код из SMS',
              hint: '____',
              error: _error,
            ),
            keyboardType: TextInputType.number,
            style: RegistrationTheme.inputStyle,
            maxLength: 4,
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(4),
            ],
            onChanged: (value) {
              setState(() {
                _error = null;
              });
              widget.onCodeChange(value);
            },
            onSubmitted: (_) {
              if (_controller.text.length == 4) {
                _handleVerify();
              }
            },
          ),
          const Spacer(),
          ElevatedButton(
            onPressed: _isLoading ? null : _handleVerify,
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
                : const Text('Подтвердить'),
          ),
          const SizedBox(height: RegistrationTheme.buttonTopMargin),
          Center(
            child: TextButton(
              onPressed: widget.onBack,
              child: const Text(
                'Изменить номер',
                style: RegistrationTheme.linkStyle,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
