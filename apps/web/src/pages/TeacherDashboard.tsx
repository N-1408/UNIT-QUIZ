import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoleStore } from "@/store/roleStore";
import { Plus, FileText, Users, Settings, LogOut, Edit, Clock } from "lucide-react";
import { CreateExamForm } from "@/components/teacher/CreateExamForm";
import { QuestionEditor } from "@/components/teacher/QuestionEditor";
import { apiClient } from "@/lib/apiClient";
import type { ExamSummaryDto } from "@/types/api";

export const TeacherDashboard = () => {
    const navigate = useNavigate();
    const role = useRoleStore((state) => state.role);
    const [activeTab, setActiveTab] = useState("exams");
    const [isCreatingExam, setIsCreatingExam] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
    const [exams, setExams] = useState<ExamSummaryDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === "exams") {
            loadExams();
        }
    }, [activeTab]);

    const loadExams = async () => {
        setLoading(true);
        const res = await apiClient.getExams();
        if (res.success && res.data) {
            setExams(res.data);
        }
        setLoading(false);
    };

    if (role === "student") {
        return (
            <div className="flex h-screen items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <Button onClick={() => navigate("/")}>Back to Home</Button>
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
                        Exams
                    </Button>
                    <Button
                        variant={activeTab === "students" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("students")}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        Students
                    </Button>
                    <Button
                        variant={activeTab === "settings" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("settings")}
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                </nav>

                <Button variant="outline" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20" onClick={() => navigate("/")}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Teacher Panel</h1>
                        <p className="text-slate-400">Welcome, Teacher!</p>
                    </div>
                    {!isCreatingExam && !selectedExamId && (
                        <Button
                            className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                            onClick={() => setIsCreatingExam(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Exam
                        </Button>
                    )}
                </header>

                {/* Stats Grid - Only show on main view */}
                {!isCreatingExam && !selectedExamId && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-400">Active Exams</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-white">{exams.filter(e => e.status === 'open').length}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-400">Total Exams</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-white">{exams.length}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-400">Average Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-white">--%</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Content Area */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[400px]">
                    {isCreatingExam ? (
                        <CreateExamForm
                            onSuccess={() => {
                                setIsCreatingExam(false);
                                loadExams();
                            }}
                            onCancel={() => setIsCreatingExam(false)}
                        />
                    ) : selectedExamId ? (
                        <QuestionEditor
                            examId={selectedExamId}
                            onBack={() => setSelectedExamId(null)}
                        />
                    ) : (
                        <>
                            {activeTab === "exams" && (
                                <div>
                                    {loading ? (
                                        <div className="text-center py-20 text-slate-400">Loading...</div>
                                    ) : exams.length === 0 ? (
                                        <div className="text-center py-20">
                                            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-white mb-2">Exam List</h3>
                                            <p className="text-slate-400 mb-6">No exams created yet.</p>
                                            <Button variant="outline" onClick={() => setIsCreatingExam(true)}>Start Creating</Button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {exams.map((exam) => (
                                                <div key={exam.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                                    <div>
                                                        <h3 className="font-semibold text-white text-lg">{exam.title}</h3>
                                                        <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exam.durationMin} min</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs ${exam.status === 'open' ? 'bg-green-500/20 text-green-400' :
                                                                exam.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                                                                    'bg-slate-500/20 text-slate-400'
                                                                }`}>
                                                                {exam.status.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button variant="secondary" onClick={() => setSelectedExamId(exam.id)}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Manage
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === "students" && (
                                <div className="text-center py-20">
                                    <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">Student List</h3>
                                    <p className="text-slate-400">Coming soon...</p>
                                </div>
                            )}
                            {activeTab === "settings" && (
                                <div className="text-center py-20">
                                    <Settings className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-white mb-2">Settings</h3>
                                    <p className="text-slate-400">Coming soon...</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
