import { SuperwallOptions, LogLevel, LogScope, PaywallOptions } from '@superwall/react-native-superwall';

// Define standardized trigger points throughout the app
export const SUPERWALL_TRIGGERS = {
  // The main trigger ID used for the paywall
  ONBOARDING: 'campaign_trigger',
  // Other trigger IDs
  FEATURE_UNLOCK: 'campaign_trigger',
  HOME_SCREEN: 'campaign_trigger',
  PAYWALL_FALLBACK: 'campaign_trigger',
} as const;

// Product identifiers - should match App Store/Google Play configuration
export const SUPERWALL_PRODUCTS = {
  MONTHLY: 'com.legacyai.subscription.monthly',
  YEARLY: 'com.legacyai.subscription.yearly',
  LIFETIME: 'com.legacyai.subscription.lifetime',
};

// Default parameters for dynamic content in paywalls
// These should eventually be fetched from your backend or the stores
export const SUPERWALL_PARAMS = {
  SUBSCRIPTION_PRICE: {
    MONTHLY: '$9.99',
    YEARLY: '$59.99',
    YEARLY_MONTHLY_EQUIVALENT: '$4.99',
    DISCOUNT_PERCENTAGE: '50%',
  },
  TRIAL_PERIOD: '7 days',
  PRODUCT_IDS: {
    MONTHLY: 'com.legacyai.subscription.monthly',
    YEARLY: 'com.legacyai.subscription.yearly',
    LIFETIME: 'com.legacyai.subscription.lifetime',
  },
  FEATURES: [
    'Unlimited AI conversations',
    'Advanced memory features',
    'Priority support',
    'No ads',
  ],
};

export const createSuperwallConfig = () => {
  const options = new SuperwallOptions();
  
  // Enhanced debug logging in development
  if (__DEV__) {
    // Set comprehensive logging
    options.logging = {
      level: LogLevel.Debug,
      scopes: [
        LogScope.PaywallPresentation,
        LogScope.PaywallTransactions,
        LogScope.Network,
        LogScope.All,
      ],
      toJson: () => ({})
    };
    
    // Note: Debug mode might be set through other means depending on SDK version
    // For SDK versions that support it directly:
    // options.isDebugMode = true;
  }

  // Configure paywall presentation
  const paywallOptions = new PaywallOptions();
  paywallOptions.isHapticFeedbackEnabled = true;
  paywallOptions.shouldShowPurchaseFailureAlert = true;
  paywallOptions.automaticallyDismiss = false; // Don't automatically dismiss after purchase to allow for confirmation
  
  options.paywalls = paywallOptions;
  
  // Add custom properties if supported by the SDK
  // Note: These might not be available in the current SDK version
  
  return options;
};

// Event names for tracking Superwall events
export const SUPERWALL_EVENTS = {
  PAYWALL_PRESENTATION_START: 'paywall_presentation_start',
  PAYWALL_PRESENTATION_COMPLETE: 'paywall_presentation_complete',
  PURCHASE_START: 'purchase_start',
  PURCHASE_COMPLETE: 'purchase_complete',
  PURCHASE_FAILED: 'purchase_failed',
  PAYWALL_CLOSED: 'paywall_closed',
  RESTORE_START: 'restore_start',
  RESTORE_COMPLETE: 'restore_complete',
  RESTORE_FAILED: 'restore_failed',
};