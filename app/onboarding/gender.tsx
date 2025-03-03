import { StyleSheet, View, TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Gender = 'male' | 'female' | 'other' | null;

export default function GenderScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<Gender>(null);
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const handleNext = () => {
    router.push('/onboarding/birthday');
  };

  const GenderOption = ({ gender, icon, label }: { gender: Gender, icon: string, label: string }) => (
    <TouchableOpacity 
      style={[
        styles.optionButton,
        selectedGender === gender && styles.optionButtonSelected
      ]}
      onPress={() => setSelectedGender(gender)}
    >
      <MaterialCommunityIcons 
        name={icon as any} 
        size={24} 
        color={selectedGender === gender ? '#BF9B30' : '#6B6B6B'}
      />
      <ThemedText style={[
        styles.optionText,
        selectedGender === gender && styles.optionTextSelected
      ]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>What's Your Gender?</ThemedText>
            <ThemedText style={styles.subtitle}>
              This helps us personalize your experience
            </ThemedText>
          </View>

          <View style={styles.options}>
            <GenderOption 
              gender="male" 
              icon="gender-male" 
              label="Male"
            />
            <GenderOption 
              gender="female" 
              icon="gender-female" 
              label="Female"
            />
            <GenderOption 
              gender="other" 
              icon="gender-non-binary" 
              label="Non-binary / Other"
            />
          </View>

          <RNTouchableOpacity 
            style={[
              styles.button,
              !selectedGender && styles.buttonDisabled
            ]} 
            onPress={handleNext}
            disabled={!selectedGender}
          >
            <ThemedText style={styles.buttonText}>
              Continue
            </ThemedText>
          </RNTouchableOpacity>
        </View>
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
  options: {
    gap: 16,
    marginBottom: 32,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFCF5', // Cream
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E0D5', // Subtle Border
    padding: 16,
  },
  optionButtonSelected: {
    borderColor: '#BF9B30', // Gold Accent
    backgroundColor: '#FFFCF5', // Cream
  },
  optionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#6B6B6B', // Faded Text
  },
  optionTextSelected: {
    color: '#2C1810', // Deep Library Brown
    fontFamily: 'Inter_500Medium',
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
