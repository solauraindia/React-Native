import React from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import Toast from 'react-native-toast-message';
import { useAuth } from "@clerk/clerk-expo";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [code, setCode] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const onRequestCode = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signIn.create({
        strategy: "email_code",
        identifier: emailAddress,
      });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Account not found. Please check your email or sign up.',
      });
    }
  };

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      await setActive({ session: completeSignIn.createdSessionId });

      // Navigate after successful sign-in
      setTimeout(() => {
        router.replace("/");
      }, 0);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid code. Please try again.',
      });
    }
  };

  React.useEffect(() => {
    if (isSignedIn) {
      // Use setTimeout to delay the navigation
      setTimeout(() => {
        router.replace("/");
      }, 0);
    }
  }, [isSignedIn]);

  return (
    <View style={styles.container}>
      {!pendingVerification ? (
        <>
          <Text style={styles.header}>Sign In Using Email</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            value={emailAddress}
            placeholder="Email Address..."
            placeholderTextColor="#999"
            onChangeText={(email) => setEmailAddress(email)}
          />
          <Button onPress={onRequestCode} title="Request Code" />
        </>
      ) : (
        <>
          <Text style={styles.header}>Enter Verification Code</Text>
          <TextInput
            style={styles.input}
            value={code}
            placeholder="Code..."
            placeholderTextColor="#999"
            onChangeText={(code) => setCode(code)}
            keyboardType="number-pad"
          />
          <Button onPress={onSignInPress} title="Sign In" />
        </>
      )}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>No account?</Text>
        <Link href="/sign-up" asChild>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'white',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: 'white',
    marginRight: 5,
  },
  signupLink: {
    color: '#4287f5',
    textDecorationLine: 'underline',
  },
});