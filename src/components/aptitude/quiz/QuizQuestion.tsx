import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Flag, Building2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PremiumAptitudeQuestion } from "@/data/premiumAptitudeQuestions";

interface QuizQuestionProps {
  question: PremiumAptitudeQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  isFlagged: boolean;
  onAnswer: (answerIndex: number) => void;
  onFlag: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const difficultyColors = {
  Easy: "bg-[hsl(var(--success))]/20 text-[hsl(var(--success))] border-[hsl(var(--success))]/30",
  Medium: "bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30",
  Hard: "bg-destructive/20 text-destructive border-destructive/30",
};

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onAnswer,
  onFlag,
  onPrevious,
  onNext,
  onSubmit,
  isFirst,
  isLast,
}: QuizQuestionProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-secondary/30">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(difficultyColors[question.difficulty])}>
              {question.difficulty}
            </Badge>
            <Badge variant="secondary">{question.topic}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="w-3 h-3" />
              <span>{question.companyType}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFlag}
              className={cn("gap-1", isFlagged && "text-[hsl(var(--warning))]")}
            >
              <Flag className={cn("w-4 h-4", isFlagged && "fill-current")} />
              {isFlagged ? "Flagged" : "Flag"}
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Question */}
        <div className="mb-6">
          <p className="text-lg font-medium leading-relaxed">{question.question}</p>
        </div>

        {/* Options */}
        <RadioGroup
          value={selectedAnswer?.toString() ?? ""}
          onValueChange={(value) => onAnswer(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                "hover:border-primary/50 hover:bg-primary/5",
                selectedAnswer === index
                  ? "border-primary bg-primary/10 shadow-[0_0_10px_hsl(var(--primary)/0.2)]"
                  : "border-border/50 bg-card/30"
              )}
              onClick={() => onAnswer(index)}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="flex-1 cursor-pointer text-sm md:text-base"
              >
                <span className="font-medium text-primary mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Company Tags */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Asked by:</span>
            {question.companies.slice(0, 4).map((company) => (
              <Badge key={company} variant="outline" className="text-xs">
                {company}
              </Badge>
            ))}
            {question.companies.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{question.companies.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-border/50">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirst}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          {isLast ? (
            <Button onClick={onSubmit} className="gap-2 bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90">
              <Check className="w-4 h-4" />
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={onNext} className="gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
