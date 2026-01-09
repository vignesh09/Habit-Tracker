import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
  key: string;
  title: string;
  completed: number;
  total: number;
  points: number;
  icon: string;
}

interface HabitsContextType {
  tasks: Task[];
  addTask: (habit: { id: string; title: string; icon: string; points: number }) => void;
  updateTaskProgress: (taskKey: string, onComplete?: (isFullyCompleted: boolean) => void) => void;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

const INITIAL_TASKS: Task[] = [
  { key: "breath", title: "Breath exercise", completed: 2, total: 7, points: 10, icon: "🫧" },
  { key: "sleep", title: "8h sleep", completed: 2, total: 7, points: 140, icon: "💤" },
  { key: "steps", title: "10 000 steps", completed: 2, total: 7, points: 140, icon: "👟" },
  { key: "move", title: "Move 30 min", completed: 2, total: 7, points: 140, icon: "🏋️" },
];

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const addTask = (habit: { id: string; title: string; icon: string; points: number }) => {
    // Check if task already exists
    const exists = tasks.some(task => task.key === habit.id);
    if (exists) return;

    const newTask: Task = {
      key: habit.id,
      title: habit.title,
      completed: 0,
      total: 7,
      points: habit.points,
      icon: habit.icon,
    };

    setTasks([...tasks, newTask]);
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

  return (
    <HabitsContext.Provider value={{ tasks, addTask, updateTaskProgress }}>
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
