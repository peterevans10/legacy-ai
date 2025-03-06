import { SuperwallOptions, LogLevel, LogScope } from '@superwall/react-native-superwall';

export const SUPERWALL_TRIGGERS = {
  ONBOARDING: 'campaign_trigger',
  FEATURE_UNLOCK: 'campaign_trigger',
} as const;

// Add dynamic parameters for the paywall
export const SUPERWALL_PARAMS = {
  // Example parameters that can be used for dynamic values in the paywall
  SUBSCRIPTION_PRICE: {
    MONTHLY: '$9.99',
    YEARLY: '$59.99',
    YEARLY_MONTHLY_EQUIVALENT: '$4.99',
    DISCOUNT_PERCENTAGE: '50%',
  },
  TRIAL_PERIOD: '7 days',
};

export const createSuperwallConfig = () => {
  const options = new SuperwallOptions();
  
  // Enable debug logging in development
  if (__DEV__) {
    // Set logging level to debug
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
    
    // Enable debug mode for easier testing
    // options.isDebugMode = true;
  }

  // Configure paywall presentation
  // options.paywalls = {
  //   isHapticFeedbackEnabled: true,
  //   shouldShowPurchaseFailureAlert: true,
  //   automaticallyDismiss: false, // Don't automatically dismiss after purchase to allow for confirmation
  // };

  return options;
};