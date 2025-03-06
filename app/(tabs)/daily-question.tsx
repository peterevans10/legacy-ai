import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function DailyQuestionScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#BF9B30', dark: '#8B6B1F' }}
      contentContainerStyle={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Today's Question</ThemedText>
        <ThemedText style={styles.subtitle}>Share your story and build your legacy</ThemedText>
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
