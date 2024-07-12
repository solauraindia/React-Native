import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect,Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ImageProvider } from './context/ImageContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), 
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ImageProvider>
          <SignedIn>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="explore" options={{ headerShown: false }} />
              <Stack.Screen name="preview" options={{ headerShown: false }} />
              <Stack.Screen name="id" options={{ headerShown: false }} />
              <Stack.Screen name="camera" options={{ headerShown: false }} />
              <Stack.Screen name="map" options={{ headerShown: false }} />
              <Stack.Screen name="profile" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </SignedIn>
          <SignedOut>
            <Stack>
              <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
            </Stack>
          </SignedOut>
        </ImageProvider>
      </ThemeProvider>
      <Toast />
    </ClerkProvider>
  );
}