import React, { useState } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { BackgroundPattern } from './BackgroundPattern';
import { StatusBar } from 'expo-status-bar';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { BackButton } from '@/components/BackButton';

export default function PhoneScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithPhoneNumber, setPhoneNumber: setAuthPhoneNumber } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 0) {
      formatted = `(${cleaned.slice(0, 3)}`;
      if (cleaned.length > 3) {
        formatted += `) ${cleaned.slice(3, 6)}`;
      }
      if (cleaned.length > 6) {
        formatted += `-${cleaned.slice(6, 10)}`;
      }
    }
    return formatted;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const handleNext = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    try {
      setIsLoading(true);
      const formattedNumber = `+1${phoneNumber.replace(/\D/g, '')}`;
      await signInWithPhoneNumber(formattedNumber);
      setAuthPhoneNumber(formattedNumber);
      router.push('/onboarding/verify');
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      <BackgroundPattern />

      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        
        <View style={styles.content}>
          <ThemedText style={styles.title}>
            Please enter your phone number
          </ThemedText>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              placeholder="(555) 555-5555"
              keyboardType="phone-pad"
              maxLength={14}
              placeholderTextColor="#6B6B6B"
              autoFocus={true}
              textContentType="telephoneNumber"
            />

            <View style={styles.arrowContainer}>
              <TouchableOpacity 
                style={[
                  styles.button,
                  (phoneNumber.length < 14 || isLoading) && styles.buttonDisabled
                ]} 
                onPress={handleNext}
                disabled={phoneNumber.length < 14 || isLoading}
              >
                <ThemedText style={[
                  styles.buttonText,
                  phoneNumber.length >= 14 && styles.buttonTextActive
                ]}>
                  →
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C1810',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: '#F5F1E8',
    letterSpacing: 0.5,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 20,
    color: '#F5F1E8',
    borderBottomWidth: 1,
    borderBottomColor: '#BF9B30',
    paddingVertical: 8,
    paddingRight: 40,
  },
  arrowContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingBottom: 8,
  },
  button: {
    padding: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Inter_500Medium',
    color: 'rgba(191, 155, 48, 0.3)',
    fontSize: 16,
  },
  buttonTextActive: {
    color: '#BF9B30',
    opacity: 1,
  },
});
