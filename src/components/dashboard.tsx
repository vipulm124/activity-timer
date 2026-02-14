import { useEffect, useState } from "react";
import { ArrowLeft, Trash2, Activity as ActivityIcon, Calendar } from "lucide-react";
import { Armchair, User, Bed, Footprints } from "lucide-react";
import type { Activity, ActivityLog } from "../types";
import { getTodayLogs, getAllActivityLogs, getLogsByDateRange, clearAllData } from "../utils/storage";
import { formatDuration, calculateTotalTime, groupLogsByActivity } from "../utils/utilities";

const activityConfig = {
    sitting: { icon: Armchair, gradient: 'from-blue-400 to-blue-600', color: 'bg-blue-500' },
    standing: { icon: User, gradient: 'from-green-400 to-green-600', color: 'bg-green-500' },
    'laying down': { icon: Bed, gradient: 'from-purple-400 to-purple-600', color: 'bg-purple-500' },
    walking: { icon: Footprints, gradient: 'from-orange-400 to-orange-600', color: 'bg-orange-500' },
};

interface DashboardProps {
    onBack: () => void;
}

type DateFilter = 'today' | 'last7days' | 'last30days' | 'alltime' | 'custom';

function Dashboard({ onBack }: DashboardProps) {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [dateFilter, setDateFilter] = useState<DateFilter>('today');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    useEffect(() => {
        loadLogs();
    }, [dateFilter, customStartDate, customEndDate]);

    const loadLogs = () => {
        let filteredLogs: ActivityLog[] = [];
        const now = new Date();

        switch (dateFilter) {
            case 'today':
                filteredLogs = getTodayLogs();
                break;
            case 'last7days': {
                const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredLogs = getLogsByDateRange(
                    sevenDaysAgo.toISOString(),
                    now.toISOString()
                );
                break;
            }
            case 'last30days': {
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                filteredLogs = getLogsByDateRange(
                    thirtyDaysAgo.toISOString(),
                    now.toISOString()
                );
                break;
            }
            case 'alltime':
                filteredLogs = getAllActivityLogs();
                break;
            case 'custom':
                if (customStartDate && customEndDate) {
                    const startDate = new Date(customStartDate);
                    const endDate = new Date(customEndDate);
                    endDate.setHours(23, 59, 59, 999);
                    filteredLogs = getLogsByDateRange(
                        startDate.toISOString(),
                        endDate.toISOString()
                    );
                }
                break;
        }

        setLogs(filteredLogs);
    };

    const handleClearData = () => {
        if (showClearConfirm) {
            clearAllData();
            setLogs([]);
            setShowClearConfirm(false);
        } else {
            setShowClearConfirm(true);
        }
    };

    const totalTime = calculateTotalTime(logs);
    const breakdown = groupLogsByActivity(logs);

    // Find most common activity
    let mostCommonActivity: Activity | null = null;
    let maxTime = 0;
    Object.entries(breakdown).forEach(([activity, time]) => {
        if (time > maxTime) {
            maxTime = time;
            mostCommonActivity = activity as Activity;
        }
    });

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const getDateRangeLabel = () => {
        switch (dateFilter) {
            case 'today':
                return 'Today';
            case 'last7days':
                return 'Last 7 Days';
            case 'last30days':
                return 'Last 30 Days';
            case 'alltime':
                return 'All Time';
            case 'custom':
                return 'Custom Range';
            default:
                return 'Today';
        }
    };

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft size={24} />
                        <span className="font-semibold">Back</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Activity Dashboard</h1>
                    <div className="w-20"></div> {/* Spacer for centering */}
                </div>

                {/* Date Filter */}
                <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar size={24} className="text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-800">Date Range: {getDateRangeLabel()}</h2>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        <button
                            onClick={() => setDateFilter('today')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${dateFilter === 'today'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setDateFilter('last7days')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${dateFilter === 'last7days'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => setDateFilter('last30days')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${dateFilter === 'last30days'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Last 30 Days
                        </button>
                        <button
                            onClick={() => setDateFilter('alltime')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${dateFilter === 'alltime'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Time
                        </button>
                        <button
                            onClick={() => setDateFilter('custom')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${dateFilter === 'custom'
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Custom Range
                        </button>
                    </div>

                    {/* Custom Date Range Picker */}
                    {dateFilter === 'custom' && (
                        <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">End Date</label>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ActivityIcon size={24} className="text-blue-600" />
                            </div>
                            <h3 className="text-gray-600 font-medium">Total Time</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                            {formatDuration(totalTime)}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ActivityIcon size={24} className="text-green-600" />
                            </div>
                            <h3 className="text-gray-600 font-medium">Activities Logged</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">{logs.length}</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <ActivityIcon size={24} className="text-purple-600" />
                            </div>
                            <h3 className="text-gray-600 font-medium">Most Common</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 capitalize">
                            {mostCommonActivity || 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Activity Breakdown */}
                <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Activity Breakdown</h2>
                    {totalTime > 0 ? (
                        <div className="space-y-4">
                            {(Object.entries(breakdown) as [Activity, number][]).map(([activity, time]) => {
                                const percentage = totalTime > 0 ? (time / totalTime) * 100 : 0;
                                const config = activityConfig[activity];
                                const Icon = config.icon;

                                return (
                                    <div key={activity} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 ${config.color} bg-opacity-20 rounded-lg`}>
                                                    <Icon size={20} className={`${config.color.replace('bg-', 'text-')}`} />
                                                </div>
                                                <span className="font-semibold text-gray-700 capitalize">{activity}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-gray-800">{formatDuration(time)}</span>
                                                <span className="text-gray-500 text-sm ml-2">({percentage.toFixed(1)}%)</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No activity data for selected date range</p>
                    )}
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h2>
                    {logs.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {logs.slice().reverse().map((log) => {
                                const config = activityConfig[log.activity];
                                const Icon = config.icon;

                                return (
                                    <div
                                        key={log.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 bg-gradient-to-br ${config.gradient} rounded-xl`}>
                                                <Icon size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 capitalize">{log.activity}</p>
                                                <p className="text-sm text-gray-500">
                                                    {formatTime(log.startTime)} - {formatTime(log.endTime)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">{formatDuration(log.duration)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No activities logged yet</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={handleClearData}
                        className={`flex-1 ${showClearConfirm
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-white hover:bg-gray-50 text-gray-800'
                            } font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3`}
                    >
                        <Trash2 size={24} className={showClearConfirm ? 'text-white' : ''} />
                        <span className={showClearConfirm ? 'text-white' : ''}>
                            {showClearConfirm ? 'Click Again to Confirm' : 'Clear All Data'}
                        </span>
                    </button>
                    {showClearConfirm && (
                        <button
                            onClick={() => setShowClearConfirm(false)}
                            className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
