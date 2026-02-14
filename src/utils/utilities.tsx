import type { Activity, ActivityLog } from "../types";

export const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
};

export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

export const getDateString = (date: Date): string => {
  return date.toLocaleDateString('en-US');
};

export const calculateTotalTime = (logs: ActivityLog[], activity?: Activity): number => {
  return logs
    .filter(log => !activity || log.activity === activity)
    .reduce((total, log) => total + log.duration, 0);
};

export const groupLogsByActivity = (logs: ActivityLog[]): Record<Activity, number> => {
  const grouped: Record<string, number> = {
    'sitting': 0,
    'standing': 0,
    'laying down': 0,
    'walking': 0,
  };

  logs.forEach(log => {
    grouped[log.activity] += log.duration;
  });

  return grouped as Record<Activity, number>;
};