import { Platform, Alert } from 'react-native';
import Superwall, { SubscriptionStatus } from '@superwall/react-native-superwall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSuperwallConfig, SUPERWALL_PRODUCTS, SUPERWALL_EVENTS } from '@/config/superwall';

// Storage key for subscription status
const SUBSCRIPTION_STATUS_KEY = 'superwall_subscription_status';
const SUBSCRIPTION_EXPIRY_KEY = 'superwall_subscription_expiry';
const PRODUCTS_CACHE_KEY = 'superwall_products_cache';
// Cache expiry time (24 hours in milliseconds)
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

class SuperwallService {
  private static instance: SuperwallService;
  private initialized = false;
  private products: Record<string, any> = {};

  private constructor() {}

  static getInstance(): SuperwallService {
    if (!SuperwallService.instance) {
      SuperwallService.instance = new SuperwallService();
    }
    return SuperwallService.instance;
  }

  // Track events for analytics purposes
  private trackEvent(eventName: string, params?: Record<string, any>) {
    // Implement your analytics tracking here
    console.log(`[Analytics] ${eventName}`, params);
    
    // You would typically send this to your analytics service
    // Example: FirebaseAnalytics.logEvent(eventName, params);
  }

  async initialize() {
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
      
      console.log('[Superwall] Configuring with API key:', apiKey);
      
      // Configure Superwall with options
      Superwall.configure(apiKey, options);
      
      // Set initial subscription status to INACTIVE (not UNKNOWN)
      this.setSubscriptionStatus(SubscriptionStatus.INACTIVE);
      
      // In development mode, enable debug features
      if (__DEV__) {
        try {
          // Enable debug mode if the SDK supports it
          // Note: This is a dynamic check since the SDK might have different methods
          // @ts-ignore - Checking for method existence dynamically
          if (Superwall.shared && typeof Superwall.shared.setDebugMode === 'function') {
            // @ts-ignore - Using method dynamically
            Superwall.shared.setDebugMode(true);
          }
        } catch (error) {
          console.warn('[Superwall] Could not set debug mode:', error);
        }
      }
      
      this.initialized = true;
      console.log('[Superwall] Initialized successfully');
    } catch (error) {
      console.error('[Superwall] Initialization failed:', error);
    }
  }

  // Load subscription status from cache
  private async loadCachedSubscriptionStatus() {
    try {
      const statusStr = await AsyncStorage.getItem(SUBSCRIPTION_STATUS_KEY);
      const expiryStr = await AsyncStorage.getItem(SUBSCRIPTION_EXPIRY_KEY);
      
      if (statusStr && expiryStr) {
        const expiry = Number(expiryStr);
        const now = Date.now();
        
        // Check if the cached status is still valid
        if (expiry > now) {
          // Convert the string to a number, then use it as SubscriptionStatus 
          // We'll validate that it's in the valid range (0-2)
          const statusNumber = Number(statusStr);
          if (statusNumber === 0 || statusNumber === 1 || statusNumber === 2) {
            // We know these correspond to the enum values in SubscriptionStatus
            this.setSubscriptionStatus(statusNumber as unknown as SubscriptionStatus);
            return;
          }
        }
      }
      
      // If no valid cache, set to unknown
      this.setSubscriptionStatus(SubscriptionStatus.UNKNOWN);
    } catch (error) {
      console.error('[Superwall] Failed to load cached subscription status:', error);
      this.setSubscriptionStatus(SubscriptionStatus.UNKNOWN);
    }
  }

  // Cache the subscription status
  private async cacheSubscriptionStatus(status: SubscriptionStatus) {
    try {
      const now = Date.now();
      const expiry = now + CACHE_EXPIRY;
      
      await AsyncStorage.setItem(SUBSCRIPTION_STATUS_KEY, status.toString());
      await AsyncStorage.setItem(SUBSCRIPTION_EXPIRY_KEY, expiry.toString());
    } catch (error) {
      console.error('[Superwall] Failed to cache subscription status:', error);
    }
  }

  // Load cached products
  private async loadCachedProducts() {
    try {
      const productsStr = await AsyncStorage.getItem(PRODUCTS_CACHE_KEY);
      
      if (productsStr) {
        const { products, expiry } = JSON.parse(productsStr);
        const now = Date.now();
        
        // Check if the cached products are still valid
        if (expiry > now) {
          this.products = products;
          return;
        }
      }
      
      // If no valid cache, fetch products
      await this.fetchProducts();
    } catch (error) {
      console.error('[Superwall] Failed to load cached products:', error);
      // Try to fetch products if cache loading fails
      await this.fetchProducts();
    }
  }

  // Fetch product information
  private async fetchProducts() {
    try {
      console.log('[Superwall] Fetching products');
      
      // This would fetch product information from StoreKit/Google Billing
      // For now, we'll use placeholders
      this.products = {
        [SUPERWALL_PRODUCTS.MONTHLY]: {
          id: SUPERWALL_PRODUCTS.MONTHLY,
          title: 'Monthly Subscription',
          price: 9.99,
          localizedPrice: '$9.99',
          currency: 'USD',
          description: 'Access to all features for one month',
          trialPeriod: '7 days',
        },
        [SUPERWALL_PRODUCTS.YEARLY]: {
          id: SUPERWALL_PRODUCTS.YEARLY,
          title: 'Yearly Subscription',
          price: 59.99,
          localizedPrice: '$59.99',
          currency: 'USD',
          description: 'Access to all features for one year',
          trialPeriod: '7 days',
        },
        [SUPERWALL_PRODUCTS.LIFETIME]: {
          id: SUPERWALL_PRODUCTS.LIFETIME,
          title: 'Lifetime Access',
          price: 149.99,
          localizedPrice: '$149.99',
          currency: 'USD',
          description: 'Lifetime access to all features',
          trialPeriod: null,
        },
      };
      
      // Cache the fetched products
      await this.cacheProducts();
    } catch (error) {
      console.error('[Superwall] Failed to fetch products:', error);
    }
  }

  // Cache the products
  private async cacheProducts() {
    try {
      const now = Date.now();
      const expiry = now + CACHE_EXPIRY;
      
      await AsyncStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify({
        products: this.products,
        expiry,
      }));
    } catch (error) {
      console.error('[Superwall] Failed to cache products:', error);
    }
  }

  // Get dynamic parameters for paywalls
  async getPaywallParams(triggerId: string, userParams?: Record<string, any>): Promise<Record<string, any>> {
    // Ensure products are loaded
    if (Object.keys(this.products).length === 0) {
      await this.fetchProducts();
    }
    
    // Base parameters
    const baseParams = {
      // Current date/time in various formats
      current_date: new Date().toLocaleDateString(),
      current_time: new Date().toLocaleTimeString(),
      platform: Platform.OS,
    };
    
    // Add product-specific parameters
    const productParams: Record<string, any> = {};
    
    const monthlyProduct = this.products[SUPERWALL_PRODUCTS.MONTHLY];
    if (monthlyProduct) {
      productParams.monthly_price = monthlyProduct.localizedPrice;
      productParams.trial_period = monthlyProduct.trialPeriod || 'No trial';
    }
    
    const yearlyProduct = this.products[SUPERWALL_PRODUCTS.YEARLY];
    if (yearlyProduct && monthlyProduct) {
      productParams.yearly_price = yearlyProduct.localizedPrice;
      // Calculate monthly equivalent
      const monthlyEquivalent = (yearlyProduct.price / 12).toFixed(2);
      productParams.yearly_monthly_equivalent = `$${monthlyEquivalent}`;
      // Calculate discount
      const discount = ((1 - (yearlyProduct.price / 12) / monthlyProduct.price) * 100).toFixed(0);
      productParams.discount_percentage = `${discount}%`;
    }
    
    return {
      ...baseParams,
      ...productParams,
      ...userParams,
    };
  }

  async presentPaywall(triggerId: string, params?: Record<string, any>): Promise<boolean> {
    if (!this.initialized) {
      console.warn('[Superwall] Attempting to present paywall before initialization');
      this.initialize();
    }
    
    try {
      console.log('[Superwall] Presenting paywall for trigger:', triggerId);
      
      // Check if Superwall.shared is available
      if (!Superwall.shared) {
        console.error('[Superwall] Superwall.shared is not available');
        return false;
      }
      
      // In development, log the parameters for debugging
      if (__DEV__) {
        console.log('[Superwall DEBUG] Presenting paywall with params:', JSON.stringify(params, null, 2));
      }
      
      try {
        // For development mode, try to use the identify method first to set user attributes
        // This can help with variable binding in the paywall
        if (__DEV__ && params) {
          try {
            const userId = 'dev_user_' + Date.now();
            console.log('[Superwall] Identifying user with ID:', userId);
            
            // @ts-ignore - Checking for method existence dynamically
            if (Superwall.shared && typeof Superwall.shared.identify === 'function') {
              // @ts-ignore - Using method dynamically
              await Superwall.shared.identify(userId);
            }
            
            // Set user attributes for the paywall
            // @ts-ignore - Checking for method existence dynamically
            if (Superwall.shared && typeof Superwall.shared.setUserAttributes === 'function') {
              console.log('[Superwall] Setting user attributes:', params);
              // @ts-ignore - Using method dynamically
              await Superwall.shared.setUserAttributes(params);
            }
          } catch (identifyError) {
            console.warn('[Superwall] Could not identify user:', identifyError);
          }
        }
        
        // Register the trigger ID - this is the simplest approach that should work
        console.log('[Superwall] Registering trigger:', triggerId);
        await Superwall.shared.register(triggerId);
        
        console.log('[Superwall] Successfully registered paywall');
        
        // Add a delay to ensure the paywall has time to appear
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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

  // Refresh subscription status from the server
  async refreshSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const status = await Superwall.shared.getSubscriptionStatus();
      
      // Cache the status for offline use
      await this.cacheSubscriptionStatus(status);
      
      return status;
    } catch (error) {
      console.error('[Superwall] Failed to refresh subscription status:', error);
      return SubscriptionStatus.UNKNOWN;
    }
  }

  // Get current subscription status
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    if (!this.initialized) {
      console.warn('[Superwall] Getting subscription status before initialization');
      return SubscriptionStatus.UNKNOWN;
    }

    try {
      const status = await Superwall.shared.getSubscriptionStatus();
      console.log('[Superwall] Got subscription status:', status);
      
      // Cache the status for offline use
      await this.cacheSubscriptionStatus(status);
      
      return status;
    } catch (error) {
      console.error('[Superwall] Failed to get subscription status:', error);
      return SubscriptionStatus.UNKNOWN;
    }
  }

  // Set subscription status (useful for testing)
  setSubscriptionStatus(status: SubscriptionStatus) {
    if (!this.initialized && !__DEV__) {
      console.warn('[Superwall] Setting subscription status before initialization');
      return;
    }

    try {
      console.log('[Superwall] Setting subscription status to:', status);
      if (Superwall.shared) {
        Superwall.shared.setSubscriptionStatus(status);
      }
      
      // Cache the status for offline use
      this.cacheSubscriptionStatus(status);
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
  
  // Get product information
  getProduct(productId: string): any {
    return this.products[productId] || null;
  }
  
  // Get all products
  getAllProducts(): Record<string, any> {
    return { ...this.products };
  }
}

export const superwallService = SuperwallService.getInstance();