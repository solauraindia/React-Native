import React from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import Toast from 'react-native-toast-message';
import { useAuth } from "@clerk/clerk-expo";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [code, setCode] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to sign up. Please try again.',
      });
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      
      // Navigate after successful sign-up and verification
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
          <Text style={styles.header}>Sign Up Using Email</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            value={emailAddress}
            placeholder="Email Address..."
            placeholderTextColor="#999"
            onChangeText={(email) => setEmailAddress(email)}
          />
          <Button onPress={onSignUpPress} title="Sign Up" />
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
          <Button onPress={onPressVerify} title="Verify Email" />
        </>
      )}
      <View style={styles.signinContainer}>
        <Text style={styles.signinText}>Already have an account?</Text>
        <Link href="/sign-in" asChild>
          <TouchableOpacity>
            <Text style={styles.signinLink}>Sign in</Text>
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
  signinContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signinText: {
    color: 'white',
    marginRight: 5,
  },
  signinLink: {
    color: '#4287f5',
    textDecorationLine: 'underline',
  },
});