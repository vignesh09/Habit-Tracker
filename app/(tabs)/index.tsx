import { useMemo, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHabits } from "../../contexts/HabitsContext";

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
  const { tasks, updateTaskProgress } = useHabits();
  const [completedAnimations, setCompletedAnimations] = useState<Record<string, Animated.Value>>({});
  const confettiRef = useRef<any>(null);

  const weeklyStreak = useMemo(() => {
    return WEEK_DAYS.filter((day) => day.streak).length;
  }, []);

  const totalCoins = useMemo(() => {
    return tasks.reduce((sum, task) => sum + (task.completed * task.points), 0);
  }, [tasks]);

  const completedTasksCount = useMemo(() => {
    return tasks.filter((task) => task.completed >= task.total).length;
  }, [tasks]);

  // Wellness scores (mock data for now)
  const mindScore = 44;
  const bodyScore = 31;
  const soulScore = 10;
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
        setTimeout(() => {
          confettiRef.current.start();
        }, 300);
      }
    });
  };

  return (
    <SafeAreaView style={styles.wrapper} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.pill}>
            <Text style={styles.pillIcon}>🪙</Text>
            <Text style={styles.pillText}>{totalCoins}</Text>
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
            source={require("../../assets/images/mascot-image.jpg")}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Wellness Score Card */}
        <View style={styles.wellnessCard}>
          <Text style={styles.wellnessTitle}>Wellness Score</Text>
          <Text style={styles.wellnessRating}>Excellent</Text>

          <View style={styles.wellnessContent}>
            <View style={styles.scoresList}>
              <View style={styles.scoreItem}>
                <View style={[styles.scoreDot, { backgroundColor: '#7CB8E8' }]} />
                <Text style={styles.scoreLabel}>Mind: {mindScore}/50</Text>
              </View>
              <View style={styles.scoreItem}>
                <View style={[styles.scoreDot, { backgroundColor: '#A8D5A3' }]} />
                <Text style={styles.scoreLabel}>Body: {bodyScore}/35</Text>
              </View>
              <View style={styles.scoreItem}>
                <View style={[styles.scoreDot, { backgroundColor: '#C5B3E6' }]} />
                <Text style={styles.scoreLabel}>Soul: {soulScore}/15</Text>
              </View>
            </View>

            <View style={styles.circleContainer}>
              <ImageBackground
                source={require("../../assets/images/Score.png")}
                style={styles.circleCenter}
                resizeMode="contain"
                imageStyle={styles.circleCenterImage}
              >
                {/* <Text style={styles.totalScore}>{totalScore}</Text> */}
              </ImageBackground>
            </View>
          </View>

          <Text style={styles.wellnessMessage}>Great balance—keep it up!</Text>

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
                      <View style={styles.rhythmMeta}>
                        <Text style={styles.rhythmDuration}>
                          {task.duration}
                        </Text>
                        {task.autoTracked && <Text style={styles.fireEmoji}>🔥</Text>}
                        <Text style={styles.rhythmStreak}>{task.streak}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.rhythmButtonRow}>
                    <TouchableOpacity
                      style={[styles.startButton, isCompleted && styles.startButtonCompleted]}
                      onPress={() => handleTaskPress(task.key)}
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

        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={false}
          fadeOut={true}
          explosionSpeed={350}
          fallSpeed={3000}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F5F0FA",
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
    width: 320,
    height: 320,
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
    fontSize: 18,
    fontWeight: "400",
    color: "#718096",
    fontFamily: "System",
    marginBottom: 4,
  },
  wellnessRating: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D3748",
    fontFamily: "System",
    marginBottom: 20,
  },
  wellnessContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  scoresList: {
    flex: 1,
    gap: 12,
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scoreDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#4A5568",
    fontFamily: "System",
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleCenter: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  circleCenterImage: {
    borderRadius: 70,
  },
  totalScore: {
    fontSize: 40,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "System",
  },
  wellnessMessage: {
    fontSize: 14,
    color: "#718096",
    fontFamily: "System",
    textAlign: "center",
    marginBottom: 20,
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
    marginBottom: 6,
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
  rhythmMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  rhythmDuration: {
    fontSize: 12,
    fontFamily: "System",
    color: "#64748B",
  },
  fireEmoji: {
    fontSize: 12,
  },
  rhythmStreak: {
    fontSize: 12,
    fontFamily: "System",
    color: "#64748B",
  },
  rhythmButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: -26,
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
});
