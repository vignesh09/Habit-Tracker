import { useMemo, useState, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { useHabits } from "../../contexts/HabitsContext";

const WEEK_DAYS = [
  { key: "mon", label: "M", streak: true },
  { key: "tue", label: "T", streak: true },
  { key: "wed", label: "W", streak: true },
  { key: "thu", label: "T", streak: false },
  { key: "fri", label: "F", streak: true },
  { key: "sat", label: "S", streak: true },
  { key: "sun", label: "S", streak: true },
];

export default function HomeScreen() {
  const { tasks, updateTaskProgress } = useHabits();
  const [completedAnimations, setCompletedAnimations] = useState({});
  const confettiRef = useRef(null);

  const weeklyStreak = useMemo(() => {
    return WEEK_DAYS.filter((day) => day.streak).length;
  }, []);

  const totalCoins = useMemo(() => {
    return tasks.reduce((sum, task) => sum + (task.completed * task.points), 0);
  }, [tasks]);

  const completedTasksCount = useMemo(() => {
    return tasks.filter((task) => task.completed >= task.total).length;
  }, [tasks]);

  const remainingTasksCount = tasks.length - completedTasksCount;

  const progressPercentage = useMemo(() => {
    return (completedTasksCount / tasks.length) * 100;
  }, [completedTasksCount, tasks.length]);

  const handleTaskPress = (taskKey) => {
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
    <ScrollView contentContainerStyle={styles.container}>
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

      <View style={styles.mascotCard}>
        <Image
          source={require("../../assets/images/mascot-homescreen.png")}
          style={styles.mascotImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}>
        <View style={styles.earningRow}>
          <Text style={styles.sectionTitle}>Today's earning</Text>
          <View style={styles.earningMeta}>
            <Text style={styles.earningMetaText}>+1 day streak</Text>
            <Text style={styles.earningMetaIcon}>🔥</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        <View style={styles.earningFooter}>
          <Text style={styles.sectionSubtitle}>
            {remainingTasksCount} {remainingTasksCount === 1 ? 'task' : 'tasks'} remaining
          </Text>
          <View style={styles.coinRow}>
            <Text style={styles.coinText}>{totalCoins}</Text>
            <Text style={styles.coinIcon}>🪙</Text>
          </View>
        </View>
      </View>

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
              <Text style={styles.dayFire}>🔥</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Active tasks</Text>
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
              <TouchableOpacity
                key={task.key}
                onPress={() => handleTaskPress(task.key)}
                disabled={isCompleted}
                activeOpacity={0.7}
              >
                <Animated.View style={[styles.taskRow, { backgroundColor }]}>
                  <View style={styles.taskIcon}>
                    <Text style={styles.taskIconText}>{task.icon}</Text>
                  </View>
                  <View style={styles.taskBody}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskProgress}>
                      {task.completed}/{task.total} completed
                    </Text>
                  </View>
                  <View style={styles.taskPoints}>
                    <Text style={styles.taskPointsText}>+{task.points}</Text>
                    <Text style={styles.taskPointsIcon}>🪙</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    gap: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pill: {
    backgroundColor: "#FFF8EE",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E6DDD1",
  },
  pillIcon: {
    fontSize: 14,
  },
  pillText: {
    fontSize: 14,
    fontFamily: "Georgia",
    color: "#2E241B",
  },
  topSpacer: {
    flex: 1,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF8EE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E6DDD1",
  },
  avatarBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3C980",
    alignItems: "center",
    justifyContent: "center",
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
  },
  mascotImage: {
    width: 320,
    height: 320,
  },
  card: {
    backgroundColor: "#FFF8EE",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#C3B39B",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Georgia",
    color: "#2E241B",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: "Georgia",
    color: "#7D6A54",
  },
  earningRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  earningMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  earningMetaText: {
    fontSize: 12,
    fontFamily: "Georgia",
    color: "#7D6A54",
  },
  earningMetaIcon: {
    fontSize: 14,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E6DDD1",
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#F3C980",
    minWidth: "2%",
  },
  earningFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  coinText: {
    fontSize: 14,
    fontFamily: "Georgia",
    color: "#2E241B",
  },
  coinIcon: {
    fontSize: 14,
  },
  weekPill: {
    marginTop: 16,
    backgroundColor: "#F7F3EC",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E6DDD1",
  },
  dayStack: {
    alignItems: "center",
    gap: 6,
  },
  dayChip: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  dayChipActive: {
    backgroundColor: "#F3C980",
  },
  dayChipIdle: {
    backgroundColor: "#E6DDD1",
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: "Georgia",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#6B543E",
  },
  dayFire: {
    fontSize: 16,
  },
  taskList: {
    marginTop: 12,
    gap: 10,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EFE7DC",
  },
  taskIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F1D6AE",
    alignItems: "center",
    justifyContent: "center",
  },
  taskIconText: {
    fontSize: 18,
  },
  taskBody: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontFamily: "Georgia",
    color: "#2E241B",
  },
  taskProgress: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: "Georgia",
    color: "#7D6A54",
  },
  taskPoints: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF3D8",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  taskPointsText: {
    fontSize: 12,
    fontFamily: "Georgia",
    color: "#2E241B",
  },
  taskPointsIcon: {
    fontSize: 12,
  },
});
