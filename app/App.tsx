// App.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Splash from './Splash';

export type RootStackParamList = {
  Onboarding: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const onboarded = await AsyncStorage.getItem('@onboarding_complete');
      setHasOnboarded(onboarded === 'true');
      setIsLoading(false);
    };
    checkOnboardingStatus();
  }, []);

  if (isLoading) return <Splash />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {hasOnboarded ? (
          <Stack.Screen name="Profile" component={Profile} />
        ) : (
          <Stack.Screen name="Onboarding">
            {(props) => (
              <Onboarding
                {...props}
                onComplete={async () => {
                  await AsyncStorage.setItem('@onboarding_complete', 'true');
                  setHasOnboarded(true);
                }}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
