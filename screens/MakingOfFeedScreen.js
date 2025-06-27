// screens/MakingOfFeedScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Video } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';

const { height } = Dimensions.get('window');

export default function MakingOfFeedScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { videos, startIndex = 0 } = route.params || {};

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const renderItem = ({ item }) => (
    <View style={styles.videoContainer}>
      <Video
        source={item.videoUri}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        shouldPlay
        isLooping
      />

      {/* Overlay: Buttons + Accountname */}
      <View style={styles.overlay}>
        <Text style={styles.accountName}>@{item.username || 'username'}</Text>

        <View style={styles.sideButtons}>
          <TouchableOpacity onPress={() => console.log('Like')}>
            <Text style={styles.button}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Text style={styles.button}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Teilen')}>
            <Text style={styles.button}>📤</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('VisitorProfile', { userId: item.userId })}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Zurück-Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Zurück</Text>
      </TouchableOpacity>

      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(event.nativeEvent.contentOffset.y / height);
          setCurrentIndex(index);
        }}
        initialScrollIndex={startIndex}
        getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
      />

      {/* Kommentare */}
      <Modal visible={showComments} transparent animationType="slide">
        <View style={styles.commentsOverlay}>
          <TouchableOpacity
            style={styles.closeButtonContainer}
            onPress={() => setShowComments(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.commentTitle}>Kommentare</Text>

          <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Kommentieren..."
          />
          <TouchableOpacity onPress={() => {
            console.log('Kommentar senden:', newComment);
            setNewComment('');
          }}>
            <Text style={styles.sendButton}>Senden</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: '#00000080',
    borderRadius: 6,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  videoContainer: { height, width: '100%' },
  overlay: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    justifyContent: 'space-between',
  },
  accountName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  sideButtons: {
    position: 'absolute',
    right: 10,
    bottom: 40,
    alignItems: 'center',
  },
  button: { fontSize: 26, color: '#fff', marginVertical: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginTop: 10 },

  commentsOverlay: {
    flex: 1,
    backgroundColor: '#000000dd',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  commentTitle: { color: '#fff', fontSize: 20, marginBottom: 10 },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 10,
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 6,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  sendButton: {
    marginTop: 10,
    color: '#ffa500',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

