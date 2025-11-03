import 'package:flutter/material.dart';
import '../../../theme/registration_theme.dart';
import '../../../models/registration_data.dart';
import '../../../services/api_service.dart';

class OrganizationStep extends StatefulWidget {
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
  State<OrganizationStep> createState() => _OrganizationStepState();
}

class _OrganizationStepState extends State<OrganizationStep> {
  final ApiService _apiService = ApiService();
  final TextEditingController _searchController = TextEditingController();
  List<OrganizationResult> _searchResults = [];
  bool _isSearching = false;
  String? _error;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _searchOrganization(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        _searchResults = [];
        _error = null;
      });
      return;
    }

    setState(() {
      _isSearching = true;
      _error = null;
    });

    try {
      final response = await _apiService.searchOrganization(query);
      final results = response['results'] as List;

      setState(() {
        _searchResults = results
            .map((org) => OrganizationResult.fromJson(org))
            .toList();
        _isSearching = false;
      });
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Ошибка поиска. Попробуйте снова.';
          _isSearching = false;
          _searchResults = [];
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
            'Организация',
            style: RegistrationTheme.headerStyle,
          ),
          const SizedBox(height: RegistrationTheme.headerBottomMargin),
          const Text(
            'Найдите вашу организацию по названию или ИНН',
            style: RegistrationTheme.subtitleStyle,
          ),
          const SizedBox(height: RegistrationTheme.subtitleBottomMargin),
          TextField(
            controller: _searchController,
            decoration: RegistrationTheme.getInputDecoration(
              label: 'Название или ИНН',
              hint: 'ООО Компания или 7712345678',
              error: _error,
            ),
            style: RegistrationTheme.inputStyle,
            onChanged: (value) {
              // Debounce search
              Future.delayed(const Duration(milliseconds: 500), () {
                if (_searchController.text == value) {
                  _searchOrganization(value);
                }
              });
            },
          ),
          const SizedBox(height: 16),
          Expanded(
            child: _isSearching
                ? const Center(child: CircularProgressIndicator())
                : widget.selectedOrganization != null
                    ? _buildSelectedOrganization()
                    : _searchResults.isEmpty
                        ? Center(
                            child: Text(
                              _searchController.text.isEmpty
                                  ? 'Введите название или ИНН организации'
                                  : 'Ничего не найдено',
                              style: RegistrationTheme.infoTextStyle,
                            ),
                          )
                        : ListView.builder(
                            itemCount: _searchResults.length,
                            itemBuilder: (context, index) {
                              final org = _searchResults[index];
                              return _buildOrganizationCard(org);
                            },
                          ),
          ),
          const SizedBox(height: RegistrationTheme.buttonTopMargin),
          ElevatedButton(
            onPressed: widget.selectedOrganization != null
                ? () async => await widget.onNext()
                : null,
            style: RegistrationTheme.getButtonStyle(
              enabled: widget.selectedOrganization != null,
            ),
            child: const Text('Продолжить'),
          ),
        ],
      ),
    );
  }

  Widget _buildSelectedOrganization() {
    final org = widget.selectedOrganization!;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border.all(
          color: RegistrationTheme.primaryText,
          width: 2,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      org.name,
                      style: RegistrationTheme.inputStyle.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    if (org.shortName != null)
                      Text(
                        org.shortName!,
                        style: RegistrationTheme.labelStyle,
                      ),
                  ],
                ),
              ),
              IconButton(
                onPressed: () {
                  widget.onOrganizationSelect(null);
                  setState(() {
                    _searchResults = [];
                    _searchController.clear();
                  });
                },
                icon: const Icon(Icons.close),
                color: RegistrationTheme.secondaryText,
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildInfoRow('ИНН', org.inn),
          if (org.kpp != null) _buildInfoRow('КПП', org.kpp!),
          if (org.ogrn != null) _buildInfoRow('ОГРН', org.ogrn!),
          if (org.address != null) _buildInfoRow('Адрес', org.address!),
          if (org.management?.name != null)
            _buildInfoRow('Руководитель', '${org.management!.name} (${org.management!.post ?? ''})'),
        ],
      ),
    );
  }

  Widget _buildOrganizationCard(OrganizationResult org) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          widget.onOrganizationSelect(org);
          setState(() {
            _searchResults = [];
          });
        },
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            border: Border.all(
              color: RegistrationTheme.inputBorder,
              width: 1,
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                org.name,
                style: RegistrationTheme.inputStyle.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'ИНН: ${org.inn}',
                style: RegistrationTheme.labelStyle,
              ),
              if (org.address != null) ...[
                const SizedBox(height: 2),
                Text(
                  org.address!,
                  style: RegistrationTheme.labelStyle,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: RegistrationTheme.labelStyle,
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: RegistrationTheme.inputStyle.copyWith(fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }
}
