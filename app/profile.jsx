import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut, isLoaded } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Add a small delay before navigation
      setTimeout(() => {
        router.replace('/(auth)/sign-in');
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!isLoaded) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (!user) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {/* <Text style={styles.info}>Email: {user.primaryEmailAddress?.emailAddress}</Text> */}
      <Text style={styles.info}>Phone Number: {user.primaryPhoneNumber?.phoneNumber}</Text>
      {/* <Text style={styles.info}>User ID: {user.id}</Text> */}
      {/* <Text style={styles.info}>First Name: {user.firstName}</Text> */}
      {/* <Text style={styles.info}>Last Name: {user.lastName}</Text> */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  signOutButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});