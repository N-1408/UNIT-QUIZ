import { useState, useEffect } from "react";
import { User, Crown, TrendingUp } from "lucide-react";

type LeaderboardUser = {
    id: number;
    name: string;
    score: number;
    rank: number;
    avatar?: string;
    trend?: "up" | "down" | "same";
};

// Mock Data
const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { id: 1, name: "Azizbek T.", score: 2450, rank: 1, trend: "same" },
    { id: 2, name: "Malika R.", score: 2380, rank: 2, trend: "up" },
    { id: 3, name: "Jamshid K.", score: 2150, rank: 3, trend: "down" },
    { id: 4, name: "Sevara M.", score: 1980, rank: 4, trend: "up" },
    { id: 5, name: "Bobur S.", score: 1850, rank: 5, trend: "same" },
    { id: 6, name: "Dildora A.", score: 1720, rank: 6, trend: "down" },
    { id: 7, name: "Otabek N.", score: 1650, rank: 7, trend: "up" },
    { id: 8, name: "Zarina B.", score: 1500, rank: 8, trend: "same" },
    { id: 9, name: "Sardor U.", score: 1420, rank: 9, trend: "down" },
    { id: 10, name: "Laylo Q.", score: 1350, rank: 10, trend: "up" },
];

export const Leaderboard = () => {
    const [users] = useState<LeaderboardUser[]>(MOCK_LEADERBOARD);
    const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
    const [loading, setLoading] = useState(true);

    const [activeFilter, setActiveFilter] = useState<"global" | "group" | "level">("global");

    useEffect(() => {
        // Simulate fetching data
        const fetchData = async () => {
            setLoading(true);
            try {
                // In a real app, we would fetch from API
                // const res = await apiClient.getLeaderboard();

                // Simulate current user being somewhere in the list or outside top 10
                const mockCurrentUser = {
                    id: 123456789,
                    name: "Siz (Guest)",
                    score: 1200,
                    rank: 15,
                    trend: "up" as const
                };
                setCurrentUser(mockCurrentUser);

                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 800));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 pb-24 font-sans text-slate-50 selection:bg-orange-500/30">
            {/* Header */}
            <div className="pt-2 pb-4 px-4 max-w-md mx-auto">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-red-600">
                        Leaderboard
                    </h1>
                </div>
            </div>

            {/* Filters (Sticky) */}
            <div className="sticky top-4 z-30 mx-auto w-full max-w-md px-4 mb-6">
                <div className="inline-flex w-full items-center justify-between rounded-full border border-white/10 bg-slate-900/80 p-1.5 shadow-lg shadow-black/20 backdrop-blur-xl">
                    {(["global", "group", "level"] as const).map((filter) => {
                        const isActive = activeFilter === filter;
                        return (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`relative flex-1 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-out ${isActive
                                    ? "text-white shadow-md"
                                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                    }`}
                            >
                                {isActive && (
                                    <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 transition-transform duration-300" />
                                )}
                                {filter}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-4 max-w-md mx-auto space-y-6">
                {/* Top 3 Podium (Visual Flair) */}
                {!loading && (
                    <div className="flex justify-center items-end gap-4 py-6">
                        {/* 2nd Place */}
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border-2 border-slate-300 bg-slate-800 flex items-center justify-center mb-2 shadow-lg shadow-slate-500/20 relative">
                                <span className="text-xl font-bold text-slate-300">2</span>
                                <div className="absolute -bottom-2 bg-slate-300 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {users[1].score}
                                </div>
                            </div>
                            <span className="text-xs font-medium text-slate-300 max-w-[80px] truncate text-center">{users[1].name}</span>
                        </div>

                        {/* 1st Place */}
                        <div className="flex flex-col items-center -mt-4">
                            <div className="w-20 h-20 rounded-full border-2 border-yellow-400 bg-slate-800 flex items-center justify-center mb-2 shadow-xl shadow-yellow-500/30 relative z-10">
                                <Crown className="w-10 h-10 text-yellow-400" />
                                <div className="absolute -bottom-3 bg-yellow-400 text-yellow-950 text-xs font-bold px-3 py-0.5 rounded-full border-2 border-slate-900">
                                    {users[0].score}
                                </div>
                            </div>
                            <span className="text-sm font-bold text-yellow-400 max-w-[100px] truncate text-center">{users[0].name}</span>
                        </div>

                        {/* 3rd Place */}
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border-2 border-amber-600 bg-slate-800 flex items-center justify-center mb-2 shadow-lg shadow-amber-600/20 relative">
                                <span className="text-xl font-bold text-amber-600">3</span>
                                <div className="absolute -bottom-2 bg-amber-600 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {users[2].score}
                                </div>
                            </div>
                            <span className="text-xs font-medium text-amber-600 max-w-[80px] truncate text-center">{users[2].name}</span>
                        </div>
                    </div>
                )}

                {/* List */}
                <div className="space-y-3">
                    {loading ? (
                        // Skeleton Loading
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
                        ))
                    ) : (
                        users.slice(3).map((user) => (
                            <div
                                key={user.id}
                                className="group relative flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10"
                            >
                                <div className="flex items-center justify-center w-8 font-bold text-slate-500">
                                    {user.rank}
                                </div>

                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-white/10">
                                    <User className="w-5 h-5 text-slate-400" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-slate-200 truncate">{user.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span>{user.score} ball</span>
                                        {user.trend === "up" && <TrendingUp className="w-3 h-3 text-green-500" />}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Current User Sticky Footer */}
                {currentUser && !loading && (
                    <div className="fixed bottom-[88px] left-4 right-4 max-w-md mx-auto">
                        <div className="rounded-2xl border border-orange-500/30 bg-slate-900/90 backdrop-blur-md p-4 shadow-2xl shadow-orange-500/10 flex items-center gap-4 ring-1 ring-orange-500/50">
                            <div className="flex items-center justify-center w-8 font-bold text-orange-500">
                                {currentUser.rank}
                            </div>

                            <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                                <User className="w-5 h-5 text-orange-500" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white truncate">{currentUser.name}</h3>
                                <div className="text-xs text-orange-400 font-medium">
                                    Sizning natijangiz: {currentUser.score} ball
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
