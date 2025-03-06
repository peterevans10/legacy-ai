import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function DailyQuestionScreen() {
  const colorScheme = useColorScheme() || 'light';
  const textColor = Colors[colorScheme].text;
  const backgroundColor = Colors[colorScheme].background;
  const router = useRouter();
  
  const [answer, setAnswer] = useState('');
  
  // Mock data for the daily question
  const dailyQuestion = {
    id: 'q123',
    question: "What life lesson did you learn the hard way?",
    askedBy: "Legacy AI",
    date: new Date().toLocaleDateString(),
    category: "Life Lessons",
  };

  const handleSave = () => {
    // Save the answer to the database
    console.log('Saving answer:', answer);
    
    // Show success message and navigate back to home
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={28} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Today's Question</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={['#0a7ea4', '#0a9ea4']}
            style={styles.questionCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.questionHeader}>
              <Text style={styles.questionCategory}>{dailyQuestion.category}</Text>
              <Text style={styles.questionDate}>{dailyQuestion.date}</Text>
            </View>
            <Text style={styles.questionText}>{dailyQuestion.question}</Text>
            <Text style={styles.questionAskedBy}>Asked by {dailyQuestion.askedBy}</Text>
          </LinearGradient>

          <View style={styles.answerContainer}>
            <Text style={[styles.answerLabel, { color: textColor }]}>Your Answer</Text>
            <View style={[styles.textInputContainer, { backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5' }]}>
              <TextInput
                style={[styles.textInput, { color: textColor }]}
                placeholder="Type your answer here..."
                placeholderTextColor={colorScheme === 'dark' ? '#AAA' : '#999'}
                multiline
                textAlignVertical="top"
                value={answer}
                onChangeText={setAnswer}
              />
            </View>
          </View>

          <View style={styles.tipContainer}>
            <View style={styles.tipIconContainer}>
              <Ionicons name="bulb-outline" size={24} color="#FFD700" />
            </View>
            <Text style={[styles.tipText, { color: colorScheme === 'dark' ? '#CCC' : '#666' }]}>
              Tip: Be specific and include details. Your future self and loved ones will appreciate the context.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              { opacity: answer.trim().length > 0 ? 1 : 0.5 }
            ]}
            disabled={answer.trim().length === 0}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Answer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  questionCard: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  questionCategory: {
    color: '#FFF',
    opacity: 0.9,
    fontSize: 14,
    fontWeight: '500',
  },
  questionDate: {
    color: '#FFF',
    opacity: 0.9,
    fontSize: 14,
  },
  questionText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 32,
  },
  questionAskedBy: {
    color: '#FFF',
    opacity: 0.9,
    fontSize: 14,
    fontStyle: 'italic',
  },
  answerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  answerLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  textInputContainer: {
    borderRadius: 16,
    padding: 16,
    minHeight: 200,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    minHeight: 168,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  saveButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
