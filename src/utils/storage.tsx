import type { ActiveSession, ActivityLog } from "../types";

const STORAGE_KEYS = {
  ACTIVE_SESSION: "activeSession",
  ACTIVITY_LOGS: "activityLogs",
};

// Active Session Management
export const addNewSession = (session: ActiveSession) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
};

export const getActiveSession = (): ActiveSession | null => {
  const session = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
  return session ? JSON.parse(session) : null;
};

export const clearActiveSession = () => {
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
};

// Activity Logs Management
export const saveActivityLog = (log: ActivityLog) => {
  const logs = getAllActivityLogs();
  logs.push(log);
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs));
};

export const getAllActivityLogs = (): ActivityLog[] => {
  const logs = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
  return logs ? JSON.parse(logs) : [];
};

export const getTodayLogs = (): ActivityLog[] => {
  const today = new Date().toLocaleDateString('en-US');
  const allLogs = getAllActivityLogs();
  return allLogs.filter(log => {
    const logDate = new Date(log.startTime).toLocaleDateString('en-US');
    return logDate === today;
  });
};

export const getLogsByDateRange = (startDate: string, endDate: string): ActivityLog[] => {
  const allLogs = getAllActivityLogs();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return allLogs.filter(log => {
    return log.startTime >= start && log.startTime <= end;
  });
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOGS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
};
