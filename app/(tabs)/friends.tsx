import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define the Friend type
interface Friend {
  id: string;
  name: string;
  age: number;
  relationship: string;
  avatar: string;
  stories: number;
  lastActive: string;
}

// Mock data for friends
const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Martha Johnson',
    age: 68,
    relationship: 'Mother',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    stories: 42,
    lastActive: '2 days ago',
  },
  {
    id: '2',
    name: 'Robert Smith',
    age: 72,
    relationship: 'Father',
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    stories: 35,
    lastActive: '5 days ago',
  },
  {
    id: '3',
    name: 'Susan Williams',
    age: 65,
    relationship: 'Aunt',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    stories: 28,
    lastActive: 'Today',
  },
  {
    id: '4',
    name: 'James Davis',
    age: 70,
    relationship: 'Uncle',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    stories: 19,
    lastActive: 'Yesterday',
  },
  {
    id: '5',
    name: 'Elizabeth Brown',
    age: 62,
    relationship: 'Friend',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    stories: 15,
    lastActive: '3 days ago',
  },
];

export default function FriendsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const textColor = Colors[colorScheme].text;
  const backgroundColor = Colors[colorScheme].background;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState(MOCK_FRIENDS);

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity 
      style={[styles.friendCard, { backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5' }]}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.friendInfo}>
        <Text style={[styles.friendName, { color: textColor }]}>{item.name}</Text>
        <Text style={[styles.friendDetails, { color: colorScheme === 'dark' ? '#CCC' : '#666' }]}>
          {item.relationship} • {item.age} years
        </Text>
        <View style={styles.friendStats}>
          <Text style={[styles.friendStories, { color: colorScheme === 'dark' ? '#AAA' : '#444' }]}>
            {item.stories} stories
          </Text>
          <Text style={[styles.friendActive, { color: colorScheme === 'dark' ? '#AAA' : '#444' }]}>
            Active {item.lastActive}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Ionicons name="chevron-forward" size={24} color={Colors[colorScheme].tint} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Family & Friends</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="person-add-outline" size={24} color={Colors[colorScheme].tint} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5' }]}>
        <Ionicons name="search" size={20} color={colorScheme === 'dark' ? '#AAA' : '#999'} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search family & friends"
          placeholderTextColor={colorScheme === 'dark' ? '#AAA' : '#999'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colorScheme === 'dark' ? '#AAA' : '#999'} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inviteContainer}>
        <View style={[styles.inviteCard, { backgroundColor: colorScheme === 'dark' ? '#252525' : '#F5F5F5' }]}>
          <View style={styles.inviteIconContainer}>
            <Ionicons name="mail-outline" size={24} color={Colors[colorScheme].tint} />
          </View>
          <View style={styles.inviteContent}>
            <Text style={[styles.inviteTitle, { color: textColor }]}>Invite Family Members</Text>
            <Text style={[styles.inviteDescription, { color: colorScheme === 'dark' ? '#CCC' : '#666' }]}>
              Share your stories with loved ones
            </Text>
          </View>
          <TouchableOpacity style={[styles.inviteButton, { backgroundColor: Colors[colorScheme].tint }]}>
            <Text style={{ color: '#FFF', fontWeight: '600' }}>Invite</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {filteredFriends.length} {filteredFriends.length === 1 ? 'Person' : 'People'}
        </Text>
        <TouchableOpacity>
          <Text style={{ color: Colors[colorScheme].tint }}>Sort</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredFriends}
        renderItem={renderFriendItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={64} color={colorScheme === 'dark' ? '#444' : '#DDD'} />
            <Text style={[styles.emptyText, { color: colorScheme === 'dark' ? '#AAA' : '#999' }]}>
              {searchQuery.length > 0 
                ? `No results found for "${searchQuery}"`
                : "You haven't added any family or friends yet"}
            </Text>
          </View>
        }
      />
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    height: 46,
    borderRadius: 23,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  inviteContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  inviteIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inviteContent: {
    flex: 1,
  },
  inviteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  inviteDescription: {
    fontSize: 14,
  },
  inviteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  friendDetails: {
    fontSize: 14,
    marginBottom: 6,
  },
  friendStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  friendStories: {
    fontSize: 13,
  },
  friendActive: {
    fontSize: 13,
  },
  viewButton: {
    padding: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
}); 