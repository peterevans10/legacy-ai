import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';

export default function WelcomeScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const handleNext = () => {
    router.push('/onboarding/phone');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.main}>
            <MaterialCommunityIcons name="book-open-page-variant" size={64} color="#BF9B30" />
            <ThemedText style={styles.title}>
              Legacy AI
            </ThemedText>
            <View style={styles.subtitleContainer}>
              <ThemedText style={styles.subtitle}>
                Document your personal legacy through daily questions and shared stories
              </ThemedText>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <ThemedText style={styles.buttonText}>
              Begin Your Legacy
            </ThemedText>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingVertical: 48,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 32,
    color: '#2C1810', // Deep Library Brown
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  subtitleContainer: {
    paddingHorizontal: 32,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#1A1A1A', // Ink Black
    opacity: 0.85,
    textAlign: 'center',
    lineHeight: 24,
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
  buttonText: {
    fontFamily: 'Inter_500Medium',
    color: '#1A1A1A',
    fontSize: 16,
  },
});