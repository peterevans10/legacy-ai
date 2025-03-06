import { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { SubscriptionStatus } from '@superwall/react-native-superwall';
import { superwallService } from '@/services/superwall';

export function useSuperwall() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsLoading(false);
      return;
    }

    superwallService.initialize();
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const status = await superwallService.getSubscriptionStatus();
      console.log('[Superwall] Current subscription status:', status);
      
      // Handle each possible status type
      switch (status) {
        case SubscriptionStatus.UNKNOWN:
          setIsSubscribed(false);
          break;
        case SubscriptionStatus.INACTIVE:
          setIsSubscribed(false);
          break;
        case SubscriptionStatus.ACTIVE:
          setIsSubscribed(true);
          break;
        default:
          // For safety, treat unknown states as not subscribed
          setIsSubscribed(false);
          console.warn('[Superwall] Unexpected subscription status:', status);
      }
    } catch (error) {
      console.error('[Superwall] Hook subscription check failed:', error);
      setIsSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  };

  const showPaywall = async (triggerId: string, params?: Record<string, any>): Promise<boolean> => {
    if (isLoading || Platform.OS === 'web') return false;
    
    try {
      console.log('[Superwall] Attempting to show paywall for trigger:', triggerId);
      
      // Pass any dynamic parameters to the paywall
      const result = await superwallService.presentPaywall(triggerId, params);
      
      console.log('[Superwall] Paywall presentation result:', result);
      
      // Add a small delay to ensure the paywall has time to appear
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh subscription status after paywall interaction
      await checkSubscription();
      
      return result;
    } catch (error) {
      console.error('[Superwall] Hook failed to show paywall:', error);
      
      // Show an alert for debugging purposes in development
      if (__DEV__) {
        Alert.alert(
          'Paywall Error',
          `Failed to show paywall: ${error instanceof Error ? error.message : String(error)}`
        );
      }
      
      return false;
    }
  };

  return {
    isSubscribed,
    isLoading,
    showPaywall,
    checkSubscription,
  };
}