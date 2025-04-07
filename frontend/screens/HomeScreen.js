import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeScreen({ route }) {
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const { setIsLoggedIn } = route.params;
  
  useEffect(() => {
    // Charger les informations utilisateur
    const loadUserInfo = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        if (userInfoString) {
          setUserInfo(JSON.parse(userInfoString));
        }
      } catch (error) {
        console.log('Erreur lors du chargement des informations utilisateur', error);
      }
    };
    
    // Connexion WebSocket
    const ws = new WebSocket('ws://10.0.2.2:8080');
        
    ws.onopen = () => {
      console.log('WebSocket connecté');
      ws.send('Hello from React Native');
    };
    
    ws.onmessage = (event) => {
      console.log('Message reçu:', event.data);
      setMessages(prev => [...prev, event.data]);
    };
    
    ws.onerror = (error) => {
      console.log('Erreur WebSocket:', error);
    };
    
    loadUserInfo();
    
    // Nettoyage
    return () => {
      ws.close();
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      // Supprimer le token et les informations utilisateur
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      
      // Supprimer le header d'autorisation
      delete axios.defaults.headers.common['Authorization'];
      
      // Mettre à jour l'état de connexion
      setIsLoggedIn(false);
    } catch (error) {
      console.log('Erreur lors de la déconnexion', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenue, {userInfo?.username || 'Utilisateur'} !</Text>
      
      <View style={styles.messagesContainer}>
        <Text style={styles.subtitle}>Messages WebSocket:</Text>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Text style={styles.message}>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      
      <Button
        title="Se déconnecter"
        onPress={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  message: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});