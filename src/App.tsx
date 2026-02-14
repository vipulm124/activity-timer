import { useState } from "react";
import "./App.css";
import type { ActiveSession, ActivityLog, Activity } from "./types";
import ActivityTimer from "./components/activitytimer";
import ActivitySelection from "./components/activityselection";
import Dashboard from "./components/dashboard";
import { addNewSession, saveActivityLog, clearActiveSession } from './utils/storage';
import { v4 as uuidv4 } from 'uuid';

type View = 'selection' | 'timer' | 'dashboard';

function App() {
  const [view, setView] = useState<View>("selection");
  const [activeSessions, setActiveSession] = useState<ActiveSession | null>(
    null,
  );

  const handleActivitySelect = (activity: Activity) => {
    const session: ActiveSession = {
      activityDate: new Date().toLocaleDateString('en-US'),
      activity: activity,
      startTime: Date.now(),
    };
    setActiveSession(session);
    addNewSession(session);
    setView("timer");
  };

  const handleSessionEnd = (activeSession: ActiveSession) => {
    if (!activeSession) return;

    const endTime = Date.now();
    const duration = endTime - activeSession.startTime;

    const activityLog: ActivityLog = {
      id: uuidv4(),
      activity: activeSession.activity,
      startTime: activeSession.startTime,
      endTime: endTime,
      duration: duration,
    };

    // Save the completed activity log
    saveActivityLog(activityLog);

    // Clear the active session
    clearActiveSession();
    setActiveSession(null);

    // Return to selection view
    setView("selection");
  };

  const handleViewDashboard = () => {
    setView("dashboard");
  };

  const handleBackToSelection = () => {
    setView("selection");
  };



  return (
    <div className="max-h-screen max-w-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {view === "selection" && (
        <ActivitySelection
          onActivitySelect={handleActivitySelect}
          onViewDashboard={handleViewDashboard}
        />
      )}
      {view === "timer" && activeSessions && (
        <ActivityTimer
          activity={activeSessions.activity}
          startTime={activeSessions.startTime}
          onEnd={() => handleSessionEnd(activeSessions)}
        />
      )}
      {view === "dashboard" && (
        <Dashboard onBack={handleBackToSelection} />
      )}
    </div>
  );
}

export default App;

