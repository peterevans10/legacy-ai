import { StyleSheet, View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState, useMemo } from 'react';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { Picker } from '@react-native-picker/picker';

export default function BirthdayScreen() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(1970);
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
  });

  const months = useMemo(() => [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ], []);

  const daysInMonth = useMemo(() => {
    const date = new Date(year, month + 1, 0);
    return date.getDate();
  }, [year, month]);

  const days = useMemo(() => 
    Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  const years = useMemo(() => 
    Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i),
    [currentYear]
  );

  const getAge = () => {
    const today = new Date();
    const birthDate = new Date(year, month, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = () => {
    router.push('/onboarding/final');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>When Were You Born?</ThemedText>
            <ThemedText style={styles.subtitle}>
              Your age helps us tailor questions to your life experiences
            </ThemedText>
          </View>

          <View style={styles.pickerContainer}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={month}
                onValueChange={(value) => setMonth(value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {months.map((monthName, index) => (
                  <Picker.Item 
                    key={monthName} 
                    label={monthName} 
                    value={index}
                    color="#2C1810"
                  />
                ))}
              </Picker>

              <Picker
                selectedValue={day}
                onValueChange={(value) => setDay(value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {days.map(d => (
                  <Picker.Item 
                    key={d} 
                    label={d.toString()} 
                    value={d}
                    color="#2C1810"
                  />
                ))}
              </Picker>

              <Picker
                selectedValue={year}
                onValueChange={(value) => setYear(value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {years.map(y => (
                  <Picker.Item 
                    key={y} 
                    label={y.toString()} 
                    value={y}
                    color="#2C1810"
                  />
                ))}
              </Picker>
            </View>

            <ThemedText style={styles.ageText}>
              {getAge()} years old
            </ThemedText>
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleNext}
          >
            <ThemedText style={styles.buttonText}>
              Continue
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8', // Aged Paper
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    gap: 12,
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 24,
    color: '#2C1810', // Deep Library Brown
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#6B6B6B', // Faded Text
    textAlign: 'center',
  },
  pickerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#FFFCF5', // Cream
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E0D5', // Subtle Border
    padding: 16,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: Platform.OS === 'ios' ? 120 : 110,
    height: Platform.OS === 'ios' ? 200 : 50,
  },
  pickerItem: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    height: 120,
  },
  ageText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6B6B6B', // Faded Text
    marginTop: 8,
  },
  button: {
    backgroundColor: '#BF9B30', // Gold Accent
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'Inter_500Medium',
    color: '#1A1A1A',
    fontSize: 16,
  },
});
