import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

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

  Future<void> _pickImage(ImageSource source) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: source);

    if (pickedFile != null) {
      onPhotoChange(File(pickedFile.path));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Фото профиля'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Добавьте фото профиля',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 24),
            Center(
              child: GestureDetector(
                onTap: () => _showImageSourceDialog(context),
                child: CircleAvatar(
                  radius: 80,
                  backgroundColor: Colors.grey[300],
                  backgroundImage: photo != null ? FileImage(photo!) : null,
                  child: photo == null
                      ? const Icon(Icons.add_a_photo, size: 50)
                      : null,
                ),
              ),
            ),
            const SizedBox(height: 24),
            if (photo == null)
              ElevatedButton.icon(
                onPressed: () => _showImageSourceDialog(context),
                icon: const Icon(Icons.camera_alt),
                label: const Text('Добавить фото'),
              ),
            const Spacer(),
            ElevatedButton(
              onPressed: () async {
                await onNext();
              },
              child: Text(photo != null ? 'Продолжить' : 'Пропустить'),
            ),
          ],
        ),
      ),
    );
  }

  void _showImageSourceDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.photo_camera),
              title: const Text('Камера'),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.camera);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text('Галерея'),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.gallery);
              },
            ),
          ],
        ),
      ),
    );
  }
}
