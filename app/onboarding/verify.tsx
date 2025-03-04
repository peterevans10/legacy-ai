import { StyleSheet, View, TextInput, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { BackButton } from '@/components/BackButton';
import { useAuth } from '@/contexts/AuthContext';

const BackgroundPattern = () => {
  const lines = 15;
  
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.patternContainer}>
        {Array(lines).fill(0).map((_, i) => {
          const randomWidth = Math.random() * 1 + 0.5;
          const randomOpacity = Math.random() * 0.015 + 0.005;
          
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

export default function VerifyScreen() {
  const router = useRouter();
  const { phoneNumber, confirmCode } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const handleNext = async () => {
    if (code.length !== 6) return;
    
    setLoading(true);
    try {
      await confirmCode(code);
      router.push('/onboarding/birthday');
    } catch (error) {
      console.error('Error confirming code:', error);
      Alert.alert(
        'Error',
        'Invalid verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setCode(cleaned);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
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
              Enter verification code
            </ThemedText>
            
            <ThemedText style={styles.subtitle}>
              Code sent to {phoneNumber}
            </ThemedText>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={handleCodeChange}
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor="#6B6B6B"
                autoFocus={true}
                editable={!loading}
              />

              <View style={styles.arrowContainer}>
                <TouchableOpacity 
                  style={[
                    styles.button,
                    (code.length !== 6 || loading) && styles.buttonDisabled
                  ]} 
                  onPress={handleNext}
                  disabled={code.length !== 6 || loading}
                >
                  <ThemedText style={[
                    styles.buttonText,
                    code.length === 6 && !loading && styles.buttonTextActive
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
    backgroundColor: '#2C1810',
  },
  keyboardAvoid: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
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
    backgroundColor: '#BF9B30',
  },
  inputWrapper: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: '#F5F1E8',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#6B6B6B',
    marginBottom: 24,
  },
  inputContainer: {
    position: 'relative',
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
    backgroundColor: '#D1D1D1',
  },
  buttonText: {
    fontFamily: 'Inter_500Medium',
    color: 'rgba(191, 155, 48, 0.3)',
    fontSize: 16,
  },
  buttonTextActive: {
    color: '#BF9B30',
    opacity: 1
  },
});
