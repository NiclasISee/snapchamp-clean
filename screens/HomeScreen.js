// HomeScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode as atob } from 'base-64';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { storage, db, Auth } from '../firebase';
import { AppContext } from '../AppContext';

export default function HomeScreen({ navigation }) {
  const [theme] = useState('Chaos');
  const [timeLeft, setTimeLeft] = useState('');
  const [image, setImage] = useState(null);
  const { setUserSubmittedImage } = useContext(AppContext);

  const challengeEndTime = new Date();
  challengeEndTime.setHours(23, 59, 59, 999);

  const [makingOfs, setMakingOfs] = useState([]); // TODO: Load real making-ofs
  const [newcomers, setNewcomers] = useState([]); // TODO: Load real newcomers

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = challengeEndTime - now;
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setUserSubmittedImage(uri);
      await uploadImageToFirebase(uri);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    try {
      const userId = Auth.currentUser?.uid || 'demoUser';
      const filename = uri.split('/').pop();

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const byteCharacters = atob(base64);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      const blob = new Blob(byteArrays, { type: 'image/jpeg' });

      const storageRef = ref(storage, `challengeEntries/${userId}/${Date.now()}_${filename}`);
      await uploadBytesResumable(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'users', userId, 'gallery'), {
        imageUrl: downloadURL,
        uploadedAt: serverTimestamp(),
        type: 'challenge',
      });

      console.log('✅ Upload erfolgreich:', downloadURL);
    } catch (error) {
      console.error('❌ Upload fehlgeschlagen:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>SnapChamp</Text>

      <View style={styles.dailyCard}>
        <Text style={styles.dailyTitle}>📸 Heutiges Thema</Text>
        <Text style={styles.dailyTheme}>„{theme}“</Text>
        <Text style={styles.dailyTime}>🕒 Noch {timeLeft} Zeit</Text>
        <TouchableOpacity onPress={pickImage} style={styles.dailyButton}>
          <Text style={styles.dailyButtonText}>Bild aufnehmen</Text>
        </TouchableOpacity>
      </View>

    {/* Spotlight */}
    <View style={styles.spotlightPodest}>
      <Text style={styles.title}>🌟 Spotlight</Text>
      <View style={styles.podiumRow}>
        {/* Silber */}
        <TouchableOpacity
          style={styles.podiumBlock}
          onPress={() => navigation.navigate('Profil', {
            screen: 'VisitorProfile',
            params: { name: '@SilverStar', thumb: require('../assets/vote2.jpg') },
          })}
        >
          <Image source={require('../assets/vote2.jpg')} style={styles.avatar} />
          <Text style={styles.medal}>🥈</Text>
          <Text style={styles.podiumName}>@SilverStar</Text>
        </TouchableOpacity>

        {/* Gold */}
        <TouchableOpacity
          style={[styles.podiumBlock, styles.podiumFirst]}
          onPress={() => navigation.navigate('Profil', {
            screen: 'VisitorProfile',
            params: { name: '@GoldChamp', thumb: require('../assets/vote1.jpg') },
          })}
        >
          <Image source={require('../assets/vote1.jpg')} style={styles.avatarLarge} />
          <Text style={styles.medal}>🥇</Text>
          <Text style={styles.podiumName}>@GoldChamp</Text>
        </TouchableOpacity>

        {/* Bronze */}
        <TouchableOpacity
          style={styles.podiumBlock}
          onPress={() => navigation.navigate('Profil', {
            screen: 'VisitorProfile',
            params: { name: '@BronzeHero', thumb: require('../assets/vote3.jpg') },
          })}
        >
          <Image source={require('../assets/vote3.jpg')} style={styles.avatar} />
          <Text style={styles.medal}>🥉</Text>
          <Text style={styles.podiumName}>@BronzeHero</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Beste Making-Offs */}
    <View style={styles.card}>
      <Text style={styles.title}>🎬 Beste Making-Offs</Text>
      <FlatList
        horizontal
        data={makingOfs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.makingCardVideo}
            onPress={() => {
              navigation.navigate('MakingOfFeed', {
                videos: makingOfs,
                startIndex: makingOfs.findIndex((v) => v.id === item.id),
              });
            }}
          >
            <Image source={item.thumb} style={styles.makingImageVideo} />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>

    {/* Gewinner */}
    <TouchableOpacity
      style={styles.cardGold}
      onPress={() => navigation.navigate('Profil', {
        screen: 'VisitorProfile',
        params: { name: '@PixelBoss', thumb: require('../assets/vote3.jpg') },
      })}
    >
      <Text style={styles.championName}>@PixelBoss</Text>
      <View style={styles.winnerImageWrapper}>
        <Image source={require('../assets/vote3.jpg')} style={styles.winnerImage} />
        <Image source={require('../assets/kranz.png')} style={styles.kranzOverlay} />
      </View>
      <Text style={styles.voteText}>🏆 gewann die Challenge „Chaos“</Text>
      <Text style={styles.voteText}>⭐ 4.8 Sterne aus 932 Stimmen</Text>
    </TouchableOpacity>

    {/* Beste Newcomer */}
    <View style={styles.card}>
      <Text style={styles.title}>🆕 Beste Newcomer</Text>
      <FlatList
        horizontal
        data={newcomers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.makingCard}
            onPress={() => navigation.navigate('Profil', {
              screen: 'VisitorProfile',
              params: { name: item.name, thumb: item.thumb },
            })}
          >
            <Image source={item.thumb} style={styles.makingImage} />
            <Text style={styles.voteText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>

    {/* Voting Button */}
    <View style={styles.card}>
      <Text style={styles.title}>⭐ Jetzt bewerten</Text>
      <Text style={styles.text}>Stimme für deine Favoriten ab!</Text>
      <TouchableOpacity
        style={styles.votingButton}
        onPress={() => navigation.navigate('Voting')}
      >
        <Text style={styles.votingButtonText}>Zum Voting</Text>
      </TouchableOpacity>
    </View>

    {/* Top Voter */}
    <View style={styles.card}>
      <Text style={styles.title}>🏅 Top Voter heute</Text>

      <TouchableOpacity
        style={styles.voterRow}
        onPress={() => navigation.navigate('Profil', {
          screen: 'VisitorProfile',
          params: { name: '@ShutterQueen', thumb: require('../assets/profile.jpg') },
        })}
      >
        <Image source={require('../assets/profile.jpg')} style={styles.voterImage} />
        <View style={styles.voterInfo}>
          <Text style={styles.voterName}>@ShutterQueen</Text>
          <Text style={styles.subtext}>134 Votes abgegeben</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.voterRow}
        onPress={() => navigation.navigate('Profil', {
          screen: 'VisitorProfile',
          params: { name: '@LightHunter', thumb: require('../assets/vote1.jpg') },
        })}
      >
        <Image source={require('../assets/vote1.jpg')} style={styles.voterImage} />
        <View style={styles.voterInfo}>
          <Text style={styles.voterName}>@LightHunter</Text>
          <Text style={styles.subtext}>121 Votes abgegeben</Text>
        </View>
      </TouchableOpacity>
    </View>
  </ScrollView>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f4f4f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardGold: {
    backgroundColor: '#fff8dc',
    borderColor: '#d4af37',
    borderWidth: 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 2,
  },
  subtext: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#ffa500',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  preview: {
    marginTop: 10,
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  makingCard: {
    width: 120,
    height: 160,
    marginRight: 12,
  },
  makingImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  voteText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  voterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  voterImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  voterInfo: {
    flex: 1,
  },
  voterName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  championName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  winnerImageWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 105,
  },
  winnerImage: {
    width: 170,
    height: 140,
    borderRadius: 5,
    marginTop: 77,
  },
  kranzOverlay: {
    position: 'absolute',
    width: 365,
    height: 365,
    top: -25,
    zIndex: 2,
    resizeMode: 'contain',
  },
  dailyCard: {
    backgroundColor: '#ffefd5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderColor: '#ffa500',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  dailyTheme: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#d2691e',
    textAlign: 'center',
  },
  dailyTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  dailyButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 200,
  },
  dailyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
spotlightPodest: {
  backgroundColor: '#fff8dc',
  borderColor: '#d4af37',
  borderWidth: 2,
  padding: 16,
  borderRadius: 12,
  marginBottom: 16,
  alignItems: 'center',
},
podiumRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'flex-end',
  marginTop: 12,
},
podiumBlock: {
  alignItems: 'center',
},
podiumFirst: {
  marginTop: -20,
},
avatar: {
  width: 60,
  height: 60,
  borderRadius: 30,
  marginBottom: 4,
},
avatarLarge: {
  width: 70,
  height: 70,
  borderRadius: 40,
  marginBottom: 4,
},
medal: {
  fontSize: 24,
},
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
  },
  votingButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  votingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  makingCardVideo: {
    width: 110,
    height: 195,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  makingImageVideo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
});