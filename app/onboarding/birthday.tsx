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
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useSuperwall } from '@/hooks/useSuperwall';
import { SUPERWALL_TRIGGERS, SUPERWALL_PARAMS } from '@/config/superwall';

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
  const { updateOnboardingData, saveUserProfile, onboardingData, setIsOnboarded } = useOnboarding();
  const { showPaywall } = useSuperwall();
  const [loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const handleNext = async () => {
    try {
      setLoading(true);
      
      // Convert MM/DD/YYYY to YYYY-MM-DD
      const [month, day, year] = birthday.split('/');
      const isoDate = `${year}-${month}-${day}`;
      
      // Update onboarding data with birthdate
      await updateOnboardingData({ birthdate: isoDate });
      
      // Save the complete user profile
      await saveUserProfile();
      
      // Show paywall directly instead of navigating to final screen
      const paywallParams = {
        // Pass user data for personalization
        user_name: onboardingData.name || 'there',
        // Pass subscription pricing information
        monthly_price: SUPERWALL_PARAMS.SUBSCRIPTION_PRICE.MONTHLY,
        yearly_price: SUPERWALL_PARAMS.SUBSCRIPTION_PRICE.YEARLY,
        monthly_equivalent: SUPERWALL_PARAMS.SUBSCRIPTION_PRICE.YEARLY_MONTHLY_EQUIVALENT,
        discount: SUPERWALL_PARAMS.SUBSCRIPTION_PRICE.DISCOUNT_PERCENTAGE,
        trial_period: SUPERWALL_PARAMS.TRIAL_PERIOD,
        // Add any other parameters needed for the paywall
        current_date: new Date().toLocaleDateString(),
      };
      
      try {
        // Ensure the user is marked as onboarded before showing the paywall
        // This is already done by saveUserProfile, but we'll do it again to be sure
        await setIsOnboarded(true);
        
        // Show the paywall and wait for it to complete
        console.log('[Birthday] Showing paywall...');
        const hasSubscription = await showPaywall(SUPERWALL_TRIGGERS.ONBOARDING, paywallParams);
        console.log('[Birthday] Paywall result:', hasSubscription);
        
        // Add a delay to ensure the paywall has time to appear
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Only navigate if the paywall has been dismissed or completed
        console.log('[Birthday] Navigating to tabs...');
        
        // For debugging in development, show an alert before navigating
        if (__DEV__) {
          Alert.alert(
            'Navigation',
            'Navigating to tabs after paywall',
            [
              {
                text: 'OK',
                onPress: () => {
                  router.replace('/(tabs)');
                }
              }
            ]
          );
        } else {
          router.replace('/(tabs)');
        }
      } catch (paywallError) {
        console.error('[Birthday] Error showing paywall:', paywallError);
        Alert.alert(
          'Paywall Error',
          'There was an issue showing the subscription options. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert(
        'Error',
        'There was a problem saving your profile. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
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
                    (!isValidDate(birthday) || loading) && styles.buttonDisabled
                  ]} 
                  onPress={handleNext}
                  disabled={!isValidDate(birthday) || loading}
                >
                  <ThemedText style={[
                    styles.buttonText,
                    isValidDate(birthday) && !loading && styles.buttonTextActive
                  ]}>
                    {loading ? '...' : '→'}
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
