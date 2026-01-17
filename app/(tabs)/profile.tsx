import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useHabits } from '@/contexts/HabitsContext';

export default function ProfileScreen() {
  const { tasks } = useHabits();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [weeklyReportEnabled, setWeeklyReportEnabled] = useState(true);

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed >= task.total).length;
  const totalCoins = tasks.reduce((sum, task) => sum + (task.completed * task.points), 0);
  const totalCompletions = tasks.reduce((sum, task) => sum + task.completed, 0);
  const currentStreak = 6; // Hardcoded for now
  const longestStreak = 12; // Hardcoded for now
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>🧑🏽‍🚀</Text>
        </View>
        <Text style={styles.userName}>Habit Hero</Text>
        <Text style={styles.userEmail}>hero@habits.com</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statValue}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🪙</Text>
          <Text style={styles.statValue}>{totalCoins}</Text>
          <Text style={styles.statLabel}>Total Coins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>✅</Text>
          <Text style={styles.statValue}>{totalCompletions}</Text>
          <Text style={styles.statLabel}>Completions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>📊</Text>
          <Text style={styles.statValue}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Achievements</Text>
        <View style={styles.achievementsList}>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementEmoji}>🌟</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>First Steps</Text>
              <Text style={styles.achievementDescription}>Complete your first habit</Text>
            </View>
            <View style={styles.achievementBadge}>
              <Text style={styles.achievementBadgeText}>✓</Text>
            </View>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementEmoji}>🔥</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Week Warrior</Text>
              <Text style={styles.achievementDescription}>7 day streak achieved</Text>
            </View>
            <View style={styles.achievementBadge}>
              <Text style={styles.achievementBadgeText}>✓</Text>
            </View>
          </View>
          <View style={[styles.achievementCard, styles.achievementLocked]}>
            <Text style={styles.achievementEmoji}>💎</Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Diamond Habit</Text>
              <Text style={styles.achievementDescription}>30 day streak</Text>
            </View>
            <View style={styles.lockBadge}>
              <Text style={styles.lockBadgeText}>🔒</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Progress Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Progress Overview</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Active Habits</Text>
            <Text style={styles.progressValue}>{totalTasks}</Text>
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Completed This Week</Text>
            <Text style={styles.progressValue}>{completedTasks}/{totalTasks}</Text>
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Longest Streak</Text>
            <Text style={styles.progressValue}>{longestStreak} days</Text>
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Member Since</Text>
            <Text style={styles.progressValue}>Jan 2026</Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Settings</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Daily reminders for habits</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E8E0F0', true: '#D4A961' }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Use dark theme</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#E8E0F0', true: '#D4A961' }}
              thumbColor={darkModeEnabled ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Weekly Report</Text>
              <Text style={styles.settingDescription}>Receive weekly progress summary</Text>
            </View>
            <Switch
              value={weeklyReportEnabled}
              onValueChange={setWeeklyReportEnabled}
              trackColor={{ false: '#E8E0F0', true: '#D4A961' }}
              thumbColor={weeklyReportEnabled ? '#FFFFFF' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Account</Text>
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={styles.actionText}>Edit Profile</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>🔔</Text>
            <Text style={styles.actionText}>Notification Settings</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>🔐</Text>
            <Text style={styles.actionText}>Privacy & Security</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>💾</Text>
            <Text style={styles.actionText}>Backup & Sync</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Help & Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❓ Help & Support</Text>
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionText}>How to Use</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Contact Support</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>⭐</Text>
            <Text style={styles.actionText}>Rate App</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Text style={styles.actionIcon}>📄</Text>
            <Text style={styles.actionText}>Terms & Privacy</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D4A961',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#E8E0F0',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Georgia',
    color: '#718096',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E0F0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2E241B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Georgia',
    color: '#7D6A54',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2E241B',
    marginBottom: 12,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8E0F0',
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementEmoji: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2E241B',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Georgia',
    color: '#7D6A54',
  },
  achievementBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  lockBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8E0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadgeText: {
    fontSize: 14,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8E0F0',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Georgia',
    color: '#7D6A54',
  },
  progressValue: {
    fontSize: 14,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2E241B',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E8E0F0',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2E241B',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Georgia',
    color: '#7D6A54',
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E0F0',
    overflow: 'hidden',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E0F0',
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Georgia',
    color: '#2E241B',
  },
  actionChevron: {
    fontSize: 24,
    color: '#7D6A54',
  },
  logoutButton: {
    marginHorizontal: 24,
    backgroundColor: '#E35A4D',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Georgia',
    color: '#7D6A54',
  },
  bottomSpacer: {
    height: 40,
  },
});
