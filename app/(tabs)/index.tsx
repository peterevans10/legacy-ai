import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

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

  // Animation for hourglass
  const hourglassAnim = useRef(new Animated.Value(0)).current;

  // Sample data
  const streakDays = 7;
  const totalStories = 168;
  const totalWords = 29;
  const averageWords = 403;
  
  const todaysQuestion = "What's a childhood memory that still makes you smile?";

  // Sample data for weekly calendar
  const today = new Date();
  
  // Generate dates for the current week (Sunday to Saturday)
  const generateWeekDates = () => {
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const result = [];
    
    // Go back to Sunday
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay);
    
    // Create array with dates for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      result.push({
        day: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][i],
        date: date.getDate(), // Just the day number (1-31)
        completed: i < currentDay || (i === currentDay && Math.random() > 0.5) // Random completion for demo
      });
    }
    
    return result;
  };
  
  const weeklyProgress = generateWeekDates();
  
  // Get current day index (0-6, where 0 is Sunday)
  const currentDayIndex = today.getDay();

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

    // Set up hourglass animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(hourglassAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(hourglassAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.backgroundImage, { backgroundColor }]}>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
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
                <Text style={styles.streakTitle}>Current Streak</Text>
                <View style={[styles.streakIconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                  <Ionicons name="flame" size={20} color="#FFF" />
                </View>
                <Text style={styles.streakCount}>{streakDays} days</Text>
              </View>
              
              {/* Weekly Calendar */}
              <View style={styles.weeklyCalendar}>
                {weeklyProgress.map((day, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.calendarDay,
                      index === currentDayIndex && styles.calendarDayToday
                    ]}
                  >
                    <Text style={styles.calendarDayText}>{day.day}</Text>
                    <View style={styles.calendarIconContainer}>
                      {day.completed ? (
                        <Ionicons name="book" size={16} color="#FFF" />
                      ) : (
                        <Ionicons name="book-outline" size={16} color="rgba(255, 255, 255, 0.6)" />
                      )}
                    </View>
                    <Text style={styles.calendarDayFullText}>{day.date}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>
          
          {/* Analytics Card */}
          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [{ scale: scaleAnim }]
          }}>
            <View style={[styles.analyticsCard, { backgroundColor: cardBackground }]}>
              <View style={styles.analyticsContainer}>
                <View style={styles.analyticItem}>
                  <Text style={[styles.analyticValue, { color: goldPrimary }]}>{totalStories}</Text>
                  <Text style={[styles.analyticLabel, { color: colorScheme === 'dark' ? '#AAA' : '#666' }]}>Stories Told</Text>
                </View>
                <View style={styles.analyticDivider} />
                <View style={styles.analyticItem}>
                  <Text style={[styles.analyticValue, { color: goldPrimary }]}>{totalWords}</Text>
                  <Text style={[styles.analyticLabel, { color: colorScheme === 'dark' ? '#AAA' : '#666' }]}>Friends & Family</Text>
                </View>
                <View style={styles.analyticDivider} />
                <View style={styles.analyticItem}>
                  <Text style={[styles.analyticValue, { color: goldPrimary }]}>{averageWords}</Text>
                  <Text style={[styles.analyticLabel, { color: colorScheme === 'dark' ? '#AAA' : '#666' }]}>Stories Asked</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Library Section Header */}
          <Text style={[styles.sectionHeader, { color: textColor }]}>Personal Library</Text>
          {/* Library Section (Bookcase) */}
          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }]
          }}>
            <TouchableOpacity 
              style={[styles.sectionCard, { backgroundColor: cardBackground }]}
              onPress={() => console.log('Navigate to stories')}
            >
              <View style={styles.bookcaseContainer}>
                <View style={styles.bookshelfWood}>
                  {/* Left Bookend */}
                  <View style={styles.bookendContainer}>
                    <LinearGradient
                      colors={[goldDark, goldPrimary]}
                      style={styles.bookend}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.bookendDetail} />
                    </LinearGradient>
                  </View>
                  
                  {/* Books */}
                  {Array.from({ length: 5 }).map((_, i) => {
                    // Randomize book properties
                    const isWide = Math.random() > 0.7;
                    const hasRidges = Math.random() > 0.5;
                    const bookHeight = 90 + Math.random() * 25;
                    const bookMarginTop = Math.random() * 15;
                    const bookWidth = isWide ? '16%' : '13%';
                    const bookRotation = Math.random() * 2 - 1; // -1 to 1 degrees
                    const bookTitle = ["Childhood", "Family", "Travel", "Love", "Struggle"];
                    
                    return (
                      <View key={i} style={[
                        styles.book, 
                        { 
                          width: bookWidth,
                          height: bookHeight,
                          marginTop: bookMarginTop,
                          transform: [{ rotate: `${bookRotation}deg` }]
                        }
                      ]}>
                        <LinearGradient
                          colors={[i % 2 === 0 ? goldDark : goldPrimary, i % 2 === 0 ? goldPrimary : goldLight]}
                          style={styles.bookSpineGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        >
                          {hasRidges && (
                            <View style={styles.bookRidges}>
                              <View style={styles.bookRidge} />
                              <View style={styles.bookRidge} />
                              <View style={styles.bookRidge} />
                            </View>
                          )}
                          
                          <View style={styles.bookTitleContainer}>
                            <Text style={styles.bookSpine} numberOfLines={1}>{i === 0 ? "Childhood" : i === 1 ? "Family" : i === 2 ? "Travel" : i === 3 ? "Love" : "Struggle"}</Text>
                          </View>
                          
                          {/* Book details */}
                          {Math.random() > 0.5 && (
                            <View style={styles.bookDetail}>
                              <View style={[styles.bookDetailLine, { width: 15 + Math.random() * 10 }]} />
                              {Math.random() > 0.5 && (
                                <View style={[styles.bookDetailLine, { width: 10 + Math.random() * 8, marginTop: 2 }]} />
                              )}
                            </View>
                          )}
                        </LinearGradient>
                      </View>
                    );
                  })}
                  
                  {/* Right Bookend */}
                  <View style={styles.bookendContainer}>
                    <LinearGradient
                      colors={[goldDark, goldPrimary]}
                      style={[styles.bookend, styles.bookendRight]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.bookendDetail} />
                    </LinearGradient>
                  </View>
                </View>
                
                {/* Shelf Support - Elegant Gold Line */}
                <LinearGradient
                  colors={[goldLight, goldPrimary, goldLight]}
                  style={styles.bookshelfSupport}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Today's Question Header */}
          <Text style={[styles.sectionHeader, { color: textColor }]}>Today's Question</Text>
          
          {/* Today's Question - Empty State with Shaking Hourglass */}
          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }]
          }}>
            <View style={[
              styles.sectionCard, 
              { 
                backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F0EBE0',
                borderWidth: 1,
                borderColor: 'rgba(212, 175, 55, 0.3)'
              }
            ]}>
              <View style={styles.questionTitleContainer}>
                <Text style={[styles.questionTitle, { color: textColor }]}>
                  Answer your daily reflection
                </Text>
              </View>
              
              <View style={[styles.timeContainer, { backgroundColor: 'rgba(212, 175, 55, 0.1)' }]}>
                <Animated.Text 
                  style={[
                    styles.hourglassEmoji, 
                    { 
                      transform: [
                        { rotate: hourglassAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '30deg']
                        })},
                      ] 
                    }
                  ]}
                >
                  ⏳
                </Animated.Text>
                <Text style={[styles.timeText, { color: goldPrimary }]}>
                  2 hours and 43 minutes left
                </Text>
              </View>
            </View>
          </Animated.View>
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
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 12,
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
    fontSize: 32,
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 12,
  },
  streakCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  streakTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  streakCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  streakIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  weeklyCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  calendarDay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  calendarDayToday: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  calendarDayText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  calendarIconContainer: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  calendarDayFullText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
  },
  analyticsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  analyticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analyticItem: {
    flex: 1,
    alignItems: 'center',
  },
  analyticValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  analyticLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  analyticDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  sectionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'serif',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 8,
  },
  bookcaseContainer: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  bookshelfWood: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    backgroundColor: 'transparent',
    borderRadius: 4,
    padding: 10,
  },
  bookshelfSupport: {
    height: 4,
    borderRadius: 2,
    marginTop: 4,
    opacity: 0.8,
  },
  book: {
    borderRadius: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  bookSpineGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    position: 'relative',
  },
  bookRidges: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    justifyContent: 'space-around',
    paddingVertical: 15,
  },
  bookRidge: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  bookDetail: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
  },
  bookDetailLine: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
  },
  bookTitleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookSpine: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    transform: [{ rotate: '270deg' }],
    width: 100,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  questionBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  questionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questionBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 26,
    marginBottom: 20,
    fontFamily: 'serif',
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  answerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bookendContainer: {
    width: '10%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bookend: {
    width: '100%',
    height: 80,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookendRight: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 8,
  },
  bookendDetail: {
    width: '60%',
    height: '60%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    marginRight: 4,
  },
  emptyQuestionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    minHeight: 180,
  },
  emptyQuestionTextBold: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'serif',
  },
  emptyQuestionText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  arrowContainer: {
    width: '100%',
    height: 80,
    alignItems: 'center',
  },
  arrowTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  arrowEmoji: {
    fontSize: 24,
    color: '#D4AF37',
    letterSpacing: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  hourglassEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  questionTitleContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  questionTitlePrefix: {
    fontSize: 14,
    marginBottom: 4,
  },
  questionTitle: {
    fontSize: 20,
    fontFamily: 'serif',
    letterSpacing: 0.5,
  },
});
