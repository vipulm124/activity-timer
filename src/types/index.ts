export type Activity = 'sitting' | 'standing' | 'laying down' | 'walking';

export interface ActivityLog {
  id: string;
  activity: Activity;
  startTime: number;
  endTime: number;
  duration: number;
}



export interface ActivityType {
  name: string,
  icon: any,
  color: string,
  gradient: string
}

export interface ActiveSession {
  activityDate: string,
  activity: Activity;
  startTime: number;
}

export interface DashboardStats {
  totalTime: number;
  activityCount: number;
  breakdown: Record<Activity, number>;
  mostCommonActivity: Activity | null;
}

export interface DateRange {
  start: string;
  end: string;
}