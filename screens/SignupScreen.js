// screens/SignupScreen.js
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '../firebase'; // Passe Pfad ggf. an

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSignup = async () => {
  if (!name || !username || !email || !password || !confirmPassword) {
    Alert.alert('Bitte alle Felder ausfüllen');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Passwörter stimmen nicht überein');
    return;
  }

  if (!agreed) {
    Alert.alert('Bitte Nutzungsbedingungen akzeptieren');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Profilname setzen
    await updateProfile(user, {
      displayName: username,
    });

    // Nutzerprofil in Firestore speichern
    await setDoc(doc(db, 'users', user.uid), {
      name,
      username,
      email,
      createdAt: new Date(),
    });

    navigation.replace('MainApp');
  } catch (error) {
    Alert.alert('Fehler bei der Registrierung', error.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SnapChamp Registrierung</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Accountname"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Passwort"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Passwort bestätigen"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Nutzungsbedingungen */}
      <Pressable onPress={() => setAgreed(!agreed)} style={styles.checkboxRow}>
        <View style={[styles.checkbox, agreed && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>Ich akzeptiere die Nutzungsbedingungen</Text>
      </Pressable>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Registrieren</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.loginText}>Bereits registriert? Jetzt einloggen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center', fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    fontSize: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#aaa',
    marginRight: 8,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#ffa500',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ffa500',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loginText: {
    fontSize: 14,
    color: '#007aff',
    textAlign: 'center',
  },
});
