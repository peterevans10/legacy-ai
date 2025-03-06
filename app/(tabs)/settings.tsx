import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const textColor = Colors[colorScheme].text;
  const backgroundColor = Colors[colorScheme].background;
  const cardBackground = colorScheme === 'dark' ? '#252525' : '#F5F5F5';

  // Mock user data
  const user = {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    memberSince: 'May 2023',
    storiesCount: 42,
  };

  const renderSettingItem = (icon: string, title: string, subtitle?: string, showArrow: boolean = true) => (
    <TouchableOpacity style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon as any} size={22} color={Colors[colorScheme].tint} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colorScheme === 'dark' ? '#AAA' : '#666' }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={colorScheme === 'dark' ? '#AAA' : '#999'} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={[styles.profileCard, { backgroundColor: cardBackground }]}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: textColor }]}>{user.name}</Text>
            <Text style={[styles.profileDetails, { color: colorScheme === 'dark' ? '#CCC' : '#666' }]}>
              Member since {user.memberSince}
            </Text>
            <Text style={[styles.profileDetails, { color: colorScheme === 'dark' ? '#CCC' : '#666' }]}>
              {user.storiesCount} stories shared
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={18} color={Colors[colorScheme].tint} />
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>
          <View style={[styles.settingsCard, { backgroundColor: cardBackground }]}>
            {renderSettingItem('person-outline', 'Personal Information', 'Name, email, phone')}
            {renderSettingItem('notifications-outline', 'Notifications', 'Questions, reminders')}
            {renderSettingItem('lock-closed-outline', 'Privacy', 'Visibility, sharing preferences')}
            {renderSettingItem('cloud-download-outline', 'Data & Storage', 'Manage your data')}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Preferences</Text>
          <View style={[styles.settingsCard, { backgroundColor: cardBackground }]}>
            {renderSettingItem('moon-outline', 'Dark Mode', colorScheme === 'dark' ? 'On' : 'Off', false)}
            <View style={styles.switchContainer}>
              <Switch
                value={colorScheme === 'dark'}
                onValueChange={() => {}}
                trackColor={{ false: '#CCC', true: Colors.light.tint + '80' }}
                thumbColor={colorScheme === 'dark' ? Colors.light.tint : '#FFF'}
              />
            </View>
            {renderSettingItem('language-outline', 'Language', 'English (US)')}
            {renderSettingItem('text-outline', 'Font Size', 'Medium')}
          </View>
        </View>

        {/* Legal & Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Legal & Support</Text>
          <View style={[styles.settingsCard, { backgroundColor: cardBackground }]}>
            {renderSettingItem('help-circle-outline', 'Help & Support')}
            {renderSettingItem('document-text-outline', 'Terms of Service')}
            {renderSettingItem('shield-outline', 'Privacy Policy')}
            {renderSettingItem('information-circle-outline', 'About Legacy AI')}
          </View>
        </View>

        {/* Logout & Delete */}
        <View style={styles.section}>
          <View style={[styles.settingsCard, { backgroundColor: cardBackground }]}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="log-out-outline" size={22} color="#E57373" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: '#E57373' }]}>Log Out</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="trash-outline" size={22} color="#E57373" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: '#E57373' }]}>Delete Account</Text>
                <Text style={[styles.settingSubtitle, { color: colorScheme === 'dark' ? '#AAA' : '#666' }]}>
                  This action cannot be undone
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colorScheme === 'dark' ? '#AAA' : '#999' }]}>
            Legacy AI v1.0.0
          </Text>
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
  scrollView: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    marginBottom: 2,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingsCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  switchContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
  },
});
