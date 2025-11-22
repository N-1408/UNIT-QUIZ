import { useState } from "react";
import { Sparkles, Volume2, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DailyWord = {
    word: string;
    pronunciation: string;
    type: string;
    definition: string;
    example: string;
};

const MOCK_WORD: DailyWord = {
    word: "Serendipity",
    pronunciation: "/ˌser.ənˈdɪp.ə.t̬i/",
    type: "noun",
    definition: "The occurrence and development of events by chance in a happy or beneficial way.",
    example: "Finding his lost key while looking for his phone was a pure moment of serendipity."
};

export const WordSpark = () => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="relative group perspective-1000 w-full h-48 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={cn(
                "relative w-full h-full transition-all duration-500 preserve-3d",
                isFlipped ? "rotate-y-180" : ""
            )}>
                {/* Front Side */}
                <Card className="absolute inset-0 backface-hidden bg-gradient-to-br from-orange-500 to-red-600 border-none text-white flex flex-col items-center justify-center p-6 shadow-xl shadow-orange-500/20">
                    <div className="absolute top-3 right-3">
                        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                    </div>
                    <div className="text-xs font-bold tracking-widest uppercase text-orange-100 mb-2">
                        Word of the Day
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{MOCK_WORD.word}</h3>
                    <p className="text-orange-100 italic mb-4">{MOCK_WORD.type} • {MOCK_WORD.pronunciation}</p>
                    <div className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        Tap to reveal meaning
                    </div>
                </Card>

                {/* Back Side */}
                <Card className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 border border-white/10 flex flex-col p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-orange-500">{MOCK_WORD.word}</h3>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={(e) => {
                            e.stopPropagation();
                            // Play audio logic here
                        }}>
                            <Volume2 className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="flex gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                            <p className="text-sm text-slate-300 leading-snug">
                                {MOCK_WORD.definition}
                            </p>
                        </div>
                        <div className="pl-6 border-l-2 border-white/10 italic text-xs text-slate-400">
                            "{MOCK_WORD.example}"
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
