// screens/SpinRewardScreen.js
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SpinRewardScreen() {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const [spinning, setSpinning] = useState(false);
  const [resultText, setResultText] = useState('');

  const startSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setResultText('');

    const spinTo = 360 * 10 + Math.floor(Math.random() * 360);

    Animated.timing(spinAnim, {
      toValue: spinTo,
      duration: 4000,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease)
    }).start(() => {
      setSpinning(false);
      setResultText('🎉 Glückwunsch! Du hast gewonnen!');
      spinAnim.setValue(spinTo % 360); // Reset für nächste Runde
    });
  };

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎰 Glücksrad</Text>
      <View style={styles.wheelWrapper}>
        <Animated.Image
          source={require('../assets/spinwheel.png')} // Transparentes PNG Rad
          style={[styles.wheel, { transform: [{ rotate: spinInterpolate }] }]}
        />
        <Image
          source={require('../assets/spinpointer.png')} // Zeiger-Bild
          style={styles.pointer}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={startSpin}>
        <Text style={styles.buttonText}>{spinning ? 'Dreht...' : 'Jetzt drehen'}</Text>
      </TouchableOpacity>
      {resultText !== '' && <Text style={styles.result}>{resultText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  wheelWrapper: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheel: {
    width: '100%',
    height: '100%',
  },
  pointer: {
    position: 'absolute',
    width: 40,
    height: 40,
    top: -20,
    resizeMode: 'contain',
    zIndex: 2,
  },
  button: {
    backgroundColor: '#ffa500',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  result: {
    marginTop: 24,
    fontSize: 18,
    color: '#444',
  },
});
