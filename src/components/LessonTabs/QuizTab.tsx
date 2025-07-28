import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  Clock, 
  Target,
  Star,
  Brain
} from 'lucide-react';

// Import quiz data
import quizBankData from '../../data/quizbank.json';

interface QuizTabProps {
  stageId: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  difficulty: string;
}

interface QuizResult {
  questionId: string;
  userAnswer: number;
  correct: boolean;
}

const QuizTab: React.FC<QuizTabProps> = ({ stageId }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    // Load questions for this stage
    const stageQuestions = (quizBankData as any)[stageId] || [];
    
    // Select 5 random questions
    const shuffled = [...stageQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(5, shuffled.length));
    
    setQuestions(selectedQuestions);
  }, [stageId]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer(-1);
    setQuizResults([]);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === -1) return;

    const currentQ = questions[currentQuestion];
    const result: QuizResult = {
      questionId: currentQ.id,
      userAnswer: selectedAnswer,
      correct: selectedAnswer === currentQ.correct
    };

    const newResults = [...quizResults, result];
    setQuizResults(newResults);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(-1);
    } else {
      setShowResults(true);
    }
  };

  const retryQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(-1);
    setQuizResults([]);
    setShowResults(false);
    
    // Shuffle questions again
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
  };

  const getScorePercentage = () => {
    const correctAnswers = quizResults.filter(result => result.correct).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Outstanding! 🌟", color: "text-green-600" };
    if (percentage >= 80) return { message: "Excellent work! 🎯", color: "text-green-600" };
    if (percentage >= 70) return { message: "Good job! 👍", color: "text-blue-600" };
    if (percentage >= 60) return { message: "Not bad, keep learning! 📚", color: "text-yellow-600" };
    return { message: "Keep practicing! 💪", color: "text-orange-600" };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Quiz Available</h3>
        <p className="text-muted-foreground">
          Quiz questions for this stage are being prepared.
        </p>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Knowledge Quiz</h2>
          <p className="text-muted-foreground">
            Test your understanding with these carefully selected questions
          </p>
        </div>

        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Ready for the Challenge?</CardTitle>
                <CardDescription className="text-purple-700">
                  5 questions • Mixed difficulty • Immediate feedback
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold">5 Questions</h4>
                  <p className="text-sm text-muted-foreground">Carefully selected</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold">No Time Limit</h4>
                  <p className="text-sm text-muted-foreground">Take your time</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-semibold">Instant Results</h4>
                  <p className="text-sm text-muted-foreground">Learn immediately</p>
                </div>
              </div>
              
              <Button onClick={startQuiz} className="w-full btn-gradient py-3 text-lg">
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (showResults) {
    const percentage = getScorePercentage();
    const scoreMessage = getScoreMessage(percentage);
    const correctCount = quizResults.filter(r => r.correct).length;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground">
            Here's how you performed
          </p>
        </div>

        {/* Score Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {percentage}%
              </div>
              <p className={`text-xl font-semibold ${scoreMessage.color}`}>
                {scoreMessage.message}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{questions.length - correctCount}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
            
            <Progress value={percentage} className="h-3 mb-4" />
            
            <div className="flex gap-2 justify-center">
              <Button onClick={retryQuiz} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Retry Quiz
              </Button>
              <Button onClick={() => setQuizStarted(false)} className="btn-gradient">
                Take New Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
            <CardDescription>
              Review your answers and learn from any mistakes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => {
              const result = quizResults[index];
              const isCorrect = result.correct;
              
              return (
                <div 
                  key={question.id}
                  className={`p-4 rounded-lg border ${
                    isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <Badge 
                          variant="outline" 
                          className={getDifficultyColor(question.difficulty)}
                        >
                          {question.difficulty}
                        </Badge>
                      </div>
                      <p className="mb-3">{question.question}</p>
                      
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isUserAnswer = result.userAnswer === optionIndex;
                          const isCorrectAnswer = question.correct === optionIndex;
                          
                          let className = "p-2 rounded border text-sm ";
                          if (isCorrectAnswer) {
                            className += "bg-green-100 border-green-300 text-green-700";
                          } else if (isUserAnswer && !isCorrect) {
                            className += "bg-red-100 border-red-300 text-red-700";
                          } else {
                            className += "bg-gray-50 border-gray-200";
                          }
                          
                          return (
                            <div key={optionIndex} className={className}>
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && <CheckCircle2 className="w-4 h-4" />}
                                {isUserAnswer && !isCorrect && <XCircle className="w-4 h-4" />}
                                <span>{option}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Quiz in progress
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Progress Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">
              Question {currentQuestion + 1} of {questions.length}
            </h3>
            <Badge 
              variant="outline" 
              className={getDifficultyColor(currentQ.difficulty)}
            >
              {currentQ.difficulty}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedAnswer.toString()} 
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            className="space-y-3"
          >
            {currentQ.options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                onClick={() => handleAnswerSelect(index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
          
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-muted-foreground">
              Select an answer to continue
            </div>
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === -1}
              className="btn-gradient"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuizTab;