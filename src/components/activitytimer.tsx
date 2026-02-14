import { useEffect, useState } from "react";
import type { Activity } from "../types";
import { Square } from "lucide-react";
import { formatTime } from "../utils/utilities";
import { Armchair, User, Bed, Footprints } from "lucide-react";

interface ActiveTimerProps {
  activity: Activity;
  startTime: number;
  onEnd: () => void;
}

const activityConfig = {
  sitting: { icon: Armchair, gradient: 'from-blue-400 to-blue-600' },
  standing: { icon: User, gradient: 'from-green-400 to-green-600' },
  'laying down': { icon: Bed, gradient: 'from-purple-400 to-purple-600' },
  walking: { icon: Footprints, gradient: 'from-orange-400 to-orange-600' },
};

function ActivityTimer({ activity, startTime, onEnd }: ActiveTimerProps) {
  const { icon: Icon, gradient } = activityConfig[activity];
  // const Icon = activity.icon;
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);
    return () => clearInterval(interval);
  }, [startTime]);

  const time = formatTime(elapsed);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div
          className={`bg-gradient-to-br ${gradient} rounded-3xl p-12 shadow-2xl`}
        >
          <div className="flex flex-col items-center gap-8 text-white">
            <div className="p-6 bg-white/20 rounded-full">
              <Icon size={64} strokeWidth={1.5} />
            </div>

            <div className="text-center">
              <p className="text-xl mb-2 opacity-90">Currently</p>
              <h2 className="text-4xl font-bold capitalize">{activity}</h2>
            </div>

            <div className="bg-white/20 rounded-2xl p-8 backdrop-blur-sm w-full">
              <div className="flex justify-center gap-3 text-center">
                <div className="flex flex-col">
                  <span className="text-6xl font-mono font-bold">
                    {time.hours}
                  </span>
                  <span className="text-sm opacity-80 mt-2">Hours</span>
                </div>
                <span className="text-6xl font-bold">:</span>
                <div className="flex flex-col">
                  <span className="text-6xl font-mono font-bold">
                    {time.minutes}
                  </span>
                  <span className="text-sm opacity-80 mt-2">Minutes</span>
                </div>
                <span className="text-6xl font-bold">:</span>
                <div className="flex flex-col">
                  <span className="text-6xl font-mono font-bold">
                    {time.seconds}
                  </span>
                  <span className="text-sm opacity-80 mt-2">Seconds</span>
                </div>
              </div>
            </div>

            <button
              onClick={onEnd}
              className="mt-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 active:scale-95"
            >
              <Square size={24} />
              <span>End Activity</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Timer is running... Click "End Activity" when you're done
          </p>
        </div>
      </div>
    </div>
  );
}

export default ActivityTimer;
