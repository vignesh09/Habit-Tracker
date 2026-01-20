import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useHabits } from '../contexts/HabitsContext';

const { width } = Dimensions.get('window');
const GRID_SIZE = 16;

export default function BrainGameMemory() {
  const [round, setRound] = useState(1);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [showingPattern, setShowingPattern] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();
  const confettiRef = useRef<any>(null);
  const { updateTaskProgress } = useHabits();

  useEffect(() => {
    startRound();
  }, []);

  const startRound = () => {
    const newPattern = [...pattern, Math.floor(Math.random() * GRID_SIZE)];
    setPattern(newPattern);
    setUserPattern([]);
    setShowingPattern(true);

    // Show pattern
    newPattern.forEach((cell, idx) => {
      setTimeout(() => {
        setActiveCell(cell);
        setTimeout(() => setActiveCell(null), 400);
      }, idx * 600);
    });

    setTimeout(() => {
      setShowingPattern(false);
    }, newPattern.length * 600 + 500);
  };

  const handleGameComplete = () => {
    // Update the "sharpen-mind" task in the context
    updateTaskProgress('sharpen-mind', (isFullyCompleted) => {
      if (isFullyCompleted && confettiRef.current) {
        setShowConfetti(true);
        setTimeout(() => {
          confettiRef.current.start();
        }, 100);
      }
    });

    // Navigate back after showing results
    setTimeout(() => {
      router.back();
    }, 3000);
  };

  const handleCellClick = (idx: number) => {
    if (showingPattern || gameOver) return;

    const newUserPattern = [...userPattern, idx];
    setUserPattern(newUserPattern);
    setActiveCell(idx);
    setTimeout(() => setActiveCell(null), 200);

    // Check if correct
    if (pattern[newUserPattern.length - 1] !== idx) {
      setGameOver(true);
      handleGameComplete();
      return;
    }

    // Round complete
    if (newUserPattern.length === pattern.length) {
      setTimeout(() => {
        setRound(round + 1);
        startRound();
      }, 1000);
    }
  };

  if (gameOver) {
    return (
      <SafeAreaView style={styles.gameOverContainer} edges={['top', 'bottom']}>
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
        <View style={styles.gameOverContent}>
          <Text style={styles.trophyIcon}>🏆</Text>
          <Text style={styles.gameOverTitle}>Nice Try!</Text>
          <Text style={styles.roundsCompleted}>{round}</Text>
          <Text style={styles.roundsLabel}>rounds completed</Text>
          <Text style={styles.coinsEarned}>+15</Text>
          <Text style={styles.coinsLabel}>coins earned</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          {/* <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity> */}
          <Text style={styles.roundText}>Round {round}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Memory Grid</Text>
          <Text style={styles.subtitle}>
            {showingPattern ? 'Watch the pattern...' : 'Repeat the pattern!'}
          </Text>
        </View>

        {/* Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.grid}>
            {Array.from({ length: GRID_SIZE }).map((_, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleCellClick(idx)}
                disabled={showingPattern}
                style={[
                  styles.gridCell,
                  activeCell === idx && styles.gridCellActive,
                ]}
                activeOpacity={0.8}
              />
            ))}
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressCount}>
                {userPattern.length} / {pattern.length}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${pattern.length > 0 ? (userPattern.length / pattern.length) * 100 : 0}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backIcon: {
    fontSize: 24,
    color: '#2D3748',
  },
  roundText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B9FDE',
    fontFamily: 'System',
  },
  placeholder: {
    width: 40,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    fontFamily: 'System',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    fontFamily: 'System',
  },
  gridContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - 80,
    maxWidth: 320,
    gap: 12,
  },
  gridCell: {
    width: (width - 80 - 36) / 4,
    maxWidth: 68,
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gridCellActive: {
    backgroundColor: '#8B9FDE',
    shadowColor: '#8B9FDE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  progressSection: {
    marginBottom: 32,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    color: '#718096',
    fontFamily: 'System',
  },
  progressCount: {
    fontSize: 14,
    color: '#718096',
    fontFamily: 'System',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8B9FDE',
    borderRadius: 4,
  },
  gameOverContainer: {
    flex: 1,
    backgroundColor: '#F5F0FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverContent: {
    alignItems: 'center',
    padding: 32,
  },
  trophyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2D3748',
    fontFamily: 'System',
    marginBottom: 16,
  },
  roundsCompleted: {
    fontSize: 64,
    fontWeight: '700',
    color: '#8B9FDE',
    fontFamily: 'System',
    marginBottom: 8,
  },
  roundsLabel: {
    fontSize: 20,
    color: '#718096',
    fontFamily: 'System',
    marginBottom: 32,
  },
  coinsEarned: {
    fontSize: 48,
    fontWeight: '700',
    color: '#F7B733',
    fontFamily: 'System',
    marginBottom: 8,
  },
  coinsLabel: {
    fontSize: 16,
    color: '#718096',
    fontFamily: 'System',
  },
});
