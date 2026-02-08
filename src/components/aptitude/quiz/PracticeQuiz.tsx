import { useState, useEffect, useCallback } from "react";
import { QuizTimer } from "./QuizTimer";
import { QuizProgress } from "./QuizProgress";
import { QuestionNavigation } from "./QuestionNavigation";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResultDashboard } from "./QuizResultDashboard";
import { CompanyFilter } from "./CompanyFilter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Play, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PremiumAptitudeQuestion } from "@/data/premiumAptitudeQuestions";

interface PracticeQuizProps {
  questions: PremiumAptitudeQuestion[];
  categoryName: string;
  topicName?: string;
  onBack: () => void;
}

type QuizState = "setup" | "quiz" | "result";

export function PracticeQuiz({
  questions,
  categoryName,
  topicName,
  onBack,
}: PracticeQuizProps) {
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const [filteredQuestions, setFilteredQuestions] = useState<PremiumAptitudeQuestion[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showCompanyFilter, setShowCompanyFilter] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Quiz duration: 30 minutes = 1800 seconds
  const QUIZ_DURATION = 30 * 60;

  // Filter questions based on selected companies
  useEffect(() => {
    if (selectedCompanies.length === 0) {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter((q) =>
        q.companies.some((c) => selectedCompanies.includes(c))
      );
      setFilteredQuestions(filtered.length > 0 ? filtered : questions);
    }
  }, [questions, selectedCompanies]);

  // Timer tracking
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimeTaken((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startQuiz = () => {
    // Take up to 15 questions
    const quizQuestions = filteredQuestions.slice(0, 15);
    setFilteredQuestions(quizQuestions);
    setUserAnswers(new Array(quizQuestions.length).fill(null));
    setFlaggedQuestions([]);
    setCurrentQuestionIndex(0);
    setTimeTaken(0);
    setIsTimerRunning(true);
    setQuizState("quiz");
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleFlag = () => {
    if (flaggedQuestions.includes(currentQuestionIndex)) {
      setFlaggedQuestions(flaggedQuestions.filter((q) => q !== currentQuestionIndex));
    } else {
      setFlaggedQuestions([...flaggedQuestions, currentQuestionIndex]);
    }
  };

  const handleNavigate = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleTimeUp = useCallback(() => {
    setIsTimerRunning(false);
    setQuizState("result");
  }, []);

  const handleSubmit = () => {
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    setIsTimerRunning(false);
    setShowSubmitDialog(false);
    setQuizState("result");
  };

  const handleRetry = () => {
    setQuizState("setup");
  };

  const handleCompanyToggle = (company: string) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const answeredQuestions = userAnswers
    .map((a, i) => (a !== null ? i : -1))
    .filter((i) => i !== -1);

  if (quizState === "result") {
    return (
      <QuizResultDashboard
        questions={filteredQuestions}
        userAnswers={userAnswers}
        timeTaken={timeTaken}
        onRetry={handleRetry}
        onHome={onBack}
      />
    );
  }

  if (quizState === "setup") {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Practice Quiz</h2>
          <p className="text-muted-foreground">
            {topicName ? `${topicName} - ` : ""}{categoryName}
          </p>
        </div>

        {/* Quiz Info */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-card/50 border border-border/50 text-center">
            <p className="text-3xl font-bold text-primary">15</p>
            <p className="text-sm text-muted-foreground">Questions</p>
          </div>
          <div className="p-4 rounded-xl bg-card/50 border border-border/50 text-center">
            <p className="text-3xl font-bold text-[hsl(var(--warning))]">30</p>
            <p className="text-sm text-muted-foreground">Minutes</p>
          </div>
          <div className="p-4 rounded-xl bg-card/50 border border-border/50 text-center">
            <p className="text-3xl font-bold text-[hsl(var(--success))]">
              {filteredQuestions.length}
            </p>
            <p className="text-sm text-muted-foreground">Available</p>
          </div>
        </div>

        {/* Company Filter Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <span className="font-medium">Company-Based Practice Mode</span>
          </div>
          <Button
            variant={showCompanyFilter ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCompanyFilter(!showCompanyFilter)}
          >
            {showCompanyFilter ? "Hide Filter" : "Enable"}
          </Button>
        </div>

        {/* Company Filter */}
        {showCompanyFilter && (
          <CompanyFilter
            selectedCompanies={selectedCompanies}
            onCompanyToggle={handleCompanyToggle}
            onClearAll={() => setSelectedCompanies([])}
          />
        )}

        {/* Selected Companies Display */}
        {selectedCompanies.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Practicing for:</span>
            {selectedCompanies.map((company) => (
              <Badge key={company} variant="secondary">
                {company}
              </Badge>
            ))}
          </div>
        )}

        {/* Start Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={startQuiz} size="lg" className="gap-2">
            <Play className="w-5 h-5" />
            Start Quiz
          </Button>
          <Button variant="outline" size="lg" onClick={onBack}>
            Back to Topics
          </Button>
        </div>
      </div>
    );
  }

  // Quiz State
  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm sticky top-20 z-30">
        <QuizProgress
          current={currentQuestionIndex}
          total={filteredQuestions.length}
          answered={answeredQuestions}
        />
        <QuizTimer
          duration={QUIZ_DURATION}
          onTimeUp={handleTimeUp}
          isRunning={isTimerRunning}
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Main Question Area */}
        <QuizQuestion
          question={filteredQuestions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={filteredQuestions.length}
          selectedAnswer={userAnswers[currentQuestionIndex]}
          isFlagged={flaggedQuestions.includes(currentQuestionIndex)}
          onAnswer={handleAnswer}
          onFlag={handleFlag}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isFirst={currentQuestionIndex === 0}
          isLast={currentQuestionIndex === filteredQuestions.length - 1}
        />

        {/* Side Panel */}
        <div className="hidden lg:block">
          <QuestionNavigation
            totalQuestions={filteredQuestions.length}
            currentQuestion={currentQuestionIndex}
            answeredQuestions={answeredQuestions}
            flaggedQuestions={flaggedQuestions}
            onNavigate={handleNavigate}
          />
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to submit your quiz?</p>
              <div className="flex gap-4 mt-2">
                <Badge variant="secondary">
                  Answered: {answeredQuestions.length}/{filteredQuestions.length}
                </Badge>
                <Badge variant="outline">
                  Flagged: {flaggedQuestions.length}
                </Badge>
              </div>
              {answeredQuestions.length < filteredQuestions.length && (
                <p className="text-[hsl(var(--warning))] text-sm mt-2">
                  ⚠️ You have {filteredQuestions.length - answeredQuestions.length} unanswered
                  questions!
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
