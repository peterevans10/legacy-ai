import { StyleSheet, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';

export default function VerifyScreen() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const handleVerify = () => {
    // TODO: Implement verification logic
    // For now, just proceed to name screen
    router.push('/onboarding/name');
  };

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-advance to next input
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
              <ThemedText style={styles.title}>Enter Verification Code</ThemedText>
              <ThemedText style={styles.subtitle}>
                We sent a 6-digit code to your phone number
              </ThemedText>
            </View>

            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => inputRefs.current[index] = ref}
                  style={styles.codeInput}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            <TouchableOpacity 
              style={[
                styles.button,
                !code.every(digit => digit !== '') && styles.buttonDisabled
              ]} 
              onPress={handleVerify}
              disabled={!code.every(digit => digit !== '')}
            >
              <ThemedText style={styles.buttonText}>
                Verify
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendButton}>
              <ThemedText style={styles.resendText}>
                Resend Code
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: 45,
    height: 56,
    backgroundColor: '#FFFCF5', // Cream
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E0D5', // Subtle Border
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Inter_500Medium',
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
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#E5E0D5', // Subtle Border
  },
  buttonText: {
    fontFamily: 'Inter_500Medium',
    color: '#1A1A1A',
    fontSize: 16,
  },
  resendButton: {
    alignItems: 'center',
    padding: 8,
  },
  resendText: {
    fontFamily: 'Inter_400Regular',
    color: '#8B4513', // Leather Brown
    fontSize: 14,
  },
});
