import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/apiClient";
import { Loader2 } from "lucide-react";

type CreateExamFormProps = {
    onSuccess: () => void;
    onCancel: () => void;
};

export const CreateExamForm = ({ onSuccess, onCancel }: CreateExamFormProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        durationMin: 30,
        startTime: "",
        endTime: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await apiClient.createExam({
                title: formData.title,
                description: formData.description,
                durationMin: Number(formData.durationMin),
                startTime: formData.startTime ? new Date(formData.startTime).toISOString() : "",
                endTime: formData.endTime ? new Date(formData.endTime).toISOString() : ""
            });

            if (res.success) {
                onSuccess();
            } else {
                setError(res.error || "Failed to create exam");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-md max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl text-white">Yangi Imtihon Yaratish</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Nomi</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-900/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Masalan: Unit 1 Final Test"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Tavsif</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-900/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
                            placeholder="Imtihon haqida qisqacha..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Davomiyligi (daqiqa)</label>
                            <input
                                type="number"
                                name="durationMin"
                                required
                                min="1"
                                value={formData.durationMin}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Boshlanish vaqti</label>
                            <input
                                type="datetime-local"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Tugash vaqti</label>
                            <input
                                type="datetime-local"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full rounded-lg bg-slate-900/50 border border-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-400 text-sm">{error}</div>}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
                            Bekor qilish
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Yaratish
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
