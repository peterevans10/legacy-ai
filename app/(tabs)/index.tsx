import React, { useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function HomeScreen() {
  const colorScheme = useColorScheme() || 'light';
  const textColor = Colors[colorScheme].text;
  
  // Refined color palette with emphasis on gold
  const backgroundColor = colorScheme === 'dark' ? '#1A1A1A' : '#F9F6F0';
  const cardBackground = colorScheme === 'dark' ? '#252525' : '#FFFFFF';
  
  // Gold palette
  const goldPrimary = '#D4AF37';  // Rich gold
  const goldLight = '#F0E68C';    // Light gold/khaki
  const goldDark = '#B8860B';     // Dark goldenrod
  const goldAccent = '#FFD700';   // Pure gold
  
  // Subtle brown accents
  const darkBrown = colorScheme === 'dark' ? 'rgba(42, 32, 24, 0.6)' : 'rgba(74, 60, 48, 0.2)';
  const lightBrown = colorScheme === 'dark' ? 'rgba(58, 42, 32, 0.4)' : 'rgba(139, 115, 85, 0.15)';

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Mock data
  const streakDays = 7;
  const totalStories = 42;
  const recentStories = [
    { id: 1, question: "What was your first job?", date: "May 15, 2023", preview: "I started working at a local bookstore when I was 16. The owner, Mrs. Thompson, was a kind elderly woman who..." },
    { id: 2, question: "What's your favorite family tradition?", date: "May 12, 2023", preview: "Every Christmas Eve, our entire family gathers to make homemade pasta. This tradition started with my grandmother who..." },
    { id: 3, question: "What was your favorite childhood toy?", date: "May 10, 2023", preview: "I had a wooden train set that my grandfather built for me. I would spend hours creating different track layouts and..." },
  ];

  // Run animations on component mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={[styles.backgroundImage, { backgroundColor }]}>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        
        <Animated.View 
          style={[
            styles.header, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/legacy-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={[styles.logoText, { color: textColor }]}>Legacy AI</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.profileButton, { borderColor: goldPrimary }]}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Streak Card */}
        <Animated.View style={{ 
          opacity: fadeAnim, 
          transform: [{ scale: scaleAnim }]
        }}>
          <LinearGradient
            colors={[goldDark, goldPrimary]}
            style={styles.streakCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.streakContent}>
              <View>
                <Text style={styles.streakTitle}>Current Streak</Text>
                <Text style={styles.streakCount}>{streakDays} days</Text>
              </View>
              <View style={[styles.streakIconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <Ionicons name="flame" size={48} color="#FFF" />
              </View>
            </View>
            <Text style={styles.streakSubtitle}>Keep answering daily to build your legacy!</Text>
          </LinearGradient>
        </Animated.View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Today's Question Section */}
          <Animated.View style={[
            styles.section, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Today's Question</Text>
            <TouchableOpacity 
              style={[styles.todayCard, { backgroundColor: cardBackground }]}
            >
              <LinearGradient
                colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)']}
                style={styles.questionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.bookmarkRibbon}>
                  <LinearGradient
                    colors={[goldPrimary, goldDark]}
                    style={styles.ribbon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
                <Text style={[styles.todayQuestion, { color: textColor }]}>
                  What life lesson did you learn the hard way?
                </Text>
                <View style={styles.answerPrompt}>
                  <Ionicons name="create-outline" size={24} color={goldPrimary} />
                  <Text style={{ color: goldPrimary, marginLeft: 8, fontWeight: '500' }}>
                    Answer this question
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Library Overview */}
          <Animated.View style={[
            styles.section, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Your Library</Text>
              <TouchableOpacity>
                <Text style={{ color: goldPrimary }}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, { backgroundColor: cardBackground }]}>
                <Text style={[styles.statCount, { color: goldPrimary }]}>{totalStories}</Text>
                <Text style={[styles.statLabel, { color: colorScheme === 'dark' ? '#CCC' : '#666' }]}>Total Stories</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: cardBackground }]}>
                <Text style={[styles.statCount, { color: goldPrimary }]}>12</Text>
                <Text style={[styles.statLabel, { color: colorScheme === 'dark' ? '#CCC' : '#666' }]}>Categories</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: cardBackground }]}>
                <Text style={[styles.statCount, { color: goldPrimary }]}>8</Text>
                <Text style={[styles.statLabel, { color: colorScheme === 'dark' ? '#CCC' : '#666' }]}>Family Views</Text>
              </View>
            </View>
          </Animated.View>

          {/* Recent Stories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Stories</Text>
              <TouchableOpacity>
                <Text style={{ color: goldPrimary }}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {recentStories.map((story, index) => (
              <Animated.View 
                key={story.id}
                style={{ 
                  opacity: fadeAnim, 
                  transform: [{ translateY: Animated.multiply(slideAnim, new Animated.Value(1 + index * 0.5)) }] 
                }}
              >
                <TouchableOpacity 
                  style={[styles.storyCard, { backgroundColor: cardBackground }]}
                >
                  <View style={styles.storyHeader}>
                    <Text style={[styles.storyDate, { color: colorScheme === 'dark' ? '#AAA' : '#444' }]}>{story.date}</Text>
                    <View style={[styles.bookmarkIcon, { backgroundColor: goldPrimary }]}>
                      <Ionicons name="bookmark" size={12} color="#FFF" />
                    </View>
                  </View>
                  <Text style={[styles.storyQuestion, { color: textColor }]}>{story.question}</Text>
                  <Text 
                    style={[styles.storyPreview, { color: colorScheme === 'dark' ? '#AAA' : '#444' }]}
                    numberOfLines={2}
                  >
                    {story.preview}
                  </Text>
                  <View style={styles.storyFooter}>
                    <TouchableOpacity style={styles.storyAction}>
                      <Ionicons name="share-outline" size={20} color={goldPrimary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.storyAction}>
                      <Ionicons name="heart-outline" size={20} color={goldPrimary} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    padding: 2,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
    fontFamily: 'serif',
  },
  streakSubtitle: {
    color: '#FFF',
    marginTop: 10,
    opacity: 0.9,
  },
  streakIconContainer: {
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
    fontFamily: 'serif',
  },
  todayCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  bookmarkRibbon: {
    position: 'absolute',
    top: 0,
    left: 20,
    width: 20,
    height: 40,
    overflow: 'hidden',
  },
  ribbon: {
    width: 20,
    height: 40,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  questionGradient: {
    padding: 20,
    paddingTop: 30,
  },
  todayQuestion: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'serif',
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
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'serif',
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
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookmarkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyDate: {
    fontSize: 12,
  },
  storyQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'serif',
  },
  storyPreview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  storyAction: {
    marginLeft: 16,
  },
});
