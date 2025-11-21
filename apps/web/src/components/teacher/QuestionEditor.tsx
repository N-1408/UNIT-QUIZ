import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/apiClient";
import { Plus, Trash2, Save, Upload } from "lucide-react";
import type { ExamDetailDto, ExamQuestionDto } from "@/types/api";

type QuestionEditorProps = {
    examId: number;
    onBack: () => void;
};

export const QuestionEditor = ({ examId, onBack }: QuestionEditorProps) => {
    const [loading, setLoading] = useState(true);
    const [exam, setExam] = useState<ExamDetailDto | null>(null);
    const [questions, setQuestions] = useState<ExamQuestionDto[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    // New Question State
    const [newQ, setNewQ] = useState({
        text: "",
        points: 1,
        options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
        ]
    });

    useEffect(() => {
        loadExam();
    }, [examId]);

    const loadExam = async () => {
        setLoading(true);
        const res = await apiClient.getExamById(examId);
        if (res.success && res.data) {
            setExam(res.data);
            setQuestions(res.data.questions || []);
        }
        setLoading(false);
    };

    const handleAddOption = () => {
        setNewQ((prev) => ({
            ...prev,
            options: [...prev.options, { text: "", isCorrect: false }]
        }));
    };

    const handleOptionChange = (idx: number, field: "text" | "isCorrect", value: any) => {
        setNewQ((prev) => {
            const newOptions = [...prev.options];
            if (field === "isCorrect") {
                // If single choice, uncheck others (logic can be expanded for multiple choice)
                newOptions.forEach((o) => (o.isCorrect = false));
            }
            newOptions[idx] = { ...newOptions[idx], [field]: value };
            return { ...prev, options: newOptions };
        });
    };

    const handleSaveQuestion = async () => {
        if (!newQ.text || newQ.options.every((o) => !o.text)) return;

        const payload = {
            text: newQ.text,
            type: "single_choice",
            points: newQ.points,
            options: newQ.options.filter((o) => o.text.trim() !== "").map((o) => ({
                text: o.text,
                is_correct: o.isCorrect
            }))
        };

        const res = await apiClient.createQuestion(examId, payload);
        if (res.success) {
            setIsAdding(false);
            setNewQ({
                text: "",
                points: 1,
                options: [
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false }
                ]
            });
            loadExam(); // Reload to see new question
        } else {
            alert("Failed to save question: " + res.error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const res = await apiClient.uploadQuestions(examId, file);
        setLoading(false);

        if (res.success && res.data) {
            alert(`Successfully imported ${res.data.imported} questions!`);
            loadExam();
        } else {
            alert("Import failed: " + res.error);
        }

        // Reset input
        e.target.value = "";
    };

    if (loading && !exam) return <div className="text-white text-center py-10">Yuklanmoqda...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" onClick={onBack} className="mb-2 pl-0 text-slate-400 hover:text-white">
                        ← Orqaga
                    </Button>
                    <h2 className="text-2xl font-bold text-white">{exam?.title}</h2>
                    <p className="text-slate-400 text-sm">{questions.length} ta savol</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf,.xlsx,.xls"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                            <Upload className="w-4 h-4 mr-2" />
                            Import PDF/Excel
                        </Button>
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Savol qo'shish
                    </Button>
                </div>
            </div>

            {isAdding && (
                <Card className="bg-white/5 border-orange-500/50 border">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Yangi savol</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Savol matni</label>
                            <textarea
                                value={newQ.text}
                                onChange={(e) => setNewQ({ ...newQ, text: e.target.value })}
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 px-4 py-2 text-white"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm text-slate-300">Variantlar</label>
                            {newQ.options.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="correct_option"
                                        checked={opt.isCorrect}
                                        onChange={(e) => handleOptionChange(idx, "isCorrect", e.target.checked)}
                                        className="w-4 h-4 accent-orange-500"
                                    />
                                    <input
                                        type="text"
                                        value={opt.text}
                                        onChange={(e) => handleOptionChange(idx, "text", e.target.value)}
                                        className="flex-1 rounded-lg bg-slate-900/50 border border-white/10 px-3 py-2 text-white text-sm"
                                        placeholder={`Variant ${idx + 1}`}
                                    />
                                </div>
                            ))}
                            <Button variant="ghost" size="sm" onClick={handleAddOption} className="text-orange-400">
                                + Variant qo'shish
                            </Button>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="ghost" onClick={() => setIsAdding(false)}>Bekor qilish</Button>
                            <Button onClick={handleSaveQuestion} className="bg-green-600 hover:bg-green-700 text-white">
                                <Save className="w-4 h-4 mr-2" />
                                Saqlash
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {questions.map((q, i) => (
                    <Card key={q.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <p className="text-white font-medium mb-2">{q.text}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {q.options?.map((opt) => (
                                                <div key={opt.id} className="text-sm text-slate-400 px-2 py-1 rounded bg-white/5">
                                                    {opt.text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/10">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
