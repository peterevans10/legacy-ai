import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function SettingsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#8B4513', dark: '#5C2D0C' }}
      contentContainerStyle={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Settings</ThemedText>
        <ThemedText style={styles.subtitle}>Customize your Legacy AI experience</ThemedText>
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
