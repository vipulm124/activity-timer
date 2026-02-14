import ActivityTile from "./activitytile";
import { BarChart3 } from "lucide-react";
import type { Activity } from "../types";

function ActivitySelection({
  onActivitySelect,
  onViewDashboard,
}: {
  onActivitySelect: (activity: Activity) => void;
  onViewDashboard: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Activity Tracker
          </h1>
          <p className="text-gray-600">Select an activity to start tracking</p>
        </div>
        <ActivityTile onActivitySelect={onActivitySelect} />
        <button
          onClick={onViewDashboard}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
        >
          <BarChart3 size={24} />
          <span>View Activity Dashboard</span>
        </button>
      </div>
    </div>
  );
}

export default ActivitySelection;
