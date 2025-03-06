import { Platform, Alert } from 'react-native';
import Superwall, { SubscriptionStatus } from '@superwall/react-native-superwall';
import { createSuperwallConfig } from '@/config/superwall';

class SuperwallService {
  private static instance: SuperwallService;
  private initialized = false;

  private constructor() {}

  static getInstance(): SuperwallService {
    if (!SuperwallService.instance) {
      SuperwallService.instance = new SuperwallService();
    }
    return SuperwallService.instance;
  }

  initialize() {
    if (this.initialized) return;

    const apiKey = Platform.select({
      ios: process.env.EXPO_PUBLIC_SUPERWALL_API_KEY_IOS,
      android: process.env.EXPO_PUBLIC_SUPERWALL_API_KEY_ANDROID,
      default: undefined,
    });

    if (!apiKey) {
      console.warn('[Superwall] No API key found for platform:', Platform.OS);
      return;
    }

    try {
      const options = createSuperwallConfig();
      
      // Configure Superwall with debug options in development
      if (__DEV__) {
        // Set debug mode in the options object if available
        // options.isDebugMode = true; // This would be set in createSuperwallConfig
      }
      
      // Configure Superwall with the API key
      console.log('[Superwall] Configuring with API key:', apiKey);
      
      // Use the string-based API for configuration
      Superwall.configure(apiKey);
      
      // Set initial subscription status
      this.setSubscriptionStatus(SubscriptionStatus.UNKNOWN);
      
      this.initialized = true;
      console.log('[Superwall] Initialized successfully');
    } catch (error) {
      console.error('[Superwall] Initialization failed:', error);
    }
  }

  async presentPaywall(triggerId: string, params?: Record<string, any>): Promise<boolean> {
    if (!this.initialized) {
      console.warn('[Superwall] Attempting to present paywall before initialization');
      this.initialize();
    }
    
    try {
      console.log('[Superwall] Presenting paywall for trigger:', triggerId, params || {});
      
      // Check if Superwall.shared is available
      if (!Superwall.shared) {
        console.error('[Superwall] Superwall.shared is not available');
        return false;
      }
      
      // Use a simpler approach - just register the trigger ID
      try {
        console.log('[Superwall] Attempting to register with string trigger ID');
        
        // For debugging in development, show an alert with the trigger ID and params
        if (__DEV__) {
          Alert.alert(
            'Showing Paywall',
            `Trigger: ${triggerId}\nParams: ${JSON.stringify(params, null, 2)}`,
            [{ text: 'OK' }]
          );
        }
        
        // Register the trigger ID
        await Superwall.shared.register(triggerId);
        
        console.log('[Superwall] Successfully registered with string trigger ID');
        return true;
      } catch (error) {
        console.error('[Superwall] Failed to register paywall:', error);
        
        // For debugging in development, show an alert with the error
        if (__DEV__) {
          Alert.alert(
            'Paywall Error',
            `Failed to show paywall: ${error instanceof Error ? error.message : String(error)}`,
            [{ text: 'OK' }]
          );
        }
        
        return false;
      }
    } catch (error) {
      console.error('[Superwall] Failed to present paywall:', error);
      return false;
    }
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    if (!this.initialized) {
      console.warn('[Superwall] Getting subscription status before initialization');
      return SubscriptionStatus.UNKNOWN;
    }

    try {
      const status = await Superwall.shared.getSubscriptionStatus();
      console.log('[Superwall] Got subscription status:', status);
      return status;
    } catch (error) {
      console.error('[Superwall] Failed to get subscription status:', error);
      return SubscriptionStatus.UNKNOWN;
    }
  }

  setSubscriptionStatus(status: SubscriptionStatus) {
    if (!this.initialized) {
      console.warn('[Superwall] Setting subscription status before initialization');
      return;
    }

    try {
      console.log('[Superwall] Setting subscription status to:', status);
      Superwall.shared.setSubscriptionStatus(status);
    } catch (error) {
      console.error('[Superwall] Failed to set subscription status:', error);
    }
  }

  // For testing purposes in development
  async setDebugSubscriptionStatus(isSubscribed: boolean) {
    if (!__DEV__) return;
    
    this.setSubscriptionStatus(
      isSubscribed ? SubscriptionStatus.ACTIVE : SubscriptionStatus.INACTIVE
    );
  }
}

export const superwallService = SuperwallService.getInstance();