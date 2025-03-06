import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function FamilyScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      contentContainerStyle={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Family & Friends</ThemedText>
        <ThemedText style={styles.subtitle}>Connect with loved ones and share your legacy</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  subtitle: {
    opacity: 0.7,
  },
});
