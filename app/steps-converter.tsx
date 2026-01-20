import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { useHabits } from '../contexts/HabitsContext';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.65;
const STROKE_WIDTH = 20;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function StepsConverter() {
  const router = useRouter();
  const { updateCoins, currentSteps, updateTaskProgress } = useHabits();

  // Step goals with their coin rewards
  // const goals = [
  //   { steps: 2500, coins: 2500, position: 'top', status: 'completed' },
  //   { steps: 5000, coins: 5000, position: 'right', status: 'current' },
  //   { steps: 7500, coins: 7500, position: 'bottom', status: 'locked' },
  //   { steps: 10000, coins: 10000, position: 'bottom-right', status: 'locked' },
  // ];

  const goals = [];
  const maxSteps = 5000; // Current goal being worked towards
  const progress = Math.min(currentSteps / maxSteps, 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const handleConvert = () => {
    // Calculate coins earned (400 steps = 1 coin)
    const coinsEarned = Math.floor(currentSteps / 400);

    // Update coins in context
    updateCoins(coinsEarned);

    // Mark the movement break task as completed
    updateTaskProgress('steps');

    // Close the screen
    router.back();
  };

  const getGoalPosition = (position: string) => {
    const centerX = CIRCLE_SIZE / 2;
    const centerY = CIRCLE_SIZE / 2;
    const badgeRadius = RADIUS + 10;

    switch (position) {
      case 'top':
        return { top: 0, left: centerX - 40 };
      case 'right':
        return { top: centerY - 25, right: -10 };
      case 'bottom':
        return { bottom: 0, left: centerX - 40 };
      case 'bottom-right':
        return { bottom: 30, right: 10 };
      default:
        return { top: 0, left: 0 };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity> */}
        <View>
          <Text style={styles.headerTitle}>Movement Break</Text>
          <Text style={styles.headerSubtitle}>Gentle activity to stay active</Text>
        </View>
      </View>

      {/* Circle Progress */}
      <View style={styles.circleContainer}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          {/* Background circles */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke="#E0E0E0"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* Light blue arc (locked portion) */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke="#B3E5FC"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * 0.5}
            rotation="-90"
            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
          />
          {/* Green progress arc */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke="#66BB6A"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
          />
        </Svg>

        {/* Center text */}
        <View style={styles.centerContent}>
          <Text style={styles.stepsNumber}>{currentSteps.toLocaleString()}</Text>
          <Text style={styles.stepsLabel}>{maxSteps.toLocaleString()} Steps</Text>
        </View>

        {/* Goal badges */}
        {goals.map((goal, index) => (
          <View
            key={index}
            style={[
              styles.goalBadge,
              goal.status === 'completed' && styles.goalBadgeCompleted,
              goal.status === 'current' && styles.goalBadgeCurrent,
              getGoalPosition(goal.position),
            ]}
          >
            {goal.status === 'completed' && (
              <View style={styles.checkmarkContainer}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.goalPoints}>-20</Text>
              </View>
            )}
            {goal.status !== 'completed' && (
              <>
                <Text style={styles.coinIcon}>🪙</Text>
                <Text style={styles.goalCoins}>{goal.coins.toLocaleString()}</Text>
              </>
            )}
          </View>
        ))}
      </View>

      {/* Convert Button */}
      <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
        <Text style={styles.convertButtonText}>Convert my steps</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backArrow: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  circleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsNumber: {
    fontSize: 56,
    fontWeight: '700',
    color: '#1F2937',
  },
  stepsLabel: {
    fontSize: 18,
    color: '#9CA3AF',
    marginTop: 8,
  },
  goalBadge: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalBadgeCompleted: {
    backgroundColor: '#E8F5E9',
  },
  goalBadgeCurrent: {
    backgroundColor: '#66BB6A',
  },
  checkmarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkmark: {
    fontSize: 16,
    color: '#2E7D32',
  },
  goalPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  coinIcon: {
    fontSize: 18,
  },
  goalCoins: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  convertButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#66BB6A',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  convertButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
