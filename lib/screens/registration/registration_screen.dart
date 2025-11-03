import 'package:flutter/material.dart';
import '../../models/registration_data.dart';
import '../../services/api_service.dart';
import './steps/phone_step.dart';
import './steps/code_step.dart';
import './steps/name_step.dart';
import './steps/role_step.dart';
import './steps/skills_step.dart';
import './steps/organization_step.dart';
import './steps/photo_step.dart';
import './steps/success_step.dart';

class RegistrationScreen extends StatefulWidget {
  final Function(dynamic user)? onLogin;

  const RegistrationScreen({
    Key? key,
    this.onLogin,
  }) : super(key: key);

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  RegistrationStep _currentStep = RegistrationStep.phone;
  late RegistrationData _registrationData;
  final ApiService _apiService = ApiService();

  @override
  void initState() {
    super.initState();
    _registrationData = RegistrationData();

    // Debug: track currentStep changes
    debugPrint('Initial step: ${_currentStep.name}');
  }

  void _updateData(RegistrationData Function(RegistrationData) update) {
    setState(() {
      _registrationData = update(_registrationData);
    });
  }

  void _goToNextStep() {
    final steps = RegistrationStep.values;
    final currentIndex = steps.indexOf(_currentStep);
    if (currentIndex < steps.length - 1) {
      setState(() {
        _currentStep = steps[currentIndex + 1];
        debugPrint('Current step changed to: ${_currentStep.name}');
      });
    }
  }

  void _goToPrevStep() {
    final steps = RegistrationStep.values;
    final currentIndex = steps.indexOf(_currentStep);
    if (currentIndex > 0) {
      setState(() {
        _currentStep = steps[currentIndex - 1];
        debugPrint('Current step changed to: ${_currentStep.name}');
      });
    }
  }

  void _handleUserExists(dynamic user, String token) {
    if (widget.onLogin != null) {
      widget.onLogin!(user);
    }
  }

  void _handleRoleComplete() {
    // Check if organization is required for selected role
    const rolesRequiringOrg = ['contractor', 'exhibitor', 'organizer'];
    final needsOrg = _registrationData.selectedRole != null &&
        rolesRequiringOrg.contains(_registrationData.selectedRole);

    setState(() {
      if (needsOrg) {
        // If role requires organization - go to organization search
        _currentStep = RegistrationStep.organization;
      } else {
        // If individual (freelancer) - go to skills selection
        _currentStep = RegistrationStep.skills;
      }
      debugPrint('Current step changed to: ${_currentStep.name}');
    });
  }

  Future<void> _handleSkillsComplete() async {
    try {
      // Create individual context (replaces old isFreelancer flag)
      await _apiService.createIndividualContext();

      // Save skills if user selected any
      if (_registrationData.selectedSkills.isNotEmpty) {
        await _apiService.updateUserSkills(_registrationData.selectedSkills);
      }

      // After saving skills go to photo screen
      setState(() {
        _currentStep = RegistrationStep.photo;
        debugPrint('Current step changed to: ${_currentStep.name}');
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

  Future<void> _handleOrganizationComplete() async {
    try {
      // Create organization context
      if (_registrationData.selectedOrganization != null) {
        final selectedOrg = _registrationData.selectedOrganization!;
        final result = await _apiService.createOrganizationContext(
          inn: selectedOrg.inn,
          name: selectedOrg.name,
          organizationType: _registrationData.selectedRole ?? 'contractor',
          managementName: selectedOrg.management?.name,
          shortName: selectedOrg.shortName,
          kpp: selectedOrg.kpp,
          ogrn: selectedOrg.ogrn,
          address: selectedOrg.address,
          phone: selectedOrg.phone,
          email: selectedOrg.email,
        );

        _updateData((data) => data.copyWith(
          needsVerification: result['needsVerification'] ?? false,
        ));

        if (result['needsVerification'] == true) {
          debugPrint('Verification deferred; proceeding to photo step');
        } else {
          debugPrint('Going to photo step');
        }
      }

      setState(() {
        _currentStep = RegistrationStep.photo;
        debugPrint('Current step changed to: ${_currentStep.name}');
      });
    } catch (error) {
      debugPrint('Organization step failed: $error');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Ошибка сохранения организации. Попробуйте снова.'),
          ),
        );
      }
    }
  }

  Future<void> _handlePhotoComplete() async {
    try {
      // Upload photo if exists
      if (_registrationData.photo != null) {
        await _apiService.uploadProfilePhoto(_registrationData.photo!);
      }

      _goToNextStep(); // Transition to success
    } catch (error) {
      debugPrint('Photo upload failed: $error');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Ошибка завершения регистрации. Попробуйте снова.'),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: _buildCurrentStep(),
      ),
    );
  }

  Widget _buildCurrentStep() {
    switch (_currentStep) {
      case RegistrationStep.phone:
        return PhoneStep(
          phone: _registrationData.phone,
          onPhoneChange: (phone) {
            _updateData((data) => data.copyWith(phone: phone));
          },
          onNext: _goToNextStep,
          onBack: () => Navigator.of(context).pop(),
        );

      case RegistrationStep.code:
        return CodeStep(
          phone: _registrationData.phone,
          code: _registrationData.code,
          onCodeChange: (code) {
            _updateData((data) => data.copyWith(code: code));
          },
          onNext: _goToNextStep,
          onBack: _goToPrevStep,
          onUserExists: _handleUserExists,
        );

      case RegistrationStep.name:
        return NameStep(
          lastName: _registrationData.lastName,
          firstName: _registrationData.firstName,
          middleName: _registrationData.middleName,
          agreedToTerms: _registrationData.agreedToTerms,
          agreedToPersonalData: _registrationData.agreedToPersonalData,
          phone: _registrationData.phone,
          onLastNameChange: (lastName) {
            _updateData((data) => data.copyWith(lastName: lastName));
          },
          onFirstNameChange: (firstName) {
            _updateData((data) => data.copyWith(firstName: firstName));
          },
          onMiddleNameChange: (middleName) {
            _updateData((data) => data.copyWith(middleName: middleName));
          },
          onAgreedChange: (agreedToTerms) {
            _updateData((data) => data.copyWith(agreedToTerms: agreedToTerms));
          },
          onAgreedPersonalDataChange: (agreedToPersonalData) {
            _updateData((data) =>
                data.copyWith(agreedToPersonalData: agreedToPersonalData));
          },
          onNext: (user) {
            _updateData((data) => data.copyWith(user: user));
            _goToNextStep();
          },
          onBack: _goToPrevStep,
        );

      case RegistrationStep.role:
        return RoleStep(
          selectedRole: _registrationData.selectedRole,
          organizationType: _registrationData.organizationType,
          onRoleSelect: (selectedRole) {
            _updateData((data) => data.copyWith(selectedRole: selectedRole));
          },
          onOrganizationTypeChange: (organizationType) {
            _updateData(
                (data) => data.copyWith(organizationType: organizationType));
          },
          onNext: _handleRoleComplete,
          onBack: _goToPrevStep,
        );

      case RegistrationStep.skills:
        return SkillsStep(
          selectedSkills: _registrationData.selectedSkills,
          onSkillsChange: (selectedSkills) {
            _updateData((data) => data.copyWith(selectedSkills: selectedSkills));
          },
          onNext: _handleSkillsComplete,
          onBack: _goToPrevStep,
        );

      case RegistrationStep.organization:
        return OrganizationStep(
          selectedOrganization: _registrationData.selectedOrganization,
          onOrganizationSelect: (selectedOrganization) {
            _updateData((data) =>
                data.copyWith(selectedOrganization: selectedOrganization));
          },
          onNext: _handleOrganizationComplete,
          onBack: _goToPrevStep,
        );

      case RegistrationStep.photo:
        return PhotoStep(
          photo: _registrationData.photo,
          onPhotoChange: (photo) {
            _updateData((data) => data.copyWith(photo: photo));
          },
          onNext: _handlePhotoComplete,
        );

      case RegistrationStep.success:
        return SuccessStep(
          onComplete: () {
            // Call onLogin only at the end of the whole process
            if (widget.onLogin != null && _registrationData.user != null) {
              widget.onLogin!(_registrationData.user);
            }
            // Navigate to main app
            Navigator.of(context).pushNamedAndRemoveUntil('/', (route) => false);
          },
        );
    }
  }
}
