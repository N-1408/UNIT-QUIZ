import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoleStore } from "@/store/roleStore";
import { Plus, FileText, Users, Settings, LogOut } from "lucide-react";

export const TeacherDashboard = () => {
    const navigate = useNavigate();
    const role = useRoleStore((state) => state.role);
    const [activeTab, setActiveTab] = useState("exams");

    if (role === "student") {
        return (
            <div className="flex h-screen items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Ruxsat yo'q</h2>
                    <Button onClick={() => navigate("/")}>Bosh sahifaga qaytish</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/10 bg-slate-900/50 p-6 hidden md:flex flex-col">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-xl">
                        U
                    </div>
                    <span className="text-xl font-bold text-white">UNIT QUIZ</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <Button
                        variant={activeTab === "exams" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("exams")}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Imtihonlar
                    </Button>
                    <Button
                        variant={activeTab === "students" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("students")}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        O'quvchilar
                    </Button>
                    <Button
                        variant={activeTab === "settings" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("settings")}
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Sozlamalar
                    </Button>
                </nav>

                <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20" onClick={() => navigate("/")}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Chiqish
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">O'qituvchi Paneli</h1>
                        <p className="text-slate-400">Xush kelibsiz, Ustoz!</p>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Yangi Imtihon
                    </Button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Faol Imtihonlar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">3</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Jami O'quvchilar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">128</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">O'rtacha Natija</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">76%</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Area */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px]">
                    {activeTab === "exams" && (
                        <div className="text-center py-20">
                            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Imtihonlar ro'yxati</h3>
                            <p className="text-slate-400 mb-6">Hozircha imtihonlar yaratilmagan.</p>
                            <Button variant="outline">Yaratishni boshlash</Button>
                        </div>
                    )}
                    {activeTab === "students" && (
                        <div className="text-center py-20">
                            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">O'quvchilar ro'yxati</h3>
                            <p className="text-slate-400">Tez orada...</p>
                        </div>
                    )}
                    {activeTab === "settings" && (
                        <div className="text-center py-20">
                            <Settings className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Sozlamalar</h3>
                            <p className="text-slate-400">Tez orada...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
