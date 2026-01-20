import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
  key: string;
  title: string;
  completed: number;
  total: number;
  points: number;
  icon: string;
  category?: 'Mind' | 'BODY' | 'SOUL';
  duration?: string;
  streak?: string;
  autoTracked?: boolean;
}

export interface MyHabit {
  key: string;
  title: string;
  icon: string;
  weekProgress: number;
  weekTotal: number;
  completed: boolean;
}

export interface AvailableActivity {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
  category: 'Relax' | 'Emotional Wellbeing' | 'MEMORY' | 'FOCUS' | '10K STEPS CHALLENGE' | 'QUICK ADD ACTIVITIES';
  points: number;
  duration?: string;
}

interface HabitsContextType {
  tasks: Task[];
  myHabits: MyHabit[];
  availableActivities: AvailableActivity[];
  brainGameActivities: AvailableActivity[];
  movementActivities: AvailableActivity[];
  coins: number;
  currentSteps: number;
  addTask: (habit: { id: string; title: string; icon: string; points: number }) => void;
  updateTaskProgress: (taskKey: string, onComplete?: (isFullyCompleted: boolean) => void) => void;
  toggleMyHabit: (habitKey: string) => void;
  replaceTask: (oldTaskKey: string, newActivity: AvailableActivity) => void;
  updateCoins: (amount: number) => void;
  updateSteps: (steps: number) => void;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

const INITIAL_TASKS: Task[] = [
  {
    key: "sharpen-mind",
    title: "Sharpen your mind",
    completed: 0,
    total: 1,
    points: 15,
    icon: "🧠",
    category: 'Mind',
    duration: 'Short brain games',
    streak: '7-day streak'
  },
  {
    key: "steps",
    title: "Movement break",
    completed: 0,
    total: 1,
    points: 25,
    icon: "💪",
    category: 'BODY',
    duration: 'Gentle activity to stay active',
    streak: '7-day streak',
    autoTracked: true
  },
  {
    key: "meditation",
    title: "Increase Relaxation",
    completed: 0,
    total: 1,
    points: 10,
    icon: "💜",
    category: 'SOUL',
    duration: 'Short breathing or meditation',
    streak: '7-day streak'
  },
];

const INITIAL_MY_HABITS: MyHabit[] = [
  {
    key: "read-15",
    title: "Read for 15 min",
    icon: "📖",
    weekProgress: 1,
    weekTotal: 7,
    completed: false,
  },
  {
    key: "magnesium",
    title: "Have Magnesium",
    icon: "💊",
    weekProgress: 3,
    weekTotal: 7,
    completed: false,
  },
];

const AVAILABLE_ACTIVITIES: AvailableActivity[] = [
  {
    key: "breathing-exercises",
    title: "Breathing Exercises",
    subtitle: "Calming breathing techniques",
    icon: "🌬️",
    category: "Relax",
    points: 10,
    duration: "5-10 minutes"
  },
  {
    key: "meditation",
    title: "Meditation",
    subtitle: "Release emotions",
    icon: "🪷",
    category: "Relax",
    points: 10,
    duration: "10-15 minutes"
  },
  {
    key: "journaling",
    title: "Journaling",
    subtitle: "Express your thoughts and feelings",
    icon: "📔",
    category: "Emotional Wellbeing",
    points: 10,
    duration: "10-15 minutes"
  },
  {
    key: "log-mood",
    title: "Log Your Mood",
    subtitle: "Track your emotions and feelings",
    icon: "😊",
    category: "Emotional Wellbeing",
    points: 10,
    duration: "2-5 minutes"
  },
];

const BRAIN_GAME_ACTIVITIES: AvailableActivity[] = [
  {
    key: "memory-grid",
    title: "Memory Grid",
    subtitle: "Remember the pattern sequence",
    icon: "🧠",
    category: "MEMORY",
    points: 15,
  },
  {
    key: "number-sequence",
    title: "Number Sequence",
    subtitle: "Recall numbers in order",
    icon: "🔢",
    category: "MEMORY",
    points: 15,
  },
  {
    key: "color-match",
    title: "Color Match",
    subtitle: "Ignore distractions, focus on color",
    icon: "🎨",
    category: "FOCUS",
    points: 15,
  },
];

const MOVEMENT_ACTIVITIES: AvailableActivity[] = [
  {
    key: "10k-steps",
    title: "10k Steps Today",
    subtitle: "Track your daily step goal",
    icon: "👟",
    category: "10K STEPS CHALLENGE",
    points: 25,
  },
  {
    key: "stretch-loosen",
    title: "Stretch & Loosen Up",
    subtitle: "2-3 min light stretching",
    icon: "🤸",
    category: "QUICK ADD ACTIVITIES",
    points: 10,
  },
  {
    key: "short-walk",
    title: "Short Walk",
    subtitle: "5-10 min casual walk",
    icon: "🚶",
    category: "QUICK ADD ACTIVITIES",
    points: 10,
  },
  {
    key: "posture-reset",
    title: "Posture Reset",
    subtitle: "1 min stand, roll shoulders, breathe",
    icon: "🧍",
    category: "QUICK ADD ACTIVITIES",
    points: 10,
  },
];

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [myHabits, setMyHabits] = useState<MyHabit[]>(INITIAL_MY_HABITS);
  const [availableActivities] = useState<AvailableActivity[]>(AVAILABLE_ACTIVITIES);
  const [brainGameActivities] = useState<AvailableActivity[]>(BRAIN_GAME_ACTIVITIES);
  const [movementActivities] = useState<AvailableActivity[]>(MOVEMENT_ACTIVITIES);
  const [coins, setCoins] = useState<number>(1247);
  const [currentSteps, setCurrentSteps] = useState<number>(3465);

  const addTask = (habit: { id: string; title: string; icon: string; points: number }) => {
    // Check if habit already exists in myHabits
    const exists = myHabits.some(h => h.key === habit.id);
    if (exists) return;

    const newHabit: MyHabit = {
      key: habit.id,
      title: habit.title,
      icon: habit.icon,
      weekProgress: 0,
      weekTotal: 7,
      completed: false,
    };

    setMyHabits([...myHabits, newHabit]);
  };

  const updateTaskProgress = (taskKey: string, onComplete?: (isFullyCompleted: boolean) => void) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.key === taskKey && task.completed < task.total) {
          const newCompleted = task.completed + 1;
          const isFullyCompleted = newCompleted >= task.total;

          if (onComplete) {
            onComplete(isFullyCompleted);
          }

          return { ...task, completed: newCompleted };
        }
        return task;
      })
    );
  };

  const toggleMyHabit = (habitKey: string) => {
    setMyHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.key === habitKey) {
          const newCompleted = !habit.completed;
          const newWeekProgress = newCompleted
            ? Math.min(habit.weekProgress + 1, habit.weekTotal)
            : Math.max(habit.weekProgress - 1, 0);

          return {
            ...habit,
            completed: newCompleted,
            weekProgress: newWeekProgress
          };
        }
        return habit;
      })
    );
  };

  const replaceTask = (oldTaskKey: string, newActivity: AvailableActivity) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.key === oldTaskKey) {
          // Determine the category based on the new activity
          let category: 'Mind' | 'BODY' | 'SOUL';
          if (newActivity.category === 'MEMORY' || newActivity.category === 'FOCUS') {
            category = 'Mind';
          } else if (newActivity.category === '10K STEPS CHALLENGE' || newActivity.category === 'QUICK ADD ACTIVITIES') {
            category = 'BODY';
          } else {
            category = 'SOUL';
          }

          return {
            key: newActivity.key,
            title: newActivity.title,
            completed: 0,
            total: 1,
            points: newActivity.points,
            icon: newActivity.icon,
            category: category,
            duration: newActivity.subtitle,
            streak: task.streak,
          };
        }
        return task;
      })
    );
  };

  const updateCoins = (amount: number) => {
    setCoins((prevCoins) => prevCoins + amount);
  };

  const updateSteps = (steps: number) => {
    setCurrentSteps(steps);
  };

  return (
    <HabitsContext.Provider value={{
      tasks,
      myHabits,
      availableActivities,
      brainGameActivities,
      movementActivities,
      coins,
      currentSteps,
      addTask,
      updateTaskProgress,
      toggleMyHabit,
      replaceTask,
      updateCoins,
      updateSteps
    }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
}
