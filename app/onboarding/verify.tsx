import React, { useState } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { BackgroundPattern } from './BackgroundPattern';
import { StatusBar } from 'expo-status-bar';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { BackButton } from '@/components/BackButton';
import { usersService } from '@/services/users';
import { useSuperwall } from '@/hooks/useSuperwall';
import { SUPERWALL_TRIGGERS, SUPERWALL_PARAMS } from '@/config/superwall';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function VerifyScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { confirmCode, phoneNumber, signInWithPhoneNumber } = useAuth();
  const { showPaywall, checkSubscription } = useSuperwall();
  const { setIsOnboarded } = useOnboarding();
  const [code, setCode] = useState('');
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid verification code');
      return;
    }

    try {
      setIsLoading(true);
      
      // First confirm the code to authenticate the user
      await confirmCode(code);
      
      // Now that we're authenticated, check if user exists
      const user = await usersService.getCurrentProfile();
      
      if (user) {
        // User exists, show paywall directly and redirect to home if subscribed
        // Pass dynamic parameters to the paywall
        const paywallParams = {
          // Pass user data for personalization
          user_name: user.name || 'there',
          // Pass subscription pricing information
          monthly_price: SUPERWALL_PARAMS.SUBSCRIPTION_PRICE.MONTHLY,
          yearly_price: SUPERWALL_PARAMS.SUBSCRIPTION_PRICE.YEARLY,
          monthly_equivalent: SUPERWALL_PARAMS.SUBSCRIPTION_PRICE.YEARLY_MONTHLY_EQUIVALENT,
          discount_percentage: SUPERWALL_PARAMS.SUBSCRIPTION_PRICE.DISCOUNT_PERCENTAGE,
          trial_period: SUPERWALL_PARAMS.TRIAL_PERIOD,
          // Product IDs
          monthly_product_id: SUPERWALL_PARAMS.PRODUCT_IDS.MONTHLY,
          yearly_product_id: SUPERWALL_PARAMS.PRODUCT_IDS.YEARLY,
          lifetime_product_id: SUPERWALL_PARAMS.PRODUCT_IDS.LIFETIME,
          // Features
          feature_1: SUPERWALL_PARAMS.FEATURES[0],
          feature_2: SUPERWALL_PARAMS.FEATURES[1],
          feature_3: SUPERWALL_PARAMS.FEATURES[2],
          feature_4: SUPERWALL_PARAMS.FEATURES[3],
          // Add any other parameters needed for the paywall
          current_date: new Date().toLocaleDateString(),
          // Add page navigation parameters
          page: "1",
          total_pages: "3",
          is_last_page: "false",
          is_first_page: "true",
          // Development mode flags
          is_development: __DEV__ ? "true" : "false",
        };
        
        try {
          // Ensure the user is marked as onboarded before showing the paywall
          await setIsOnboarded(true);
          
          // Show the paywall and wait for it to complete
          console.log('[Verify] Showing paywall...');
          const hasSubscription = await showPaywall(SUPERWALL_TRIGGERS.ONBOARDING, paywallParams);
          console.log('[Verify] Paywall result:', hasSubscription);
          
          // Only navigate if the paywall has been dismissed or completed
          console.log('[Verify] Navigating to tabs...');
          
          // Navigate to the main app
          router.replace('/(tabs)');
        } catch (paywallError) {
          console.error('[Verify] Error showing paywall:', paywallError);
          Alert.alert(
            'Paywall Error',
            'There was an issue showing the subscription options. Please try again.'
          );
        }
      } else {
        // New user, continue onboarding
        router.push('/onboarding/name');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      await signInWithPhoneNumber(phoneNumber);
      Alert.alert('Success', 'Verification code resent successfully');
    } catch (error) {
      console.error('Error resending code:', error);
      Alert.alert('Error', 'Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      <BackgroundPattern />

      <SafeAreaView style={styles.safeArea}>
        <BackButton />
        
        <View style={styles.content}>
          <ThemedText style={styles.title}>
            Enter verification code
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            We sent a code to {phoneNumber}
          </ThemedText>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor="#6B6B6B"
            autoFocus={true}
            textContentType="oneTimeCode"
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.button,
              (!code || code.length !== 6 || isLoading) && styles.buttonDisabled
            ]} 
            onPress={handleVerify}
            disabled={!code || code.length !== 6 || isLoading}
          >
            <ThemedText style={[
              styles.buttonText,
              code.length === 6 && styles.buttonTextActive
            ]}>
              Verify
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.resendButton]}
            onPress={handleResend}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>
              Resend Code
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
    backgroundColor: '#2C1810',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: '#F5F1E8',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  input: {
    marginBottom: 24,
    fontFamily: 'Inter_400Regular',
    fontSize: 20,
    color: '#F5F1E8',
    borderBottomWidth: 1,
    borderBottomColor: '#BF9B30',
    paddingVertical: 8,
  },
  footer: {
    padding: 24,
    paddingBottom: 34,
  },
  button: {
    padding: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Inter_500Medium',
    color: 'rgba(191, 155, 48, 0.3)',
    fontSize: 16,
  },
  buttonTextActive: {
    color: '#BF9B30',
    opacity: 1,
  },
  resendButton: {
    marginTop: 12,
  },
});
