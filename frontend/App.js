import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('login');

  const handleAuth = async () => {
    const url = mode === 'login' 
      ? 'http://10.0.2.2:3000/login' 
      : 'http://10.0.2.2:3000/register';
    const data = mode === 'login' 
      ? { username, password } 
      : { username, email, password };

    try {
      const response = await axios.post(url, data);
      Alert.alert('Succès', mode === 'login' ? 'Connecté !' : 'Inscrit !');
      console.log(response.data);
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.error || 'Erreur');
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>
        {mode === 'login' ? 'Connexion' : 'Inscription'}
      </Text>
      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      {mode === 'signup' && (
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
        />
      )}
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title={mode === 'login' ? 'Se connecter' : 'S\'inscrire'} onPress={handleAuth} />
      <Button
        title={mode === 'login' ? 'Aller à l\'inscription' : 'Se connecter'}
        onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
      />
    </View>
  );
}