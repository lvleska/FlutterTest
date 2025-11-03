import 'dart:io';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  // TODO: Replace with your actual API base URL
  static const String baseUrl = 'https://api.example.com';

  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  String? _authToken;

  void setAuthToken(String token) {
    _authToken = token;
  }

  String? getAuthToken() => _authToken;

  Map<String, String> _getHeaders() {
    final headers = {
      'Content-Type': 'application/json',
    };
    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    return headers;
  }

  /// Send SMS code to phone
  /// POST /auth/send-code
  Future<Map<String, dynamic>> sendSmsCode(String phone) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/send-code'),
        headers: _getHeaders(),
        body: jsonEncode({'phone': phone}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to send SMS code: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to send SMS code: $e');
    }
  }

  /// Verify SMS code
  /// POST /auth/verify-code
  /// Returns: { exists: bool, token?: string, user?: User }
  Future<Map<String, dynamic>> verifyCode(String phone, String code) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/verify-code'),
        headers: _getHeaders(),
        body: jsonEncode({'phone': phone, 'code': code}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['token'] != null) {
          setAuthToken(data['token']);
        }
        return data;
      } else {
        throw Exception('Failed to verify code: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to verify code: $e');
    }
  }

  /// Register new user
  /// POST /auth/register
  /// Returns: { user: User, token: string }
  Future<Map<String, dynamic>> register({
    required String phone,
    required String firstName,
    required String lastName,
    String? middleName,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: _getHeaders(),
        body: jsonEncode({
          'phone': phone,
          'firstName': firstName,
          'lastName': lastName,
          'middleName': middleName,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['token'] != null) {
          setAuthToken(data['token']);
        }
        return data;
      } else {
        throw Exception('Failed to register user: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to register user: $e');
    }
  }

  /// Create individual context (for freelancers)
  /// POST /users/contexts
  /// Body: { type: 'individual' }
  Future<Map<String, dynamic>> createIndividualContext() async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/users/contexts'),
        headers: _getHeaders(),
        body: jsonEncode({'type': 'individual'}),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception(
            'Failed to create individual context: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to create individual context: $e');
    }
  }

  /// Create organization context
  /// POST /users/contexts
  /// Body: { type: 'organization', organization: {...} }
  Future<Map<String, dynamic>> createOrganizationContext({
    required String inn,
    required String name,
    required String organizationType,
    String? managementName,
    String? shortName,
    String? kpp,
    String? ogrn,
    String? address,
    String? phone,
    String? email,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/users/contexts'),
        headers: _getHeaders(),
        body: jsonEncode({
          'type': 'organization',
          'organization': {
            'inn': inn,
            'name': name,
            'organizationType': organizationType,
            'managementName': managementName,
            'shortName': shortName,
            'kpp': kpp,
            'ogrn': ogrn,
            'address': address,
            'phone': phone,
            'email': email,
          },
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception(
            'Failed to create organization context: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to create organization context: $e');
    }
  }

  /// Update user skills
  /// PUT /users/skills
  /// Body: { skillIds: number[] }
  Future<Map<String, dynamic>> updateUserSkills(List<int> skillIds) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/users/skills'),
        headers: _getHeaders(),
        body: jsonEncode({'skillIds': skillIds}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to update skills: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to update skills: $e');
    }
  }

  /// Get skill categories with skills
  /// GET /users/skill-categories
  /// Returns: { categories: SkillCategory[] }
  Future<Map<String, dynamic>> getSkillCategories() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/users/skill-categories'),
        headers: _getHeaders(),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception(
            'Failed to get skill categories: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to get skill categories: $e');
    }
  }

  /// Search organization by query (Dadata integration)
  /// POST /organizations/search-dadata
  /// Body: { query: string }
  /// Returns: { results: OrganizationResult[] }
  Future<Map<String, dynamic>> searchOrganization(String query) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/organizations/search-dadata'),
        headers: _getHeaders(),
        body: jsonEncode({'query': query}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception(
            'Failed to search organization: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to search organization: $e');
    }
  }

  /// Upload profile photo
  /// POST /auth/profile/upload-photo
  Future<Map<String, dynamic>> uploadProfilePhoto(File photoFile) async {
    try {
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/auth/profile/upload-photo'),
      );

      if (_authToken != null) {
        request.headers['Authorization'] = 'Bearer $_authToken';
      }

      request.files.add(
        await http.MultipartFile.fromPath('photo', photoFile.path),
      );

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to upload photo: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to upload photo: $e');
    }
  }

  /// Get current user info
  /// GET /auth/me
  Future<Map<String, dynamic>> getMe() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/me'),
        headers: _getHeaders(),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to get user info: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to get user info: $e');
    }
  }
}
