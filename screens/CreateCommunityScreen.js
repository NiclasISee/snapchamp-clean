import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Stelle sicher, dass storage aus firebase exportiert wird
import uuid from 'react-native-uuid';

export default function CreateCommunityScreen({ navigation }) {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const createCommunity = async () => {
    if (!name.trim()) {
      Alert.alert('Name fehlt', 'Bitte gib deiner Community einen Namen.');
      return;
    }

    try {
      let downloadURL = null;

      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const imageRef = ref(storage, `communityImages/${uuid.v4()}.jpg`);
        await uploadBytes(imageRef, blob);
        downloadURL = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'communities'), {
        name,
        description,
        isPrivate,
        imageUri: downloadURL,
        createdAt: new Date(),
        members: [],
        invites: [],
      });

      Alert.alert('Erfolgreich', 'Community wurde erstellt ✅');
      navigation.goBack();
    } catch (error) {
      console.error('Fehler beim Erstellen:', error);
      Alert.alert('Fehler', 'Community konnte nicht gespeichert werden');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>📛 Community-Name</Text>
      <TextInput
        style={styles.input}
        placeholder="z. B. Urban Explorers"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>📝 Beschreibung</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Worum geht's in eurer Community?"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>🖼 Profilbild</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>Bild auswählen</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

      <View style={styles.switchRow}>
        <Text style={styles.label}>🔒 Privat</Text>
        <Switch value={isPrivate} onValueChange={setIsPrivate} />
      </View>

      <TouchableOpacity style={styles.createButton} onPress={createCommunity}>
        <Text style={styles.createButtonText}>🚀 Community erstellen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    fontSize: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  imagePicker: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  imagePickerText: {
    color: '#333',
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
