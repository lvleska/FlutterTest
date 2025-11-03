import 'package:flutter/material.dart';

class SkillsStep extends StatelessWidget {
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
  Widget build(BuildContext context) {
    // Mock skills data - replace with API call
    final skills = [
      {'id': 1, 'name': 'Дизайн'},
      {'id': 2, 'name': 'Разработка'},
      {'id': 3, 'name': 'Маркетинг'},
      {'id': 4, 'name': 'Контент'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Выберите навыки'),
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
              'Какими навыками вы обладаете?',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView(
                children: skills.map((skill) {
                  final skillId = skill['id'] as int;
                  final isSelected = selectedSkills.contains(skillId);

                  return CheckboxListTile(
                    value: isSelected,
                    onChanged: (value) {
                      final newSkills = List<int>.from(selectedSkills);
                      if (value == true) {
                        newSkills.add(skillId);
                      } else {
                        newSkills.remove(skillId);
                      }
                      onSkillsChange(newSkills);
                    },
                    title: Text(skill['name'] as String),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () async {
                await onNext();
              },
              child: const Text('Продолжить'),
            ),
          ],
        ),
      ),
    );
  }
}
