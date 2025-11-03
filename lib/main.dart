import 'package:flutter/material.dart';
import 'theme/registration_theme.dart';
import 'screens/registration/registration_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Registration App',
      theme: RegistrationTheme.buildTheme(),
      debugShowCheckedModeBanner: false,
      home: RegistrationScreen(
        onLogin: (user) {
          // Handle successful login/registration
          debugPrint('User logged in: $user');
          // Navigate to main app or save user data
        },
      ),
      routes: {
        '/': (context) => const HomeScreen(),
      },
    );
  }
}

// Placeholder home screen - replace with your actual home screen
class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Welcome to the App!',
              style: TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => RegistrationScreen(
                      onLogin: (user) {
                        debugPrint('User logged in: $user');
                      },
                    ),
                  ),
                );
              },
              child: const Text('Go to Registration'),
            ),
          ],
        ),
      ),
    );
  }
}
