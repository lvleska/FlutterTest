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
  Future<Map<String, dynamic>> verifySmsCode(
      String phone, String code) async {
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
  Future<Map<String, dynamic>> registerUser({
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
  Future<void> createIndividualContext() async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/user/context/individual'),
        headers: _getHeaders(),
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception(
            'Failed to create individual context: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to create individual context: $e');
    }
  }

  /// Update user skills
  Future<void> updateUserSkills(List<int> skillIds) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/user/skills'),
        headers: _getHeaders(),
        body: jsonEncode({'skillIds': skillIds}),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to update skills: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to update skills: $e');
    }
  }

  /// Save organization
  Future<Map<String, dynamic>> saveOrganization({
    required String inn,
    required String name,
    required String type,
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
        Uri.parse('$baseUrl/user/organization'),
        headers: _getHeaders(),
        body: jsonEncode({
          'inn': inn,
          'name': name,
          'type': type,
          'managementName': managementName,
          'shortName': shortName,
          'kpp': kpp,
          'ogrn': ogrn,
          'address': address,
          'phone': phone,
          'email': email,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to save organization: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to save organization: $e');
    }
  }

  /// Search organization by INN
  Future<Map<String, dynamic>> searchOrganizationByInn(String inn) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/organization/search?inn=$inn'),
        headers: _getHeaders(),
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
  Future<void> uploadProfilePhoto(File photoFile) async {
    try {
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/user/photo'),
      );

      if (_authToken != null) {
        request.headers['Authorization'] = 'Bearer $_authToken';
      }

      request.files.add(
        await http.MultipartFile.fromPath('photo', photoFile.path),
      );

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to upload photo: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to upload photo: $e');
    }
  }

  /// Get skills list
  Future<List<Map<String, dynamic>>> getSkills() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/skills'),
        headers: _getHeaders(),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.cast<Map<String, dynamic>>();
      } else {
        throw Exception('Failed to get skills: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to get skills: $e');
    }
  }
}
