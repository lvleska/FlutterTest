import 'package:flutter/material.dart';
import '../../../models/registration_data.dart';

class OrganizationStep extends StatelessWidget {
  final OrganizationResult? selectedOrganization;
  final Function(OrganizationResult?) onOrganizationSelect;
  final Future<void> Function() onNext;
  final VoidCallback onBack;

  const OrganizationStep({
    Key? key,
    required this.selectedOrganization,
    required this.onOrganizationSelect,
    required this.onNext,
    required this.onBack,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Организация'),
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
              'Поиск организации по ИНН',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 16),
            TextField(
              decoration: const InputDecoration(
                labelText: 'ИНН организации',
                hintText: '0000000000',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              maxLength: 12,
              onChanged: (value) {
                // TODO: Implement organization search by INN
              },
            ),
            const SizedBox(height: 16),
            if (selectedOrganization != null) ...[
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        selectedOrganization!.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text('ИНН: ${selectedOrganization!.inn}'),
                      if (selectedOrganization!.address != null)
                        Text('Адрес: ${selectedOrganization!.address}'),
                    ],
                  ),
                ),
              ),
            ],
            const Spacer(),
            ElevatedButton(
              onPressed: selectedOrganization != null
                  ? () async {
                      await onNext();
                    }
                  : null,
              child: const Text('Продолжить'),
            ),
          ],
        ),
      ),
    );
  }
}
