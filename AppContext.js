import React, { createContext, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Stelle sicher, dass das der Pfad zu deiner firebase.js ist

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    username: 'MeinName',
    bio: '',
    location: '',
    website: '',
    imageUri: null,
  });

  const [challengeImages, setChallengeImages] = useState([]);
  const [userSubmittedImage, setUserSubmittedImage] = useState(null);
  const [xp, setXp] = useState(0);
  const [makingOfs, setMakingOfs] = useState([]);
  const [communities, setCommunities] = useState([]);

  // 🔥 Lade die Challenge-Bilder aus Firestore beim App-Start
  useEffect(() => {
    const loadChallengeEntries = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'challengeEntries'));
        const entries = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            uri: data.imageUrl, // wichtig für <Image source={{ uri: ... }} />
          };
        });
        setChallengeImages(entries);
      } catch (err) {
        console.error('❌ Fehler beim Laden der Challenge-Bilder:', err);
      }
    };

    loadChallengeEntries();
  }, []);

  return (
    <AppContext.Provider
      value={{
        userSubmittedImage,
        setUserSubmittedImage,
        profile,
        setProfile,
        challengeImages,
        setChallengeImages,
        xp,
        setXp,
        makingOfs,
        setMakingOfs,
        communities,
        setCommunities,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
