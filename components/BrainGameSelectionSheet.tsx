import React, { useMemo, forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { AvailableActivity } from "../contexts/HabitsContext";

interface BrainGameSelectionSheetProps {
  activities: AvailableActivity[];
  onSelectActivity: (activity: AvailableActivity) => void;
  onClose: () => void;
}

export const BrainGameSelectionSheet = forwardRef<BottomSheet, BrainGameSelectionSheetProps>(
  ({ activities, onSelectActivity, onClose }, ref) => {
    const snapPoints = useMemo(() => ["75%"], []);

    const groupedActivities = useMemo(() => {
      const groups: Record<string, AvailableActivity[]> = {};
      activities.forEach((activity) => {
        if (!groups[activity.category]) {
          groups[activity.category] = [];
        }
        groups[activity.category].push(activity);
      });
      return groups;
    }, [activities]);

    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.title}>Sharpen Your Brain — Rewards</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>Choose a game</Text>
          </View>

          {/* Activity List */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {Object.entries(groupedActivities).map(([category, categoryActivities]) => (
              <View key={category} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <View style={styles.activityList}>
                  {categoryActivities.map((activity) => (
                    <TouchableOpacity
                      key={activity.key}
                      style={styles.activityCard}
                      activeOpacity={0.7}
                      onPress={() => {
                        onSelectActivity(activity);
                        onClose();
                      }}
                    >
                      <View style={styles.activityIconContainer}>
                        <Text style={styles.activityIcon}>{activity.icon}</Text>
                      </View>
                      <View style={styles.activityInfo}>
                        <Text style={styles.activityTitle}>{activity.title}</Text>
                        <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                      </View>
                      <View style={styles.pointsBadge}>
                        <Text style={styles.coinIcon}>🪙</Text>
                        <Text style={styles.pointsText}>+{activity.points}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: "#D1D5DB",
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: "System",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "System",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 18,
    color: "#6B7280",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  categorySection: {
    marginTop: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    fontFamily: "System",
    marginBottom: 12,
  },
  activityList: {
    gap: 12,
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  activityIcon: {
    fontSize: 28,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    fontFamily: "System",
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "System",
  },
  pointsBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  coinIcon: {
    fontSize: 14,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D97706",
    fontFamily: "System",
  },
  cancelButton: {
    marginTop: 24,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    fontFamily: "System",
  },
});
