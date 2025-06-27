import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function VisitorProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  const { name, thumb } = route.params;

  // Dummy Top 3 Bilder
  const top3 = [
    require('../assets/vote1.jpg'),
    require('../assets/vote2.jpg'),
    require('../assets/vote3.jpg'),
  ];

  // Dummy Making-Ofs
  const makingOfs = [
    require('../assets/vote1.jpg'),
    require('../assets/vote2.jpg'),
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Zurück-Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Zurück</Text>
      </TouchableOpacity>

      {/* Top 3 Bilder */}
      <View style={styles.topImagesRow}>
        {top3.map((img, index) => (
          <Image key={index} source={img} style={styles.topImage} />
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
         <Image source={thumb} style={styles.profilePic} />
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

      {/* Nutzername */}
      <Text style={styles.username}>{name}</Text>

{/* Level-Anzeige */}
<Text style={styles.levelText}>🧬 Level 7 – 642 XP</Text>
<View style={styles.xpBarBackground}>
  <View style={[styles.xpBarFill, { width: '42%' }]} /> {/* 642 XP → 42% zu Level 8 */}
</View>

      {/* Follow + Donate Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.buttonText}>Folgen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.donateButton}>
          <Text style={styles.buttonText}>Donate</Text>
        </TouchableOpacity>
      </View>

      {/* Making-Ofs */}
      <Text style={styles.sectionTitle}>🎬 Making-Ofs</Text>
      <View style={styles.makingOfRow}>
        {makingOfs.map((img, index) => (
          <Image key={index} source={img} style={styles.makingOfThumb} />
        ))}
      </View>

{/* Challenge-Beiträge */}
<Text style={styles.sectionTitle}>🏆 Challenge-Beiträge</Text>
<View style={styles.galleryContainer}>
  {[require('../assets/vote1.jpg'), require('../assets/vote2.jpg')].map((img, index) => (
    <Image key={index} source={img} style={styles.galleryImage} />
  ))}
</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
  },
  backText: {
    fontSize: 16,
    color: '#007aff',
  },
  topImagesRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  topImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 4,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  followButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  donateButton: {
    backgroundColor: '#d2691e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 28,
    marginBottom: 12,
  },
  makingOfRow: {
    flexDirection: 'row',
    gap: 12,
  },
  makingOfThumb: {
    width: 110,
    height: 180,
    borderRadius: 12,
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
verticalNumber: {
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 4,
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
  lineHeight: 20, // oder 18 bei verticalText
},
profileRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
},
levelText: {
  marginTop: 8,
  fontWeight: '600',
  color: '#333',
},

xpBarBackground: {
  width: '60%',
  height: 10,
  backgroundColor: '#e0e0e0',
  borderRadius: 5,
  marginTop: 6,
  marginBottom: 10,
  alignSelf: 'center',
},

xpBarFill: {
  height: 10,
  backgroundColor: '#ffa500',
  borderRadius: 5,
},
galleryContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  marginTop: 12,
  paddingHorizontal: 12,
},
galleryImage: {
  width: 100,
  height: 100,
  borderRadius: 10,
  marginBottom: 12,
},
});

