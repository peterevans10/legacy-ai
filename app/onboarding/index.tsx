import { StyleSheet, View, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import Animated, { 
  withTiming, 
  useAnimatedStyle, 
  useSharedValue,
  runOnJS
} from 'react-native-reanimated';

const words = ['Document', 'Share', 'Immortalize'];

export default function WelcomeScreen() {
  const router = useRouter();
  const [currentWord, setCurrentWord] = useState(words[0]);
  const opacity = useSharedValue(1);
  
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    let currentIndex = 0;

    const animateNextWord = () => {
      currentIndex = (currentIndex + 1) % words.length;
      opacity.value = withTiming(0, { duration: 800 }, () => {
        // Fade in new word
        runOnJS(setCurrentWord)(words[currentIndex]);
        opacity.value = withTiming(1, { duration: 800 });
      });
    };

    const interval = setInterval(animateNextWord, 3500);
    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleNext = () => {
    router.push('/onboarding/phone');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      <Image 
        source={require('@/assets/images/library-bg.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>
            Legacy AI
          </ThemedText>
          
          <Animated.Text style={[styles.subtitle, animatedStyle]}>
            {currentWord}
          </Animated.Text>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleNext}
        >
          <ThemedText style={styles.buttonText}>
            Begin Your Legacy
          </ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C1810',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(44, 24, 16, 0.4)',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40, // Add padding to top
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Align to top instead of center
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 140 : 100, // Space from top
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 50,
    color: '#BF9B30',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 48,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 20,
    color: '#F5F1E8',
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#BF9B30',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    marginBottom: Platform.OS === 'ios' ? 16 : 24,
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    color: '#2C1810',
    textAlign: 'center',
  },
});