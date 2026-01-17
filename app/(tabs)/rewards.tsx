import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHabits } from '@/contexts/HabitsContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

const REWARD_CATEGORIES = [
  { id: 'all', label: 'All Rewards', emoji: '🎁' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { id: 'food', label: 'Food & Drink', emoji: '☕' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
];

const GIFT_CARDS = [
  {
    id: 'spotify',
    brand: 'Spotify',
    emoji: '🎵',
    price: 500,
    value: '$10',
    gradient: ['#1DB954', '#1ED760', '#1AA34A'],
    darkColor: '#1AA34A',
    description: '1 month Premium subscription',
    pattern: 'diagonal',
    category: 'entertainment',
    savings: '10%',
  },
  {
    id: 'amazon',
    brand: 'Amazon',
    emoji: '📦',
    price: 1000,
    value: '$25',
    gradient: ['#FF9900', '#FFB84D', '#E68A00'],
    darkColor: '#E68A00',
    description: 'Gift Card for shopping',
    pattern: 'radial',
    category: 'shopping',
    featured: true,
  },
  {
    id: 'netflix',
    brand: 'Netflix',
    emoji: '🎬',
    price: 800,
    value: '$15',
    gradient: ['#E50914', '#B20710', '#8B0000'],
    darkColor: '#B20710',
    description: '1 month subscription',
    pattern: 'vertical',
    category: 'entertainment',
  },
  {
    id: 'starbucks',
    brand: 'Starbucks',
    emoji: '☕',
    price: 600,
    value: '$10',
    gradient: ['#00704A', '#008C5A', '#005A3C'],
    darkColor: '#005A3C',
    description: 'Gift Card',
    pattern: 'diagonal',
    category: 'food',
  },
  {
    id: 'apple',
    brand: 'Apple',
    emoji: '🍎',
    price: 1500,
    value: '$50',
    gradient: ['#000000', '#1C1C1E', '#2C2C2E'],
    darkColor: '#1C1C1E',
    description: 'App Store & iTunes',
    pattern: 'vertical',
    category: 'entertainment',
  },
  {
    id: 'uber',
    brand: 'Uber Eats',
    emoji: '🍔',
    price: 700,
    value: '$20',
    gradient: ['#06C167', '#05B65B', '#049B4E'],
    darkColor: '#049B4E',
    description: 'Food delivery credit',
    pattern: 'horizontal',
    category: 'food',
  },
  {
    id: 'nike',
    brand: 'Nike',
    emoji: '👟',
    price: 1200,
    value: '$30',
    gradient: ['#000000', '#2C2C2E', '#1C1C1E'],
    darkColor: '#1C1C1E',
    description: 'Store Credit',
    pattern: 'diagonal',
    category: 'shopping',
  },
  {
    id: 'steam',
    brand: 'Steam',
    emoji: '🎮',
    price: 900,
    value: '$20',
    gradient: ['#171A21', '#1B2838', '#2A475E'],
    darkColor: '#1B2838',
    description: 'Wallet Code',
    pattern: 'vertical',
    category: 'entertainment',
  },
];

export default function RewardsScreen() {
  const { tasks } = useHabits();
  const [redeemedCards, setRedeemedCards] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Calculate total coins from tasks
  const userCoins = tasks.reduce((sum, task) => sum + (task.completed * task.points), 0);

  const handleRedeem = (card: typeof GIFT_CARDS[0]) => {
    if (redeemedCards.includes(card.id)) {
      Alert.alert('Already Redeemed', `You've already redeemed this ${card.brand} reward!`);
      return;
    }

    if (userCoins < card.price) {
      const needed = card.price - userCoins;
      Alert.alert(
        'Not Enough Coins',
        `You need ${needed} more coins to redeem this reward. Keep completing habits to earn more!`,
        [{ text: 'Got it!', style: 'default' }]
      );
      return;
    }

    Alert.alert(
      'Redeem Reward?',
      `Redeem ${card.value} ${card.brand} for ${card.price} coins?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          style: 'default',
          onPress: () => {
            setRedeemedCards([...redeemedCards, card.id]);
            Alert.alert(
              'Success! 🎉',
              `Your ${card.brand} ${card.value} reward code will be sent to your email!`
            );
          },
        },
      ]
    );
  };

  const filteredCards = GIFT_CARDS.filter(
    (card) => selectedCategory === 'all' || card.category === selectedCategory
  );

  const nextReward = GIFT_CARDS
    .filter((card) => !redeemedCards.includes(card.id) && userCoins < card.price)
    .sort((a, b) => a.price - b.price)[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#D4A961', '#C69C52', '#B88F43']}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>💰 Your Coin Balance</Text>
          <Text style={styles.heroCoinAmount}>{userCoins}</Text>
          <Text style={styles.heroSubtitle}>coins available to spend</Text>

          {nextReward && (
            <View style={styles.nextRewardBadge}>
              <Text style={styles.nextRewardText}>
                {nextReward.price - userCoins} more coins until {nextReward.emoji} {nextReward.brand}!
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{redeemedCards.length}</Text>
          <Text style={styles.statLabel}>Redeemed</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{GIFT_CARDS.length - redeemedCards.length}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {GIFT_CARDS.filter((c) => userCoins >= c.price && !redeemedCards.includes(c.id)).length}
          </Text>
          <Text style={styles.statLabel}>Can Afford</Text>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {REWARD_CATEGORIES.map((category) => (
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

      {/* Rewards List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'all' ? '🎁 All Rewards' : `${REWARD_CATEGORIES.find(c => c.id === selectedCategory)?.emoji} ${REWARD_CATEGORIES.find(c => c.id === selectedCategory)?.label}`}
        </Text>
        <View style={styles.rewardsList}>
          {filteredCards.map((card) => {
            const isRedeemed = redeemedCards.includes(card.id);
            const canAfford = userCoins >= card.price;
            const progress = Math.min((userCoins / card.price) * 100, 100);

            const gradientProps =
              card.pattern === 'vertical' ? { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } } :
              card.pattern === 'horizontal' ? { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } } :
              card.pattern === 'radial' ? { start: { x: 0.5, y: 0.5 }, end: { x: 1, y: 1 } } :
              { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };

            return (
              <TouchableOpacity
                key={card.id}
                style={styles.rewardCard}
                onPress={() => handleRedeem(card)}
                activeOpacity={0.8}
                disabled={isRedeemed}
              >
                <LinearGradient
                  colors={card.gradient as any}
                  style={[styles.cardContent, isRedeemed && styles.cardRedeemed]}
                  {...gradientProps}
                >
                  {renderCardContent(card, isRedeemed, canAfford, userCoins, progress)}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Pro Tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipEmoji}>💡</Text>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Pro Tip</Text>
          <Text style={styles.tipText}>
            Complete more habits to earn coins faster! Each habit completion rewards you with coins.
          </Text>
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

function renderCardContent(
  card: typeof GIFT_CARDS[0],
  isRedeemed: boolean,
  canAfford: boolean,
  userCoins: number,
  progress: number
) {
  return (
    <>
      {/* Featured Badge */}
      {card.featured && !isRedeemed && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>⭐ FEATURED</Text>
        </View>
      )}

      {/* Savings Badge */}
      {card.savings && !isRedeemed && (
        <View style={styles.savingsBadge}>
          <Text style={styles.savingsText}>Save {card.savings}</Text>
        </View>
      )}

      <View style={styles.cardTop}>
        <View style={styles.brandRow}>
          <Text style={styles.cardEmoji}>{card.emoji}</Text>
          <View style={styles.brandInfo}>
            <Text style={styles.brandName}>{card.brand}</Text>
            <Text style={styles.cardValue}>{card.value} Value</Text>
          </View>
        </View>
      </View>

      <Text style={styles.cardDescription}>{card.description}</Text>

      {/* Progress Bar (if not affordable and not redeemed) */}
      {!canAfford && !isRedeemed && (
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {userCoins}/{card.price} coins ({Math.round(progress)}%)
          </Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceEmoji}>🪙</Text>
          <Text style={styles.priceAmount}>{card.price}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            isRedeemed && styles.statusRedeemed,
            canAfford && !isRedeemed && styles.statusReady,
            !canAfford && !isRedeemed && styles.statusLocked,
          ]}
        >
          <Text style={styles.statusText}>
            {isRedeemed ? '✓ Redeemed' : canAfford ? 'Tap to Redeem' : '🔒 Locked'}
          </Text>
        </View>
      </View>

      {/* Locked Overlay */}
      {!canAfford && !isRedeemed && (
        <View style={styles.lockedOverlay}>
          <Text style={styles.lockedIcon}>🔒</Text>
          <Text style={styles.lockedText}>
            Need {card.price - userCoins} more coins
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0FA',
  },
  hero: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 16,
    fontFamily: 'Georgia',
    color: '#2E241B',
    marginBottom: 8,
  },
  heroCoinAmount: {
    fontSize: 64,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2E241B',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Georgia',
    color: '#7D6A54',
  },
  nextRewardBadge: {
    marginTop: 16,
    backgroundColor: 'rgba(46, 36, 27, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  nextRewardText: {
    fontSize: 12,
    fontFamily: 'Georgia',
    color: '#2E241B',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E0F0',
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2E241B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Georgia',
    color: '#7D6A54',
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
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
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2E241B',
    marginBottom: 16,
  },
  rewardsList: {
    gap: 16,
  },
  rewardCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#C3B39B',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardContent: {
    padding: 20,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  cardRedeemed: {
    opacity: 0.5,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 20,
  },
  cardImageStyle: {
    borderRadius: 20,
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  featuredText: {
    fontSize: 10,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2E241B',
  },
  savingsBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 10,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardTop: {
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardEmoji: {
    fontSize: 48,
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 24,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontFamily: 'Georgia',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Georgia',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontFamily: 'Georgia',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  priceEmoji: {
    fontSize: 18,
  },
  priceAmount: {
    fontSize: 18,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  statusRedeemed: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  statusReady: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  statusLocked: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2E241B',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  lockedIcon: {
    fontSize: 48,
  },
  lockedText: {
    fontSize: 14,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tipCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: '#E8E0F0',
  },
  tipEmoji: {
    fontSize: 32,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    color: '#2E241B',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    fontFamily: 'Georgia',
    color: '#7D6A54',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 40,
  },
});
