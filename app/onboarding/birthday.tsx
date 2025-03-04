import { StyleSheet, View, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
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

export default function BirthdayScreen() {
  const router = useRouter();
  const [birthday, setBirthday] = useState('');
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const handleNext = () => {
    router.push('/onboarding/final');
  };

  const formatBirthday = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length > 0) {
      formatted = cleaned.slice(0, 2);
      if (cleaned.length > 2) {
        formatted += `/${cleaned.slice(2, 4)}`;
      }
      if (cleaned.length > 4) {
        formatted += `/${cleaned.slice(4, 8)}`;
      }
    }
    return formatted;
  };

  const isValidDate = (dateString: string) => {
    if (dateString.length !== 10) return false;
    
    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const currentYear = new Date().getFullYear();
    
    return date.getMonth() === month - 1 && 
           date.getDate() === day && 
           date.getFullYear() === year &&
           year >= 1900 && 
           year <= currentYear;
  };

  const handleBirthdayChange = (text: string) => {
    const formatted = formatBirthday(text);
    setBirthday(formatted);
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
              When is your birthday?
            </ThemedText>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={birthday}
                onChangeText={handleBirthdayChange}
                placeholder="MM/DD/YYYY"
                keyboardType="number-pad"
                maxLength={10}
                placeholderTextColor="#6B6B6B"
                autoFocus={true}
              />

              <View style={styles.arrowContainer}>
                <TouchableOpacity 
                  style={[
                    styles.button,
                    !isValidDate(birthday) && styles.buttonDisabled
                  ]} 
                  onPress={handleNext}
                  disabled={!isValidDate(birthday)}
                >
                  <ThemedText style={[
                    styles.buttonText,
                    isValidDate(birthday) && styles.buttonTextActive
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
    paddingRight: 8,
  },
  button: {
    padding: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 20,
    color: '#6B6B6B',
  },
  buttonTextActive: {
    color: '#BF9B30', // Gold Accent
  },
});
