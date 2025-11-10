type Question = {
  id: string;
  correctAnswer: number;
};

type Answer = {
  questionId: string;
  selectedAnswer: number;
};

export const calculateScore = (questions: Question[], answers: Answer[]) => {
  if (!questions.length) {
    return {
      score: 0,
      correctCount: 0,
      total: 0,
      breakdown: []
    };
  }

  let correctCount = 0;

  const breakdown = questions.map((question, index) => {
    const answer = answers[index];
    const isSkipped = !answer;
    const isCorrect = Boolean(answer && answer.selectedAnswer === question.correctAnswer);

    if (isCorrect) {
      correctCount += 1;
    }

    return {
      questionId: question.id,
      isCorrect,
      isSkipped,
      userAnswer: answer?.selectedAnswer,
      correctAnswer: question.correctAnswer
    };
  });

  return {
    score: Math.round((correctCount / questions.length) * 100),
    correctCount,
    total: questions.length,
    breakdown
  };
};
