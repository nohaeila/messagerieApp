import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, route }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { setIsLoggedIn } = route.params;

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await axios.post('http://10.0.2.2:3000/login', { username, password });
      
      // Stocker le token
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
      
      // Configurer le header par défaut pour les futures requêtes
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Mettre à jour l'état de connexion
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
      Alert.alert('Erreur', error.response?.data?.error || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Button 
        title="Se connecter" 
        onPress={handleLogin} 
        disabled={isLoading}
      />
      
      <Button
        title="S'inscrire"
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});