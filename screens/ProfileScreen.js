// ProfileScreen.js
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../AppContext';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { profile, challengeImages, xp, makingOfs, setMakingOfs } = useContext(AppContext);

  const bestImages = [...challengeImages]
    .filter(img => img.stars)
    .sort((a, b) => (b.stars || 0) - (a.stars || 0))
    .slice(0, 3);

  const pickMakingOf = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setMakingOfs(prev => [...prev, { uri }]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topImagesContainer}>
        {bestImages.map((img, index) => (
          <View key={index} style={styles.topImageWrapper}>
            <Image source={{ uri: img.uri }} style={styles.topImage} />
            <Text style={styles.ratingText}>⭐ {img.stars || 0}  💖 {img.likes || 0}</Text>
          </View>
        ))}
      </View>

      <View style={styles.profileRow}>
  <View style={styles.sideInfo}>
    <Text style={styles.sideText}>👥</Text>
    <View style={styles.verticalNumber}>
      {'1234'.split('').map((digit, index) => (
        <Text key={index} style={styles.digit}>{digit}</Text>
      ))}
    </View>
  </View>

        <View style={styles.centerProfilePic}>
          <Image
            source={
              profile.imageUri
                ? { uri: profile.imageUri }
                : require('../assets/profile.jpg')
            }
            style={styles.profilePic}
          />
        </View>

        <View style={styles.sideInfo}>
    <Text style={styles.sideText}>✅</Text>
    <View style={styles.verticalText}>
      {'Follows'.split('').map((char, index) => (
        <Text key={index} style={styles.digit}>{char}</Text>
      ))}
    </View>
  </View>
</View>

      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={() => navigation.navigate('ProfilBearbeiten')}
      >
        <Text style={styles.editProfileText}>✏️ Profil bearbeiten</Text>
      </TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 16 }}>
        {profile.username ? <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{profile.username}</Text> : null}
        {profile.bio ? <Text style={{ fontStyle: 'italic', marginTop: 6 }}>{profile.bio}</Text> : null}
        {profile.location ? <Text style={{ marginTop: 6 }}>📍 {profile.location}</Text> : null}
        {profile.website ? <Text style={{ color: '#007bff', marginTop: 6 }}>{profile.website}</Text> : null}
        {typeof xp === 'number' && (
          <>
            <Text style={{ marginTop: 10, fontWeight: '600', color: '#333' }}>
              🧬 Level {Math.floor(xp / 100) + 1} – {xp} XP
            </Text>
            <View style={styles.xpBarBackground}>
              <View style={[styles.xpBarFill, { width: `${xp % 100}%` }]} />
            </View>
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>🎥 Making-Ofs</Text>
      <TouchableOpacity onPress={pickMakingOf} style={styles.uploadButton}>
        <Text style={styles.uploadText}>➕ Making-Of hinzufügen</Text>
      </TouchableOpacity>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {makingOfs.map((item, index) => (
          <View key={index} style={styles.makingOfCard}>
            <Video
              source={{ uri: item.uri }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              useNativeControls
              style={styles.makingOfImage}
            />
          </View>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>🏆 Challenge-Beiträge</Text>
      <View style={styles.galleryContainer}>
        {challengeImages.length > 0 ? (
          challengeImages.map((img, index) => (
            <Image key={index} source={{ uri: img.uri || img.imageUrl }} style={styles.galleryImage} />
          ))
        ) : (
          <Text style={styles.infoText}>🔜 Noch keine Challenge-Bilder eingereicht.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  topImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  topImageWrapper: {
    alignItems: 'center',
    marginHorizontal: 6,
  },
  topImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  ratingText: {
    marginTop: 4,
    fontSize: 12,
    color: '#555',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  centerProfilePic: {
    marginHorizontal: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
 sideInfo: {
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  paddingHorizontal: 8,
},
sideText: {
  fontSize: 14,
  color: '#333',
  textAlign: 'center',
},
  editProfileButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  editProfileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 10,
    marginTop: 24,
  },
  horizontalScroll: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  makingOfCard: {
    marginRight: 12,
    alignItems: 'center',
  },
  makingOfImage: {
    width: 120,
    height: 200,
    borderRadius: 10,
    marginBottom: 6,
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  galleryImage: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginBottom: 12,
  },
  infoText: {
    color: '#555',
    textAlign: 'center',
  },
  xpBarBackground: {
    width: '80%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginTop: 8,
    alignSelf: 'center',
  },
  xpBarFill: {
    height: 10,
    backgroundColor: '#ffa500',
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: '#ffa500',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
verticalNumber: {
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 4,
},

digit: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#333',
  lineHeight: 20,
},
verticalText: {
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 4,
},

digit: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#333',
  lineHeight: 18,
},
});

