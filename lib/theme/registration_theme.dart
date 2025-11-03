import 'package:flutter/material.dart';

/// Registration theme based on registration.css
class RegistrationTheme {
  // Colors
  static const Color primaryText = Color(0xFF000000);
  static const Color secondaryText = Color(0xFF666666);
  static const Color labelText = Color(0xFF999999);
  static const Color errorText = Color(0xFFE74C3C);
  static const Color linkColor = Color(0xFF007AFF);
  static const Color backgroundColor = Color(0xFFFFFFFF);
  static const Color inputBorder = Color(0xFFDDDDDD);
  static const Color inputBorderFocused = Color(0xFF000000);
  static const Color buttonBackground = Color(0xFF000000);
  static const Color buttonText = Color(0xFFFFFFFF);

  // Typography
  static const TextStyle headerStyle = TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.w700,
    color: primaryText,
    height: 1.2,
  );

  static const TextStyle subtitleStyle = TextStyle(
    fontSize: 15,
    color: secondaryText,
    height: 1.4,
  );

  static const TextStyle labelStyle = TextStyle(
    fontSize: 13,
    color: labelText,
    height: 1.4,
  );

  static const TextStyle inputStyle = TextStyle(
    fontSize: 16,
    color: primaryText,
    height: 1.5,
  );

  static const TextStyle buttonStyle = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: buttonText,
  );

  static const TextStyle checkboxTextStyle = TextStyle(
    fontSize: 14,
    color: secondaryText,
    height: 1.5,
  );

  static const TextStyle linkStyle = TextStyle(
    fontSize: 14,
    color: linkColor,
    decoration: TextDecoration.none,
  );

  static const TextStyle errorStyle = TextStyle(
    fontSize: 12,
    color: errorText,
  );

  static const TextStyle infoTextStyle = TextStyle(
    fontSize: 14,
    color: labelText,
    height: 1.4,
  );

  // Input decoration matching CSS .reg-input
  static InputDecoration getInputDecoration({
    String? label,
    String? hint,
    String? error,
  }) {
    return InputDecoration(
      labelText: label,
      labelStyle: labelStyle,
      hintText: hint,
      hintStyle: const TextStyle(color: labelText),
      errorText: error,
      errorStyle: errorStyle,
      // Remove all borders and use only bottom border
      border: const UnderlineInputBorder(
        borderSide: BorderSide(color: inputBorder, width: 1),
      ),
      enabledBorder: const UnderlineInputBorder(
        borderSide: BorderSide(color: inputBorder, width: 1),
      ),
      focusedBorder: const UnderlineInputBorder(
        borderSide: BorderSide(color: inputBorderFocused, width: 1),
      ),
      errorBorder: const UnderlineInputBorder(
        borderSide: BorderSide(color: errorText, width: 1),
      ),
      focusedErrorBorder: const UnderlineInputBorder(
        borderSide: BorderSide(color: errorText, width: 1),
      ),
      contentPadding: const EdgeInsets.only(bottom: 8, top: 0),
      floatingLabelBehavior: FloatingLabelBehavior.always,
    );
  }

  // Button style matching CSS .reg-button
  static ButtonStyle getButtonStyle({bool enabled = true}) {
    return ElevatedButton.styleFrom(
      backgroundColor: buttonBackground,
      foregroundColor: buttonText,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
      minimumSize: const Size(double.infinity, 50),
      textStyle: buttonStyle,
      disabledBackgroundColor: buttonBackground.withOpacity(0.3),
      disabledForegroundColor: buttonText.withOpacity(0.3),
    );
  }

  // Checkbox theme
  static CheckboxThemeData getCheckboxTheme() {
    return CheckboxThemeData(
      fillColor: MaterialStateProperty.resolveWith<Color>((states) {
        if (states.contains(MaterialState.selected)) {
          return primaryText;
        }
        return Colors.transparent;
      }),
      checkColor: MaterialStateProperty.all(buttonText),
      side: const BorderSide(color: inputBorder, width: 1.5),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }

  // Container padding matching .reg-content
  static const EdgeInsets contentPadding = EdgeInsets.all(20);

  // Spacing
  static const double headerBottomMargin = 12;
  static const double subtitleBottomMargin = 40;
  static const double inputGroupBottomMargin = 14;
  static const double buttonTopMargin = 16;
  static const double checkboxTopMargin = 16;

  // Build theme data
  static ThemeData buildTheme() {
    return ThemeData(
      scaffoldBackgroundColor: backgroundColor,
      primaryColor: primaryText,
      fontFamily: '.SF Pro Text', // iOS default, will fallback to system
      textTheme: const TextTheme(
        displayLarge: headerStyle,
        titleMedium: subtitleStyle,
        bodyMedium: inputStyle,
        labelMedium: labelStyle,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: getButtonStyle(),
      ),
      checkboxTheme: getCheckboxTheme(),
      inputDecorationTheme: InputDecorationTheme(
        labelStyle: labelStyle,
        hintStyle: const TextStyle(color: labelText),
        errorStyle: errorStyle,
        border: const UnderlineInputBorder(
          borderSide: BorderSide(color: inputBorder, width: 1),
        ),
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: inputBorder, width: 1),
        ),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: inputBorderFocused, width: 1),
        ),
        contentPadding: const EdgeInsets.only(bottom: 8),
        floatingLabelBehavior: FloatingLabelBehavior.always,
      ),
      colorScheme: const ColorScheme.light(
        primary: primaryText,
        secondary: secondaryText,
        error: errorText,
        background: backgroundColor,
        surface: backgroundColor,
      ),
    );
  }

  // Container widget matching .reg-container
  static Widget buildContainer({required Widget child}) {
    return Container(
      color: backgroundColor,
      child: SafeArea(
        child: child,
      ),
    );
  }

  // Content widget matching .reg-content
  static Widget buildContent({
    required List<Widget> children,
    bool scrollable = false,
    CrossAxisAlignment crossAxisAlignment = CrossAxisAlignment.start,
  }) {
    final content = Column(
      crossAxisAlignment: crossAxisAlignment,
      mainAxisAlignment: MainAxisAlignment.center,
      children: children,
    );

    if (scrollable) {
      return SingleChildScrollView(
        padding: contentPadding,
        child: content,
      );
    }

    return Padding(
      padding: contentPadding,
      child: content,
    );
  }
}
