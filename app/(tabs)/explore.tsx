import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useHabits } from '@/contexts/HabitsContext';

const HABIT_CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🌟' },
  { id: 'health', label: 'Health', emoji: '💪' },
  { id: 'mindfulness', label: 'Mindfulness', emoji: '🧘' },
  { id: 'productivity', label: 'Productivity', emoji: '📝' },
  { id: 'social', label: 'Social', emoji: '👥' },
];

const COMMON_HABITS = [
  { id: 'drink-water', title: 'Drink 8 glasses of water', category: 'health', icon: '💧', points: 50 },
  { id: 'meditation', title: 'Meditate 10 minutes', category: 'mindfulness', icon: '🧘', points: 80 },
  { id: 'exercise', title: 'Exercise 30 minutes', category: 'health', icon: '🏃', points: 150 },
  { id: 'read-book', title: 'Read for 20 minutes', category: 'productivity', icon: '📚', points: 100 },
  { id: 'no-phone', title: 'No phone before bed', category: 'mindfulness', icon: '📵', points: 70 },
  { id: 'healthy-meal', title: 'Eat a healthy meal', category: 'health', icon: '🥗', points: 90 },
  { id: 'journal', title: 'Write in journal', category: 'mindfulness', icon: '📔', points: 60 },
  { id: 'call-friend', title: 'Call a friend or family', category: 'social', icon: '📞', points: 80 },
  { id: 'learn-new', title: 'Learn something new', category: 'productivity', icon: '🎓', points: 120 },
  { id: 'stretch', title: 'Stretch for 10 minutes', category: 'health', icon: '🤸', points: 50 },
  { id: 'gratitude', title: 'Practice gratitude', category: 'mindfulness', icon: '🙏', points: 70 },
  { id: 'walk', title: 'Take a 15-minute walk', category: 'health', icon: '🚶', points: 60 },
  { id: 'no-sugar', title: 'Avoid added sugar', category: 'health', icon: '🍬', points: 100 },
  { id: 'plan-day', title: 'Plan tomorrow today', category: 'productivity', icon: '📅', points: 80 },
  { id: 'compliment', title: 'Give a genuine compliment', category: 'social', icon: '💝', points: 50 },
  { id: 'floss', title: 'Floss teeth', category: 'health', icon: '🦷', points: 40 },
  { id: 'limit-social', title: 'Limit social media to 30 min', category: 'mindfulness', icon: '⏰', points: 90 },
  { id: 'hobby', title: 'Spend time on hobby', category: 'productivity', icon: '🎨', points: 100 },
  { id: 'posture', title: 'Practice good posture', category: 'health', icon: '🪑', points: 60 },
  { id: 'help-someone', title: 'Help someone today', category: 'social', icon: '🤝', points: 80 },
];

export default function ExploreScreen() {
  const { tasks, addTask } = useHabits();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHabits = COMMON_HABITS.filter((habit) => {
    const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory;
    const matchesSearch = habit.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddHabit = (habitId: string) => {
    const habit = COMMON_HABITS.find(h => h.id === habitId);
    if (habit) {
      addTask({
        id: habit.id,
        title: habit.title,
        icon: habit.icon,
        points: habit.points,
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Habits</Text>
        <Text style={styles.headerSubtitle}>Discover new habits to build your routine</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search habits..."
          placeholderTextColor="#7D6A54"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {HABIT_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text
              style={[
                styles.categoryLabel,
                selectedCategory === category.id && styles.categoryLabelActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Habits List */}
      <View style={styles.habitsContainer}>
        <Text style={styles.sectionTitle}>
          {filteredHabits.length} {filteredHabits.length === 1 ? 'habit' : 'habits'} available
        </Text>
        <View style={styles.habitsList}>
          {filteredHabits.map((habit) => {
            const isAdded = tasks.some(task => task.key === habit.id);
            return (
              <View key={habit.id} style={styles.habitCard}>
                <View style={styles.habitIcon}>
                  <Text style={styles.habitIconText}>{habit.icon}</Text>
                </View>
                <View style={styles.habitBody}>
                  <Text style={styles.habitTitle}>{habit.title}</Text>
                  <View style={styles.habitMeta}>
                    <View style={styles.pointsBadge}>
                      <Text style={styles.pointsEmoji}>🪙</Text>
                      <Text style={styles.pointsText}>+{habit.points}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    isAdded && styles.addButtonAdded,
                  ]}
                  onPress={() => handleAddHabit(habit.id)}
                  disabled={isAdded}
                  activeOpacity={0.7}
                >
                  <Text style={styles.addButtonText}>
                    {isAdded ? '✓' : '+'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FA',
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2D3748',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Georgia',
    color: '#718096',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E8E0F0',
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Georgia',
    color: '#2E241B',
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E8E0F0',
  },
  categoryChipActive: {
    backgroundColor: '#D4A961',
    borderColor: '#C69C52',
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Georgia',
    color: '#7D6A54',
  },
  categoryLabelActive: {
    color: '#2E241B',
    fontWeight: 'bold',
  },
  habitsContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Georgia',
    color: '#7D6A54',
    marginBottom: 16,
  },
  habitsList: {
    gap: 12,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8E0F0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  habitIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitIconText: {
    fontSize: 24,
  },
  habitBody: {
    flex: 1,
    gap: 6,
  },
  habitTitle: {
    fontSize: 16,
    fontFamily: 'Georgia',
    color: '#2E241B',
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3D8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  pointsEmoji: {
    fontSize: 12,
  },
  pointsText: {
    fontSize: 12,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2E241B',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#D4A961',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonAdded: {
    backgroundColor: '#4CAF50',
  },
  addButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});
