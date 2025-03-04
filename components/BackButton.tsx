import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { useRouter } from 'expo-router';

export function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={() => router.back()}
    >
      <ThemedText style={styles.buttonText}>
        ‹
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 10,
    top: 50,
    padding: 8,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  buttonText: {
    fontFamily: 'Inter_500',
    color: '#BF9B30', // Gold Accent
    fontSize: 30,
  },
});
