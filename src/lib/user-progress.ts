/**
 * User Progress Tracking System
 * Verfolgt Lernfortschritt, Lesehistorie und Statistiken
 */

export interface ProgressEntry {
  id: string;
  userId: string;
  type: 'post' | 'lexicon' | 'grammar' | 'vocab' | 'simulation' | 'chat';
  itemId: string;
  title: string;
  completedAt: string;
  duration?: number; // in seconds
  metadata?: Record<string, any>;
}

export interface UserStats {
  userId: string;
  totalReadingTime: number; // in minutes
  postsRead: number;
  lexiconEntriesViewed: number;
  grammarTopicsCompleted: number;
  vocabWordsLearned: number;
  simulationsCompleted: number;
  chatSessionsCount: number;
  streakDays: number;
  lastActiveDate: string;
  joinDate: string;
}

export interface LearningGoal {
  id: string;
  userId: string;
  type: 'daily_reading' | 'weekly_topics' | 'monthly_vocab';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

// Local Storage Keys
const STORAGE_KEYS = {
  PROGRESS: 'meum_diarium_progress',
  STATS: 'meum_diarium_stats',
  GOALS: 'meum_diarium_goals',
  ACHIEVEMENTS: 'meum_diarium_achievements',
} as const;

/**
 * Lesehistorie speichern
 */
export function trackProgress(entry: Omit<ProgressEntry, 'id' | 'completedAt'>): void {
  const progress: ProgressEntry = {
    ...entry,
    id: `${entry.type}-${entry.itemId}-${Date.now()}`,
    completedAt: new Date().toISOString(),
  };

  const existingProgress = getProgress();
  const updatedProgress = [...existingProgress, progress];
  
  // Nur die letzten 1000 Einträge behalten
  const trimmedProgress = updatedProgress.slice(-1000);
  
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(trimmedProgress));
  updateStats(progress);
  checkAchievements(progress);
}

/**
 * Lesehistorie abrufen
 */
export function getProgress(userId?: string): ProgressEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!stored) return [];
    
    const progress: ProgressEntry[] = JSON.parse(stored);
    return userId ? progress.filter(p => p.userId === userId) : progress;
  } catch {
    return [];
  }
}

/**
 * Benutzerstatistiken aktualisieren
 */
function updateStats(newEntry: ProgressEntry): void {
  const stats = getUserStats(newEntry.userId);
  
  // Grundlegende Statistiken aktualisieren
  stats.totalReadingTime += Math.floor((newEntry.duration || 60) / 60); // Convert to minutes
  stats.lastActiveDate = new Date().toISOString();
  
  switch (newEntry.type) {
    case 'post':
      stats.postsRead++;
      break;
    case 'lexicon':
      stats.lexiconEntriesViewed++;
      break;
    case 'grammar':
      stats.grammarTopicsCompleted++;
      break;
    case 'vocab':
      stats.vocabWordsLearned++;
      break;
    case 'simulation':
      stats.simulationsCompleted++;
      break;
    case 'chat':
      stats.chatSessionsCount++;
      break;
  }
  
  // Streak berechnen
  stats.streakDays = calculateStreak(getProgress(newEntry.userId));
  
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

/**
 * Benutzerstatistiken abrufen
 */
export function getUserStats(userId: string): UserStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    if (stored) {
      const stats: UserStats = JSON.parse(stored);
      if (stats.userId === userId) return stats;
    }
  } catch {
    // Fallback zu leeren Stats
  }
  
  // Initiale Statistiken
  const initialStats: UserStats = {
    userId,
    totalReadingTime: 0,
    postsRead: 0,
    lexiconEntriesViewed: 0,
    grammarTopicsCompleted: 0,
    vocabWordsLearned: 0,
    simulationsCompleted: 0,
    chatSessionsCount: 0,
    streakDays: 0,
    lastActiveDate: new Date().toISOString(),
    joinDate: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(initialStats));
  return initialStats;
}

/**
 * Streak berechnen (aufeinanderfolgende Tage mit Aktivität)
 */
function calculateStreak(progress: ProgressEntry[]): number {
  if (progress.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const uniqueDays = new Set(
    progress.map(p => {
      const date = new Date(p.completedAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );
  
  let streak = 0;
  let currentDate = new Date(today);
  
  while (uniqueDays.has(currentDate.getTime())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
}

/**
 * Erfolge überprüfen und freischalten
 */
function checkAchievements(newEntry: ProgressEntry): void {
  const achievements = getAchievements();
  const stats = getUserStats(newEntry.userId);
  let updated = false;
  
  // Verschiedene Achievement-Typen überprüfen
  const achievementChecks = [
    {
      id: 'first_post',
      condition: stats.postsRead === 1,
      title: 'Erster Schritt',
      description: 'Deinen ersten Beitrag gelesen',
      icon: '📖'
    },
    {
      id: 'reader_10',
      condition: stats.postsRead >= 10,
      title: 'Wissensdurstig',
      description: '10 Beiträge gelesen',
      icon: '📚'
    },
    {
      id: 'reader_50',
      condition: stats.postsRead >= 50,
      title: 'Gelehrter',
      description: '50 Beiträge gelesen',
      icon: '🎓'
    },
    {
      id: 'lexicon_explorer',
      condition: stats.lexiconEntriesViewed >= 25,
      title: 'Lexikon-Kenner',
      description: '25 Lexikon-Einträge angesehen',
      icon: '📝'
    },
    {
      id: 'grammar_master',
      condition: stats.grammarTopicsCompleted >= 5,
      title: 'Grammatik-Meister',
      description: '5 Grammatik-Themen abgeschlossen',
      icon: '📋'
    },
    {
      id: 'streak_7',
      condition: stats.streakDays >= 7,
      title: 'Wöchentliche Routine',
      description: '7 Tage in Folge aktiv',
      icon: '🔥'
    },
    {
      id: 'time_60',
      condition: stats.totalReadingTime >= 60,
      title: 'Zeitinvestition',
      description: '60 Minuten Lesezeit investiert',
      icon: '⏰'
    }
  ];
  
  achievementChecks.forEach(check => {
    const existing = achievements.find(a => a.id === check.id);
    if (!existing && check.condition) {
      achievements.push({
        id: check.id,
        title: check.title,
        description: check.description,
        icon: check.icon,
        unlockedAt: new Date().toISOString(),
        progress: 1,
        maxProgress: 1
      });
      updated = true;
    }
  });
  
  if (updated) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }
}

/**
 * Erfolge abrufen
 */
export function getAchievements(): Achievement[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return stored ? JSON.parse(stored) : getDefaultAchievements();
  } catch {
    return getDefaultAchievements();
  }
}

/**
 * Standard-Erfolge
 */
function getDefaultAchievements(): Achievement[] {
  return [
    {
      id: 'first_post',
      title: 'Erster Schritt',
      description: 'Deinen ersten Beitrag gelesen',
      icon: '📖',
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'reader_10',
      title: 'Wissensdurstig',
      description: '10 Beiträge gelesen',
      icon: '📚',
      progress: 0,
      maxProgress: 10
    },
    {
      id: 'reader_50',
      title: 'Gelehrter',
      description: '50 Beiträge gelesen',
      icon: '🎓',
      progress: 0,
      maxProgress: 50
    },
    {
      id: 'lexicon_explorer',
      title: 'Lexikon-Kenner',
      description: '25 Lexikon-Einträge angesehen',
      icon: '📝',
      progress: 0,
      maxProgress: 25
    },
    {
      id: 'grammar_master',
      title: 'Grammatik-Meister',
      description: '5 Grammatik-Themen abgeschlossen',
      icon: '📋',
      progress: 0,
      maxProgress: 5
    },
    {
      id: 'streak_7',
      title: 'Wöchentliche Routine',
      description: '7 Tage in Folge aktiv',
      icon: '🔥',
      progress: 0,
      maxProgress: 7
    },
    {
      id: 'time_60',
      title: 'Zeitinvestition',
      description: '60 Minuten Lesezeit investiert',
      icon: '⏰',
      progress: 0,
      maxProgress: 60
    }
  ];
}

/**
 * Kürzlich gelesene Inhalte abrufen
 */
export function getRecentActivity(userId: string, limit: number = 10): ProgressEntry[] {
  const progress = getProgress(userId);
  return progress
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, limit);
}

/**
 * Fortschritt für Achievement aktualisieren
 */
export function updateAchievementProgress(achievementId: string, progress: number): void {
  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === achievementId);
  
  if (achievement) {
    achievement.progress = Math.min(progress, achievement.maxProgress);
    if (achievement.progress >= achievement.maxProgress && !achievement.unlockedAt) {
      achievement.unlockedAt = new Date().toISOString();
    }
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }
}

/**
 * Alle User-Daten löschen (für Logout)
 */
export function clearUserData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
