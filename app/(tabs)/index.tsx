import { useMemo, useRef, useState, useCallback } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  useWindowDimensions,
} from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import ConfettiCannon from "react-native-confetti-cannon";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { useHabits, AvailableActivity } from "../../contexts/HabitsContext";
import { ActivitySelectionSheet } from "../../components/ActivitySelectionSheet";
import { BrainGameSelectionSheet } from "../../components/BrainGameSelectionSheet";
import { MovementSelectionSheet } from "../../components/MovementSelectionSheet";

const WEEK_DAYS = [
  { key: "mon", label: "Su", streak: true },
  { key: "tue", label: "Mo", streak: true },
  { key: "wed", label: "Tu", streak: true },
  { key: "thu", label: "We", streak: true },
  { key: "fri", label: "Th", streak: true },
  { key: "sat", label: "Fr", streak: false },
  { key: "sun", label: "Sa", streak: false },
];

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, myHabits, availableActivities, brainGameActivities, movementActivities, coins, updateTaskProgress, toggleMyHabit, replaceTask } = useHabits();
  const [completedAnimations, setCompletedAnimations] = useState<Record<string, Animated.Value>>({});
  const [selectedTaskKey, setSelectedTaskKey] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width } = useWindowDimensions();
  const confettiRef = useRef<any>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const brainGameBottomSheetRef = useRef<BottomSheet>(null);
  const movementBottomSheetRef = useRef<BottomSheet>(null);

  const weeklyStreak = useMemo(() => {
    return WEEK_DAYS.filter((day) => day.streak).length;
  }, []);

  const completedTasksCount = useMemo(() => {
    return tasks.filter((task) => task.completed >= task.total).length;
  }, [tasks]);

  // Wellness scores (mock data for now)
  const movementScore = 91;
  const recoveryScore = 86;
  const sleepScore = 81;
  const totalScore = 85;

  const handleTaskPress = (taskKey: string) => {
    // Trigger animation
    const animValue = new Animated.Value(0);
    setCompletedAnimations((prev) => ({
      ...prev,
      [taskKey]: animValue,
    }));

    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setCompletedAnimations((prev) => {
        const newAnims = { ...prev };
        delete newAnims[taskKey];
        return newAnims;
      });
    });

    // Update task progress using context
    updateTaskProgress(taskKey, (isFullyCompleted) => {
      // Trigger confetti if task is fully completed
      if (isFullyCompleted && confettiRef.current) {
        setShowConfetti(true);
        setTimeout(() => {
          confettiRef.current.start();
          setTimeout(() => setShowConfetti(false), 4000);
        }, 300);
      }
    });
  };

  const handleChooseActivity = useCallback((taskKey: string) => {
    setSelectedTaskKey(taskKey);
    // Check if it's a brain game task
    if (taskKey === 'sharpen-mind' || taskKey === 'memory-grid' || taskKey === 'number-sequence' || taskKey === 'color-match') {
      brainGameBottomSheetRef.current?.snapToIndex(0);
    } else if (taskKey === 'steps' || taskKey === '10k-steps' || taskKey === 'stretch-loosen' || taskKey === 'short-walk' || taskKey === 'posture-reset') {
      movementBottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, []);

  const handleSelectActivity = useCallback((activity: AvailableActivity) => {
    if (selectedTaskKey) {
      replaceTask(selectedTaskKey, activity);
      setSelectedTaskKey(null);
    }
  }, [selectedTaskKey, replaceTask]);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
    setSelectedTaskKey(null);
  }, []);

  const handleCloseBrainGameBottomSheet = useCallback(() => {
    brainGameBottomSheetRef.current?.close();
    setSelectedTaskKey(null);
  }, []);

  const handleCloseMovementBottomSheet = useCallback(() => {
    movementBottomSheetRef.current?.close();
    setSelectedTaskKey(null);
  }, []);

  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      {showConfetti && (
        <View style={styles.confettiContainer} pointerEvents="none" collapsable={false}>
          <ConfettiCannon
            ref={confettiRef}
            count={200}
            origin={{ x: width / 2, y: 0 }}
            autoStart={false}
            fadeOut={true}
            explosionSpeed={350}
            fallSpeed={3000}
          />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} removeClippedSubviews={false}>
        <View style={styles.topRow}>
          <View style={styles.pill}>
            <Text style={styles.pillIcon}>🪙</Text>
            <Text style={styles.pillText}>{coins}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillIcon}>🔥</Text>
            <Text style={styles.pillText}>{weeklyStreak}</Text>
          </View>
          <View style={styles.topSpacer} />
          <View style={styles.iconBubble}>
            <Text style={styles.iconText}>🔔</Text>
            <View style={styles.dot} />
          </View>
          <View style={styles.avatarBubble}>
            <Text style={styles.iconText}>🧑🏽‍🚀</Text>
          </View>
        </View>

        {/* Mascot Image */}
        <View style={styles.mascotCard}>
          <Text style={styles.mascotTitle}>Let's grow together</Text>
          <Text style={styles.mascotSubtitle}>Stay balanced to keep your streak alive</Text>
          <Image
            source={require("../../assets/images/mascot-image.png")}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Wellness Score Card */}
        <View style={styles.wellnessCard}>
          <Text style={styles.wellnessTitle}>Movement, Recovery, Sleep</Text>
          <Text style={styles.wellnessMessage}>You feel steady and healthy, staying on track in all categories.</Text>

          {/* Circular Progress Indicator */}
          <View style={styles.circularProgressContainer}>
            <View style={styles.circularProgressWrapper}>
              <Svg width="240" height="140" viewBox="0 0 240 140">
                <Defs>
                  <LinearGradient id="wellnessProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor="#B8E986" />
                    <Stop offset="50%" stopColor="#7DD3C0" />
                    <Stop offset="100%" stopColor="#5DADE2" />
                  </LinearGradient>
                </Defs>
                {/* Background arc */}
                <Path
                  d="M 30 120 A 90 90 0 0 1 210 120"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                {/* Progress arc with gradient */}
                <Path
                  d="M 30 120 A 90 90 0 0 1 210 120"
                  fill="none"
                  stroke="url(#wellnessProgressGradient)"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={`${(totalScore / 100) * 283} 283`}
                />
              </Svg>
              <View style={styles.circularProgressCenter}>
                <Text style={styles.circularProgressScore}>{totalScore}</Text>
                <Text style={styles.circularProgressLabel}>average score</Text>
              </View>
            </View>
          </View>

          {/* Category Scores */}
          <View style={styles.categoriesContainer}>
            {/* Movement */}
            <View style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#FFD166' }]}>
                <Text style={styles.categoryIconText}>🚶</Text>
              </View>
              <Text style={styles.categoryPercentage}>{movementScore}%</Text>
              <Text style={styles.categoryLabel}>Movement</Text>
            </View>

            {/* Recovery */}
            <View style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#A8D5A3' }]}>
                <Text style={styles.categoryIconText}>🍃</Text>
              </View>
              <Text style={styles.categoryPercentage}>{recoveryScore}%</Text>
              <Text style={styles.categoryLabel}>Recovery</Text>
            </View>

            {/* Sleep */}
            <View style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: '#C5B3E6' }]}>
                <Text style={styles.categoryIconText}>🌙</Text>
              </View>
              <Text style={styles.categoryPercentage}>{sleepScore}%</Text>
              <Text style={styles.categoryLabel}>Sleep</Text>
            </View>
          </View>

          {/* Weekly Streak Tracker */}
          <View style={styles.weeklyStreakSection}>
            <View style={styles.weekPill}>
              {WEEK_DAYS.map((day) => (
                <View key={day.key} style={styles.dayStack}>
                  <Text style={styles.dayLabel}>{day.label}</Text>
                  <View
                    style={[
                      styles.dayChip,
                      day.streak ? styles.dayChipActive : styles.dayChipIdle,
                    ]}
                  >
                    <Text style={styles.dayFire}>{day.streak ? '✓' : ''}</Text>
                  </View>
                </View>
              ))}
            </View>
            <Text style={styles.streakLabel}>Weekly streak tracker</Text>
          </View>
        </View>

        <View style={styles.rhythmSection}>
          <Text style={styles.sectionTitle}>Today's Rhythm</Text>
          <View style={styles.taskList}>
            {tasks.map((task) => {
              const animValue = completedAnimations[task.key];
              const isCompleted = task.completed >= task.total;

              const backgroundColor = animValue
                ? animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#FFFFFF', '#C8E6C9'],
                  })
                : isCompleted
                ? '#E8F5E9'
                : '#FFFFFF';

              return (
                <Animated.View key={task.key} style={[styles.rhythmCard, { backgroundColor }]}>
                  <View style={styles.rhythmPoints}>
                    <Text style={styles.coinIcon}>🪙</Text>
                    <Text style={styles.rhythmPointsText}>+{task.points}</Text>
                  </View>
                  <View style={styles.rhythmCardContent}>
                    <View style={styles.rhythmIconContainer}>
                      <Text style={styles.rhythmIcon}>{task.icon}</Text>
                      <Text style={styles.fireIcon}>🔥</Text>
                    </View>
                    <View style={styles.rhythmInfo}>
                      <Text style={styles.rhythmTitle}>{task.title}</Text>
                      <Text style={styles.rhythmSubtitle}>{task.duration}</Text>
                    </View>
                  </View>
                  <View style={styles.rhythmButtonRow}>
                    <TouchableOpacity
                      style={styles.chooseActivityButton}
                      activeOpacity={0.7}
                      onPress={() => handleChooseActivity(task.key)}
                    >
                      <Text style={styles.chooseActivityText}>Choose another activity</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.startButton, isCompleted && styles.startButtonCompleted]}
                      onPress={() => {
                        if (task.key === 'meditation' || task.key === 'breathing-exercises') {
                          router.push('/relaxation');
                        } else if (task.key === 'sharpen-mind' || task.key === 'memory-grid' || task.key === 'number-sequence' || task.key === 'color-match') {
                          router.push('/brain-game');
                        } else if (task.key === 'steps' || task.key === '10k-steps' || task.key === 'stretch-loosen' || task.key === 'short-walk' || task.key === 'posture-reset') {
                          router.push('/steps-converter');
                        } else {
                          handleTaskPress(task.key);
                        }
                      }}
                      disabled={isCompleted}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.startButtonText}>
                        {isCompleted ? 'Done' : 'Start'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* My Habits Section */}
        <View style={styles.habitsSection}>
          <View style={styles.habitsSectionHeader}>
            <Text style={styles.habitsSectionTitle}>MY HABITS</Text>
            <Text style={styles.habitsTodayCount}>
              {myHabits.filter(h => h.completed).length}/{myHabits.length} today
            </Text>
          </View>

          <View style={styles.habitsList}>
            {myHabits.map((habit) => (
              <View key={habit.key} style={styles.habitCard}>
                <View style={styles.habitIconContainer}>
                  <Text style={styles.habitIcon}>{habit.icon}</Text>
                </View>
                <View style={styles.habitInfo}>
                  <Text style={styles.habitTitle}>{habit.title}</Text>
                  <View style={styles.habitProgress}>
                    <Text style={styles.habitFireIcon}>🔥</Text>
                    <Text style={styles.habitProgressText}>
                      {habit.weekProgress} / {habit.weekTotal} this week
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.habitDoneButton,
                    habit.completed && styles.habitDoneButtonCompleted
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    toggleMyHabit(habit.key);
                    if (!habit.completed && confettiRef.current) {
                      setShowConfetti(true);
                      confettiRef.current.start();
                      setTimeout(() => setShowConfetti(false), 4000);
                    }
                  }}
                >
                  <Text style={styles.habitDoneIcon}>✓</Text>
                  <Text style={styles.habitDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Add custom habit button */}
            <TouchableOpacity
              style={styles.addHabitButton}
              activeOpacity={0.7}
              onPress={() => router.push('/explore')}
            >
              <Text style={styles.addHabitIcon}>+</Text>
              <Text style={styles.addHabitText}>Add custom habit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Boost your coins */}
        <View style={styles.boostSection}>
          <Text style={styles.sectionTitle}>Boost your coins</Text>
          <View style={styles.boostList}>
            <View style={styles.boostCard}>
              <View style={styles.boostImageContainer}>
                <Text style={styles.boostEmoji}>🎡</Text>
              </View>
              <View style={styles.boostInfo}>
                <Text style={styles.boostTitle}>Spin the Wheel</Text>
                <View style={styles.boostReward}>
                  <Text style={styles.boostRewardText}>Win up to 500</Text>
                  <Text style={styles.boostCoin}>🪙</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.boostButton} activeOpacity={0.8}>
                <Text style={styles.boostButtonText}>Spin</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.boostCard}>
              <View style={styles.boostImageContainer}>
                <Text style={styles.boostEmoji}>🎬</Text>
              </View>
              <View style={styles.boostInfo}>
                <Text style={styles.boostTitle}>Watch a Video</Text>
                <View style={styles.boostReward}>
                  <Text style={styles.boostRewardText}>Watch 100 coins</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.boostButton} activeOpacity={0.8}>
                <Text style={styles.boostButtonText}>Watch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Exclusive Offers */}
        <View style={styles.exclusiveSection}>
          <View style={styles.exclusiveHeader}>
            <Text style={styles.sectionTitle}>Exclusive Offers</Text>
            <TouchableOpacity onPress={() => router.push('/rewards')} activeOpacity={0.7}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.exclusiveList}>
            <View style={styles.exclusiveCard}>
              <Image
                source={require("../../assets/images/amazon.png")}
                style={styles.exclusiveImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.exclusiveCard}>
              <Image
                source={require("../../assets/images/starbucks.png")}
                style={styles.exclusiveImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.exclusiveCard}>
              <Image
                source={require("../../assets/images/steam.png")}
                style={styles.exclusiveImage}
                resizeMode="cover"
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Activity Selection Bottom Sheet */}
      <ActivitySelectionSheet
        ref={bottomSheetRef}
        activities={availableActivities}
        onSelectActivity={handleSelectActivity}
        onClose={handleCloseBottomSheet}
      />

      {/* Brain Game Selection Bottom Sheet */}
      <BrainGameSelectionSheet
        ref={brainGameBottomSheetRef}
        activities={brainGameActivities}
        onSelectActivity={handleSelectActivity}
        onClose={handleCloseBrainGameBottomSheet}
      />

      {/* Movement Selection Bottom Sheet */}
      <MovementSelectionSheet
        ref={movementBottomSheetRef}
        activities={movementActivities}
        onSelectActivity={handleSelectActivity}
        onClose={handleCloseMovementBottomSheet}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F5F0FA",
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 40,
    gap: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pill: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E8E0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pillIcon: {
    fontSize: 14,
  },
  pillText: {
    fontSize: 14,
    fontFamily: "System",
    color: "#4A5568",
  },
  topSpacer: {
    flex: 1,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8E0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3C980",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconText: {
    fontSize: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E35A4D",
    position: "absolute",
    top: 6,
    right: 6,
  },
  mascotCard: {
    alignItems: "center",
    paddingVertical: 1,
  },
  mascotTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2D3748",
    fontFamily: "System",
    marginBottom: 4,
  },
  mascotSubtitle: {
    fontSize: 14,
    color: "#718096",
    fontFamily: "System",
    marginBottom: 8,
  },
  mascotImage: {
    width: 280,
    height: 280,
  },
  wellnessCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E8E0F0",
  },
  wellnessTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2D3748",
    fontFamily: "System",
    marginBottom: 8,
    textAlign: "center",
  },
  wellnessMessage: {
    fontSize: 15,
    color: "#718096",
    fontFamily: "System",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  circularProgressContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  circularProgressWrapper: {
    width: 240,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  circularProgressCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
  },
  circularProgressScore: {
    fontSize: 48,
    fontWeight: "700",
    color: "#2D3748",
    fontFamily: "System",
    lineHeight: 52,
  },
  circularProgressLabel: {
    fontSize: 14,
    color: "#718096",
    fontFamily: "System",
    marginTop: 4,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  categoryItem: {
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryIconText: {
    fontSize: 28,
  },
  categoryPercentage: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    fontFamily: "System",
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 14,
    color: "#718096",
    fontFamily: "System",
  },
  weeklyStreakSection: {
    alignItems: "center",
  },
  weekPill: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
    marginBottom: 8,
  },
  dayStack: {
    alignItems: "center",
    gap: 6,
  },
  dayChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  dayChipActive: {
    backgroundColor: "#FFD166",
    borderColor: "#FFD166",
  },
  dayChipIdle: {
    backgroundColor: "#F0F0F0",
    borderColor: "#E0E0E0",
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: "System",
    color: "#718096",
  },
  dayFire: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  streakLabel: {
    fontSize: 12,
    color: "#A0AEC0",
    fontFamily: "System",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "System",
    color: "#2D3748",
    fontWeight: "600",
    marginBottom: 12,
  },
  rhythmSection: {
    marginBottom: 16,
  },
  taskList: {
    gap: 12,
  },
  rhythmCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  rhythmCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rhythmIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  rhythmIcon: {
    fontSize: 32,
  },
  fireIcon: {
    position: "absolute",
    top: -4,
    right: -4,
    fontSize: 16,
  },
  rhythmInfo: {
    flex: 1,
  },
  rhythmTitle: {
    fontSize: 16,
    fontFamily: "System",
    color: "#2D3748",
    fontWeight: "600",
    marginBottom: 4,
  },
  rhythmSubtitle: {
    fontSize: 14,
    fontFamily: "System",
    color: "#A0AEC0",
  },
  rhythmPoints: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFF4E6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
    borderWidth: 1,
    borderColor: "#FFE4CC",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  coinIcon: {
    fontSize: 12,
  },
  rhythmPointsText: {
    fontSize: 13,
    fontFamily: "System",
    color: "#F97316",
    fontWeight: "700",
  },
  rhythmButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  chooseActivityButton: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  chooseActivityText: {
    fontSize: 14,
    fontFamily: "System",
    color: "#8B9FDE",
    fontWeight: "500",
  },
  startButton: {
    backgroundColor: "#8B9FDE",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonCompleted: {
    backgroundColor: "#10B981",
  },
  startButtonText: {
    fontSize: 14,
    fontFamily: "System",
    color: "#FFFFFF",
    fontWeight: "600",
  },
  boostSection: {
    marginBottom: 16,
  },
  boostList: {
    gap: 12,
  },
  boostCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E8E0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  boostImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
  },
  boostEmoji: {
    fontSize: 36,
  },
  boostInfo: {
    flex: 1,
  },
  boostTitle: {
    fontSize: 16,
    fontFamily: "System",
    color: "#2D3748",
    fontWeight: "600",
    marginBottom: 4,
  },
  boostReward: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  boostRewardText: {
    fontSize: 12,
    fontFamily: "System",
    color: "#64748B",
  },
  boostCoin: {
    fontSize: 14,
  },
  boostButton: {
    backgroundColor: "#8B9FDE",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  boostButtonText: {
    fontSize: 14,
    fontFamily: "System",
    color: "#FFFFFF",
    fontWeight: "600",
  },
  habitsSection: {
    marginBottom: 16,
  },
  habitsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  habitsSectionTitle: {
    fontSize: 16,
    fontFamily: "System",
    color: "#2D3748",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  habitsTodayCount: {
    fontSize: 14,
    fontFamily: "System",
    color: "#A0AEC0",
  },
  habitsList: {
    gap: 12,
  },
  habitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E8E0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  habitIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F7F3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  habitIcon: {
    fontSize: 28,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontFamily: "System",
    color: "#2D3748",
    fontWeight: "600",
    marginBottom: 4,
  },
  habitProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  habitFireIcon: {
    fontSize: 14,
  },
  habitProgressText: {
    fontSize: 13,
    fontFamily: "System",
    color: "#718096",
  },
  habitDoneButton: {
    backgroundColor: "#F0F4F8",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  habitDoneButtonCompleted: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  habitDoneIcon: {
    fontSize: 14,
    color: "#4A5568",
  },
  habitDoneText: {
    fontSize: 14,
    fontFamily: "System",
    color: "#4A5568",
    fontWeight: "500",
  },
  addHabitButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E8E0F0",
    borderStyle: "dashed",
  },
  addHabitIcon: {
    fontSize: 18,
    color: "#A0AEC0",
  },
  addHabitText: {
    fontSize: 14,
    fontFamily: "System",
    color: "#A0AEC0",
    fontWeight: "500",
  },
  exclusiveSection: {
    marginBottom: 16,
  },
  exclusiveHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "System",
    color: "#A0AEC0",
    fontWeight: "500",
  },
  exclusiveList: {
    gap: 12,
    paddingRight: 20,
  },
  exclusiveCard: {
    width: 100,
    height: 130,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  exclusiveImage: {
    width: "100%",
    height: "100%",
  },
  exclusiveBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  exclusiveCoinIcon: {
    fontSize: 16,
  },
  exclusiveCoinAmount: {
    fontSize: 18,
    fontFamily: "System",
    color: "#FFFFFF",
    fontWeight: "700",
  },
  exclusivePriceTag: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  exclusivePriceText: {
    fontSize: 16,
    fontFamily: "System",
    color: "#D4A961",
    fontWeight: "700",
  },
});
