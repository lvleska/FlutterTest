import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../../theme/registration_theme.dart';

class PhotoStep extends StatelessWidget {
  final File? photo;
  final Function(File?) onPhotoChange;
  final Future<void> Function() onNext;

  const PhotoStep({
    Key? key,
    required this.photo,
    required this.onPhotoChange,
    required this.onNext,
  }) : super(key: key);

  Future<void> _pickImage(BuildContext context, ImageSource source) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: source);

    if (pickedFile != null) {
      onPhotoChange(File(pickedFile.path));
    }
  }

  void _showImageSourceDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: RegistrationTheme.backgroundColor,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 8),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: RegistrationTheme.inputBorder,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              ListTile(
                leading: const Icon(Icons.photo_camera),
                title: const Text('Камера'),
                onTap: () {
                  Navigator.pop(context);
                  _pickImage(context, ImageSource.camera);
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Галерея'),
                onTap: () {
                  Navigator.pop(context);
                  _pickImage(context, ImageSource.gallery);
                },
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: RegistrationTheme.backgroundColor,
      body: RegistrationTheme.buildContent(
        scrollable: false,
        children: [
          const Text(
            'Фото профиля',
            style: RegistrationTheme.headerStyle,
          ),
          const SizedBox(height: RegistrationTheme.headerBottomMargin),
          const Text(
            'Добавьте ваше фото для профиля (необязательно)',
            style: RegistrationTheme.subtitleStyle,
          ),
          const SizedBox(height: RegistrationTheme.subtitleBottomMargin),
          Center(
            child: GestureDetector(
              onTap: () => _showImageSourceDialog(context),
              child: Container(
                width: 160,
                height: 160,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: photo == null
                      ? RegistrationTheme.inputBorder.withOpacity(0.2)
                      : null,
                  border: Border.all(
                    color: RegistrationTheme.inputBorder,
                    width: 2,
                  ),
                  image: photo != null
                      ? DecorationImage(
                          image: FileImage(photo!),
                          fit: BoxFit.cover,
                        )
                      : null,
                ),
                child: photo == null
                    ? const Icon(
                        Icons.add_a_photo,
                        size: 48,
                        color: RegistrationTheme.secondaryText,
                      )
                    : null,
              ),
            ),
          ),
          const SizedBox(height: 24),
          if (photo == null)
            OutlinedButton.icon(
              onPressed: () => _showImageSourceDialog(context),
              icon: const Icon(Icons.camera_alt),
              label: const Text('Добавить фото'),
              style: OutlinedButton.styleFrom(
                foregroundColor: RegistrationTheme.primaryText,
                side: const BorderSide(
                  color: RegistrationTheme.inputBorder,
                  width: 1,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(vertical: 16),
                minimumSize: const Size(double.infinity, 50),
              ),
            )
          else
            TextButton.icon(
              onPressed: () => _showImageSourceDialog(context),
              icon: const Icon(Icons.edit),
              label: const Text('Изменить фото'),
              style: TextButton.styleFrom(
                foregroundColor: RegistrationTheme.linkColor,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          const Spacer(),
          ElevatedButton(
            onPressed: () async => await onNext(),
            style: RegistrationTheme.getButtonStyle(),
            child: Text(photo != null ? 'Продолжить' : 'Пропустить'),
          ),
        ],
      ),
    );
  }
}
