// screens/VotingScreen.js
import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Pressable, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { incrementVoteCount } from '../utils/VoteTracker';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../AppContext';

const defaultVotingImages = [
  require('../assets/vote1.jpg'),
  require('../assets/vote2.jpg'),
  require('../assets/vote3.jpg'),
];

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function VotingScreen() {
  const navigation = useNavigation();
  const { userSubmittedImage, challengeImages, xp, setXp, setChallengeImages } = useContext(AppContext);

  const votingImages =
   challengeImages.length > 0
    ? [...challengeImages, ...defaultVotingImages]
    : defaultVotingImages;

  const [index, setIndex] = useState(0);
  const [highlightGiven, setHighlightGiven] = useState(false);
  const [highlightUsedToday, setHighlightUsedToday] = useState(false);
  const [particles, setParticles] = useState([]);
  const [selectedStars, setSelectedStars] = useState(0);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const xpAnim = useRef(new Animated.Value(0)).current;

  const handleHighlight = () => {
    if (!highlightUsedToday) {
      setHighlightGiven(true);
      setHighlightUsedToday(true);
      setSelectedStars(6); // Highlight = 6 Sterne
      triggerParticles();

      setTimeout(() => {
        setParticles([]);
      }, 1500);
    }
  };

  const handleStarPress = (starValue) => {
    setSelectedStars(starValue);
  };

 const submitVote = () => {
  if (selectedStars > 0) {
    const newCount = incrementVoteCount();
    setVoteSubmitted(true);

const xpAmount = selectedStars === 6 ? 20 : 10;
setXpGained(xpAmount);
setXp((prev) => prev + xpAmount);
setShowXp(true);
xpAnim.setValue(0);

Animated.timing(xpAnim, {
  toValue: 1,
  duration: 1000,
  useNativeDriver: true,
}).start(() => setShowXp(false));

// 🧠 Wichtig: Bewertung im Bild speichern
if (index < challengeImages.length) {
  setChallengeImages((prev) => {
    const updated = [...prev];
    const original = prev[index];

    // defensiv kopieren, um freeze zu umgehen
    const currentImage = { ...original };

    currentImage.voteCount = (currentImage.voteCount || 0) + 1;
    currentImage.totalStars = (currentImage.totalStars || 0) + selectedStars;
    currentImage.stars = currentImage.totalStars / currentImage.voteCount;

    if (selectedStars === 6) {
      currentImage.likes = (currentImage.likes || 0) + 1;
    }

    updated[index] = currentImage;
    return updated;
  });
}

    // Weiter zum nächsten Bild
    setTimeout(() => {
      setVoteSubmitted(false);
      setSelectedStars(0);
      setHighlightGiven(false);
      setIndex((prev) => (prev + 1) % votingImages.length);
    }, 1000);

    if (newCount % 25 === 0) {
      navigation.navigate('SpinRewardScreen');
    }
  }
};

  const triggerParticles = () => {
    const newParticles = Array.from({ length: 80 }).map((_, i) => {
      const anim = new Animated.Value(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }).start();

      const column = i % 20;
      const row = Math.floor(i / 20);

      return {
        id: i,
        left: (screenWidth / 20) * column + (row % 2 === 0 ? 5 : 0),
        size: Math.random() * 14 + 10,
        opacity: Math.random() * 0.5 + 0.5,
        animation: anim,
      };
    });
    setParticles(newParticles);
  };

  return (
    <View style={styles.fullscreen}>
      <ScrollView contentContainerStyle={styles.scrollWrapper}>
        <Pressable style={styles.imageContainer} onLongPress={handleHighlight}>
          {typeof votingImages[index] === 'string' ? (
            <Image source={{ uri: votingImages[index] }} style={styles.image} />
          ) : (
            <Image source={votingImages[index]} style={styles.image} />
          )}

          {particles.map((p) => (
            <Animated.View
              key={p.id}
              style={[styles.particle, {
                left: p.left,
                opacity: p.opacity,
                width: p.size,
                height: p.size,
                transform: [{
                  translateY: p.animation.interpolate({ inputRange: [0, 1], outputRange: [0, screenHeight * 0.6] })
                }]
              }]}
            >
              <Text style={{ fontSize: p.size * 0.8 }}>✨</Text>
            </Animated.View>
          ))}

          {showXp && (
            <Animated.View style={[styles.xpPopup, {
              opacity: xpAnim,
              transform: [{
                translateY: xpAnim.interpolate({ inputRange: [0, 1], outputRange: [20, -30] })
              }]
            }]}
            >
              <Text style={styles.xpText}>+{xpGained} XP</Text>
            </Animated.View>
          )}
        </Pressable>

        <View style={styles.voteBox}>
          <Text style={styles.text}>Wie gefällt dir dieses Bild?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                <Text style={[styles.star, selectedStars >= star && styles.starSelected]}>⭐</Text>
              </TouchableOpacity>
            ))}
            {selectedStars === 6 && <Text style={[styles.star, styles.starSelected]}>💖</Text>}
          </View>
          <TouchableOpacity
            style={[styles.submitButton, selectedStars === 0 && { opacity: 0.4 }]}
            onPress={submitVote}
            disabled={selectedStars === 0}
          >
            <Text style={styles.submitText}>Abstimmen</Text>
          </TouchableOpacity>
          {highlightGiven ? (
            <Text style={styles.info}>💖 Highlight wurde vergeben (6 Sterne)!</Text>
          ) : highlightUsedToday ? (
            <Text style={styles.info}>💖 Highlight heute bereits vergeben</Text>
          ) : (
            <Text style={styles.info}>💖 Halte den Finger auf das Bild & zeichne ein Herz für ein Highlight-Vote</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollWrapper: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: screenWidth,
    height: screenHeight * 0.58,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '90%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  voteBox: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center'
  },
  starsRow: {
    flexDirection: 'row',
    marginVertical: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  star: {
    fontSize: 37,
    marginHorizontal: 4,
    opacity: 0.4,
  },
  starSelected: {
    opacity: 1,
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#ffa500',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  particle: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  xpPopup: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  xpText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
