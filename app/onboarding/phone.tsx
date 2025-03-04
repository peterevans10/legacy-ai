import { StyleSheet, View, TextInput, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { BackButton } from '@/components/BackButton';
import { useAuth } from '@/contexts/AuthContext';

const BackgroundPattern = () => {
  // Create a subtle leather/book texture effect
  const lines = 15; // Reduced number of lines
  
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.patternContainer}>
        {Array(lines).fill(0).map((_, i) => {
          const randomWidth = Math.random() * 1 + 0.5; // Random width between 0.5 and 1.5
          const randomOpacity = Math.random() * 0.015 + 0.005; // Random opacity between 0.005 and 0.02
          
          return (
            <View 
              key={i} 
              style={[
                styles.verticalLine,
                { 
                  left: `${(i / lines) * 100}%`,
                  width: randomWidth,
                  opacity: randomOpacity
                }
              ]} 
            />
          );
        })}
      </View>
    </View>
  );
};

export default function PhoneScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const { signInWithPhoneNumber, setPhoneNumber: setAuthPhoneNumber } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const handleNext = async () => {
    if (phoneNumber.length < 14) return;
    
    setLoading(true);
    try {
      const formattedNumber = '+1' + phoneNumber.replace(/\D/g, '');
      setAuthPhoneNumber(formattedNumber);
      await signInWithPhoneNumber(formattedNumber);
      router.push('/onboarding/verify');
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert(
        'Error',
        'Failed to send verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
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
      <StatusBar style="light" />
      
      {/* Subtle background pattern */}
      <BackgroundPattern />

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <SafeAreaView style={styles.safeArea}>
          <BackButton />
          
          <View style={styles.content}>
          </View>

          <View style={styles.inputWrapper}>
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
                editable={!loading}
              />

              <View style={styles.arrowContainer}>
                <TouchableOpacity 
                  style={[
                    styles.button,
                    (phoneNumber.length < 14 || loading) && styles.buttonDisabled
                  ]} 
                  onPress={handleNext}
                  disabled={phoneNumber.length < 14 || loading}
                >
                  <ThemedText style={[
                    styles.buttonText,
                    phoneNumber.length >= 14 && !loading && styles.buttonTextActive
                  ]}>
                    →
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C1810', // Deep Library Brown
  },
  keyboardAvoid: {
    flex: 1,
  },
  patternContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  verticalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#BF9B30', // Gold Accent
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  inputWrapper: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  bottomContent: {
    paddingHorizontal: 20,
    marginBottom: 20, // Space from keyboard
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: '#F5F1E8', // Aged Paper
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 20,
    color: '#F5F1E8', // Aged Paper
    borderBottomWidth: 1,
    borderBottomColor: '#BF9B30', // Gold Accent
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
  buttonText: {
    fontFamily: 'Inter_500Medium',
    color: 'rgba(191, 155, 48, 0.3)', // Faded gold
    fontSize: 16,
  },
  buttonTextActive: {
    color: '#BF9B30', // Gold Accent
    opacity: 1
  },
});
