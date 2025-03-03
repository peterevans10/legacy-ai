import { StyleSheet, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';

export default function PhoneScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const handleNext = () => {
    // TODO: Implement phone verification
    router.push('/onboarding/verify');
  };

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <ThemedText style={styles.title}>Enter Your Phone Number</ThemedText>
              <ThemedText style={styles.subtitle}>
                We'll send you a verification code to get started
              </ThemedText>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                placeholder="(555) 555-5555"
                keyboardType="phone-pad"
                maxLength={14}
                placeholderTextColor="#6B6B6B"
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.button,
                phoneNumber.length < 14 && styles.buttonDisabled
              ]} 
              onPress={handleNext}
              disabled={phoneNumber.length < 14}
            >
              <ThemedText style={styles.buttonText}>
                Continue
              </ThemedText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8', // Aged Paper
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    gap: 12,
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 24,
    color: '#2C1810', // Deep Library Brown
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#6B6B6B', // Faded Text
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#FFFCF5', // Cream
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E0D5', // Subtle Border
    padding: 16,
    marginBottom: 24,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    color: '#1A1A1A', // Ink Black
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#BF9B30', // Gold Accent
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#E5E0D5', // Subtle Border
  },
  buttonText: {
    fontFamily: 'Inter_500Medium',
    color: '#1A1A1A',
    fontSize: 16,
  },
});
