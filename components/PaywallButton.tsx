import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemedText } from './ThemedText';
import { useSuperwall } from '@/hooks/useSuperwall';
import { SUPERWALL_TRIGGERS, SUPERWALL_PARAMS } from '@/config/superwall';

export function PaywallButton() {
  const { showPaywall } = useSuperwall();

  const handlePress = async () => {
    // Pass dynamic parameters to the paywall
    const paywallParams = {
      // Pass subscription pricing information
      monthly_price: SUPERWALL_PARAMS.SUBSCRIPTION_PRICE.MONTHLY,
      yearly_price: SUPERWALL_PARAMS.SUBSCRIPTION_PRICE.YEARLY,
      monthly_equivalent: SUPERWALL_PARAMS.SUBSCRIPTION_PRICE.YEARLY_MONTHLY_EQUIVALENT,
      discount: SUPERWALL_PARAMS.SUBSCRIPTION_PRICE.DISCOUNT_PERCENTAGE,
      trial_period: SUPERWALL_PARAMS.TRIAL_PERIOD,
      // Add any other parameters needed for the paywall
      current_date: new Date().toLocaleDateString(),
    };
    
    await showPaywall(SUPERWALL_TRIGGERS.ONBOARDING, paywallParams);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <ThemedText type="defaultSemiBold">Show Paywall</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
  },
});