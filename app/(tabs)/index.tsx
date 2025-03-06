import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const colorScheme = useColorScheme() || 'light';
  const textColor = Colors[colorScheme].text;
  const backgroundColor = Colors[colorScheme].background;

  // Mock data
  const streakDays = 7;
  const totalStories = 42;
  const recentStories = [
    { id: 1, question: "What was your first job?", date: "May 15, 2023", preview: "I started working at a local bookstore when I was 16. The owner, Mrs. Thompson, was a kind elderly woman who..." },
    { id: 2, question: "What's your favorite family tradition?", date: "May 12, 2023", preview: "Every Christmas Eve, our entire family gathers to make homemade pasta. This tradition started with my grandmother who..." },
    { id: 3, question: "What was your favorite childhood toy?", date: "May 10, 2023", preview: "I had a wooden train set that my grandfather built for me. I would spend hours creating different track layouts and..." },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Your Legacy</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      {/* Streak Card */}
      <LinearGradient
        colors={['#0a7ea4', '#0a9ea4']}
        style={styles.streakCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.streakContent}>
          <View>
            <Text style={styles.streakTitle}>Current Streak</Text>
            <Text style={styles.streakCount}>{streakDays} days</Text>
          </View>
          <View style={styles.streakIconContainer}>
            <Ionicons name="flame" size={48} color="#FFF" />
          </View>
        </View>
        <Text style={styles.streakSubtitle}>Keep answering daily to build your legacy!</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Today's Question Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Today's Question</Text>
          <TouchableOpacity 
            style={[styles.todayCard, { backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5' }]}
          >
            <Text style={[styles.todayQuestion, { color: textColor }]}>
              What life lesson did you learn the hard way?
            </Text>
            <View style={styles.answerPrompt}>
              <Ionicons name="create-outline" size={24} color={Colors[colorScheme].tint} />
              <Text style={{ color: Colors[colorScheme].tint, marginLeft: 8, fontWeight: '500' }}>
                Answer this question
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Library Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Your Library</Text>
            <TouchableOpacity>
              <Text style={{ color: Colors[colorScheme].tint }}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5' }]}>
              <Text style={[styles.statCount, { color: textColor }]}>{totalStories}</Text>
              <Text style={[styles.statLabel, { color: colorScheme === 'dark' ? '#CCC' : '#666' }]}>Total Stories</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5' }]}>
              <Text style={[styles.statCount, { color: textColor }]}>12</Text>
              <Text style={[styles.statLabel, { color: colorScheme === 'dark' ? '#CCC' : '#666' }]}>Categories</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5' }]}>
              <Text style={[styles.statCount, { color: textColor }]}>8</Text>
              <Text style={[styles.statLabel, { color: colorScheme === 'dark' ? '#CCC' : '#666' }]}>Family Views</Text>
            </View>
          </View>
        </View>

        {/* Recent Stories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Stories</Text>
            <TouchableOpacity>
              <Text style={{ color: Colors[colorScheme].tint }}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentStories.map(story => (
            <TouchableOpacity 
              key={story.id}
              style={[styles.storyCard, { backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5' }]}
            >
              <Text style={[styles.storyDate, { color: colorScheme === 'dark' ? '#CCC' : '#666' }]}>{story.date}</Text>
              <Text style={[styles.storyQuestion, { color: textColor }]}>{story.question}</Text>
              <Text 
                style={[styles.storyPreview, { color: colorScheme === 'dark' ? '#AAA' : '#444' }]}
                numberOfLines={2}
              >
                {story.preview}
              </Text>
              <View style={styles.storyFooter}>
                <TouchableOpacity style={styles.storyAction}>
                  <Ionicons name="share-outline" size={20} color={Colors[colorScheme].tint} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.storyAction}>
                  <Ionicons name="heart-outline" size={20} color={Colors[colorScheme].tint} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  streakCard: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakTitle: {
    color: '#FFF',
    fontSize: 16,
    opacity: 0.9,
  },
  streakCount: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  streakSubtitle: {
    color: '#FFF',
    marginTop: 10,
    opacity: 0.9,
  },
  streakIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  todayCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todayQuestion: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  answerPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  storyCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  storyDate: {
    fontSize: 12,
    marginBottom: 8,
  },
  storyQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  storyPreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  storyAction: {
    marginLeft: 16,
  },
});
