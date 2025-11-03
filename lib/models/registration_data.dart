import 'dart:io';

/// Organization result from API
class OrganizationResult {
  final String inn;
  final String name;
  final String? shortName;
  final String? kpp;
  final String? ogrn;
  final String? address;
  final String? phone;
  final String? email;
  final Management? management;

  OrganizationResult({
    required this.inn,
    required this.name,
    this.shortName,
    this.kpp,
    this.ogrn,
    this.address,
    this.phone,
    this.email,
    this.management,
  });

  Map<String, dynamic> toJson() {
    return {
      'inn': inn,
      'name': name,
      'shortName': shortName,
      'kpp': kpp,
      'ogrn': ogrn,
      'address': address,
      'phone': phone,
      'email': email,
      'management': management?.toJson(),
    };
  }

  factory OrganizationResult.fromJson(Map<String, dynamic> json) {
    return OrganizationResult(
      inn: json['inn'],
      name: json['name'],
      shortName: json['shortName'],
      kpp: json['kpp'],
      ogrn: json['ogrn'],
      address: json['address'],
      phone: json['phone'],
      email: json['email'],
      management: json['management'] != null
          ? Management.fromJson(json['management'])
          : null,
    );
  }
}

class Management {
  final String? name;
  final String? post;

  Management({this.name, this.post});

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'post': post,
    };
  }

  factory Management.fromJson(Map<String, dynamic> json) {
    return Management(
      name: json['name'],
      post: json['post'],
    );
  }
}

/// Main registration data model
class RegistrationData {
  String phone;
  String code;
  String lastName;
  String firstName;
  String middleName;
  File? photo;
  bool agreedToTerms;
  bool agreedToPersonalData;
  String? selectedRole;
  List<int> selectedSkills;
  OrganizationResult? selectedOrganization;
  String organizationType;
  bool needsVerification;
  dynamic user; // Replace with your User model

  RegistrationData({
    this.phone = '',
    this.code = '',
    this.lastName = '',
    this.firstName = '',
    this.middleName = '',
    this.photo,
    this.agreedToTerms = false,
    this.agreedToPersonalData = false,
    this.selectedRole,
    this.selectedSkills = const [],
    this.selectedOrganization,
    this.organizationType = '',
    this.needsVerification = false,
    this.user,
  });

  RegistrationData copyWith({
    String? phone,
    String? code,
    String? lastName,
    String? firstName,
    String? middleName,
    File? photo,
    bool? agreedToTerms,
    bool? agreedToPersonalData,
    String? selectedRole,
    List<int>? selectedSkills,
    OrganizationResult? selectedOrganization,
    String? organizationType,
    bool? needsVerification,
    dynamic user,
  }) {
    return RegistrationData(
      phone: phone ?? this.phone,
      code: code ?? this.code,
      lastName: lastName ?? this.lastName,
      firstName: firstName ?? this.firstName,
      middleName: middleName ?? this.middleName,
      photo: photo ?? this.photo,
      agreedToTerms: agreedToTerms ?? this.agreedToTerms,
      agreedToPersonalData: agreedToPersonalData ?? this.agreedToPersonalData,
      selectedRole: selectedRole ?? this.selectedRole,
      selectedSkills: selectedSkills ?? this.selectedSkills,
      selectedOrganization: selectedOrganization ?? this.selectedOrganization,
      organizationType: organizationType ?? this.organizationType,
      needsVerification: needsVerification ?? this.needsVerification,
      user: user ?? this.user,
    );
  }
}

/// Registration step enum
enum RegistrationStep {
  phone,
  code,
  name,
  role,
  skills,
  organization,
  photo,
  success,
}
