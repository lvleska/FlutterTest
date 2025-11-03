import 'package:flutter/material.dart';
import '../../../theme/registration_theme.dart';
import '../../../services/api_service.dart';

class SkillsStep extends StatefulWidget {
  final List<int> selectedSkills;
  final Function(List<int>) onSkillsChange;
  final Future<void> Function() onNext;
  final VoidCallback onBack;

  const SkillsStep({
    Key? key,
    required this.selectedSkills,
    required this.onSkillsChange,
    required this.onNext,
    required this.onBack,
  }) : super(key: key);

  @override
  State<SkillsStep> createState() => _SkillsStepState();
}

class _SkillsStepState extends State<SkillsStep> {
  final ApiService _apiService = ApiService();
  List<SkillCategory> _categories = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await _apiService.getSkillCategories();
      final categoriesData = response['categories'] as List;

      setState(() {
        _categories = categoriesData
            .map((cat) => SkillCategory.fromJson(cat))
            .toList();
        _isLoading = false;
      });
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Ошибка загрузки навыков. Попробуйте снова.';
          _isLoading = false;
        });
      }
    }
  }

  Color _getCategoryColor(String color) {
    switch (color.toLowerCase()) {
      case 'orange':
        return const Color(0xFFFF9500);
      case 'purple':
        return const Color(0xFF9B59B6);
      case 'blue':
        return const Color(0xFF3498DB);
      case 'yellow':
        return const Color(0xFFF1C40F);
      case 'green':
        return const Color(0xFF2ECC71);
      default:
        return RegistrationTheme.primaryText;
    }
  }

  void _toggleSkill(int skillId) {
    final newSkills = List<int>.from(widget.selectedSkills);
    if (newSkills.contains(skillId)) {
      newSkills.remove(skillId);
    } else {
      newSkills.add(skillId);
    }
    widget.onSkillsChange(newSkills);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RegistrationTheme.backgroundColor,
      body: RegistrationTheme.buildContent(
        scrollable: false,
        children: [
          const Text(
            'Выберите навыки',
            style: RegistrationTheme.headerStyle,
          ),
          const SizedBox(height: RegistrationTheme.headerBottomMargin),
          const Text(
            'Какими навыками вы обладаете?',
            style: RegistrationTheme.subtitleStyle,
          ),
          const SizedBox(height: RegistrationTheme.subtitleBottomMargin),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              _error!,
                              style: RegistrationTheme.errorStyle,
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 16),
                            TextButton(
                              onPressed: _loadCategories,
                              child: const Text('Попробовать снова'),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        itemCount: _categories.length,
                        itemBuilder: (context, index) {
                          final category = _categories[index];
                          final categoryColor = _getCategoryColor(category.color);

                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Padding(
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 4,
                                      height: 20,
                                      decoration: BoxDecoration(
                                        color: categoryColor,
                                        borderRadius: BorderRadius.circular(2),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      category.title,
                                      style: RegistrationTheme.inputStyle.copyWith(
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              ...category.skills.map((skill) {
                                final isSelected =
                                    widget.selectedSkills.contains(skill.id);

                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 8),
                                  child: InkWell(
                                    onTap: () => _toggleSkill(skill.id),
                                    borderRadius: BorderRadius.circular(8),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                        vertical: 12,
                                      ),
                                      decoration: BoxDecoration(
                                        color: isSelected
                                            ? categoryColor.withOpacity(0.1)
                                            : Colors.transparent,
                                        border: Border.all(
                                          color: isSelected
                                              ? categoryColor
                                              : RegistrationTheme.inputBorder,
                                          width: 1,
                                        ),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        children: [
                                          Container(
                                            width: 20,
                                            height: 20,
                                            decoration: BoxDecoration(
                                              border: Border.all(
                                                color: isSelected
                                                    ? categoryColor
                                                    : RegistrationTheme.inputBorder,
                                                width: 2,
                                              ),
                                              borderRadius: BorderRadius.circular(4),
                                              color: isSelected
                                                  ? categoryColor
                                                  : Colors.transparent,
                                            ),
                                            child: isSelected
                                                ? const Icon(
                                                    Icons.check,
                                                    size: 14,
                                                    color: Colors.white,
                                                  )
                                                : null,
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Text(
                                              skill.name,
                                              style: RegistrationTheme.inputStyle,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              }).toList(),
                              const SizedBox(height: 8),
                            ],
                          );
                        },
                      ),
          ),
          const SizedBox(height: RegistrationTheme.buttonTopMargin),
          ElevatedButton(
            onPressed: _isLoading ? null : () async => await widget.onNext(),
            style: RegistrationTheme.getButtonStyle(enabled: !_isLoading),
            child: const Text('Продолжить'),
          ),
        ],
      ),
    );
  }
}

// Models for skill categories
class SkillCategory {
  final String id;
  final String title;
  final String color;
  final List<Skill> skills;

  SkillCategory({
    required this.id,
    required this.title,
    required this.color,
    required this.skills,
  });

  factory SkillCategory.fromJson(Map<String, dynamic> json) {
    return SkillCategory(
      id: json['id'],
      title: json['title'],
      color: json['color'],
      skills: (json['skills'] as List)
          .map((skill) => Skill.fromJson(skill))
          .toList(),
    );
  }
}

class Skill {
  final int id;
  final String name;
  final String categoryId;

  Skill({
    required this.id,
    required this.name,
    required this.categoryId,
  });

  factory Skill.fromJson(Map<String, dynamic> json) {
    return Skill(
      id: json['id'],
      name: json['name'],
      categoryId: json['categoryId'],
    );
  }
}
