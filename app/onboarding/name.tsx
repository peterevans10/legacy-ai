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

export default function NameScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const handleNext = () => {
    router.push('/onboarding/gender');
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
              <ThemedText style={styles.title}>What's Your Name?</ThemedText>
              <ThemedText style={styles.subtitle}>
                This is how you'll be known in your Legacy
              </ThemedText>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>First Name</ThemedText>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter your first name"
                  placeholderTextColor="#6B6B6B"
                  autoFocus
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Last Name</ThemedText>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter your last name"
                  placeholderTextColor="#6B6B6B"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[
                styles.button,
                (!firstName.trim() || !lastName.trim()) && styles.buttonDisabled
              ]} 
              onPress={handleNext}
              disabled={!firstName.trim() || !lastName.trim()}
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
  form: {
    gap: 24,
    marginBottom: 32,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#2C1810', // Deep Library Brown
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFCF5', // Cream
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E0D5', // Subtle Border
    padding: 16,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#1A1A1A', // Ink Black
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
