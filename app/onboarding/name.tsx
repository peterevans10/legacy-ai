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

export default function NameScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
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
              What's your name?
            </ThemedText>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                keyboardType="default"
                autoCapitalize="words"
                placeholderTextColor="#6B6B6B"
                autoFocus={true}
                textContentType="name"
              />

              <View style={styles.arrowContainer}>
                <TouchableOpacity 
                  style={[
                    styles.button,
                    name.trim().length < 2 && styles.buttonDisabled
                  ]} 
                  onPress={handleNext}
                  disabled={name.trim().length < 2}
                >
                  <ThemedText style={[
                    styles.buttonText,
                    name.trim().length >= 2 && styles.buttonTextActive
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
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: '#F5F1E8',
    marginBottom: 24,
    letterSpacing: 0.5,
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
