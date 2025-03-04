import { StyleSheet, View, Platform, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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

type Gender = 'male' | 'female' | 'other' | 'non_binary' | null;

export default function GenderScreen() {
  const router = useRouter();
  const [gender, setGender] = useState<Gender>(null);
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender);
    router.push('/onboarding/birthday');
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
            <ThemedText style={styles.title}>
              What's your gender?
            </ThemedText>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.option,
                  gender === 'male' && styles.optionSelected
                ]}
                onPress={() => handleGenderSelect('male')}
              >
                <ThemedText style={[
                  styles.optionText,
                  gender === 'male' && styles.optionTextSelected
                ]}>
                  Male
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  gender === 'female' && styles.optionSelected
                ]}
                onPress={() => handleGenderSelect('female')}
              >
                <ThemedText style={[
                  styles.optionText,
                  gender === 'female' && styles.optionTextSelected
                ]}>
                  Female
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  gender === 'non_binary' && styles.optionSelected
                ]}
                onPress={() => handleGenderSelect('non_binary')}
              >
                <ThemedText style={[
                  styles.optionText,
                  gender === 'non_binary' && styles.optionTextSelected
                ]}>
                  Non-Binary
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  gender === 'other' && styles.optionSelected
                ]}
                onPress={() => handleGenderSelect('other')}
              >
                <ThemedText style={[
                  styles.optionText,
                  gender === 'other' && styles.optionTextSelected
                ]}>
                  Other
                </ThemedText>
              </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: '#F5F1E8',
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    borderWidth: 1,
    borderColor: 'rgba(191, 155, 48, 0.3)',
    borderRadius: 12,
    padding: 16,
  },
  optionSelected: {
    borderColor: '#BF9B30',
    backgroundColor: 'rgba(191, 155, 48, 0.1)',
  },
  optionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: 'rgba(245, 241, 232, 0.7)',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#F5F1E8',
  },
});
