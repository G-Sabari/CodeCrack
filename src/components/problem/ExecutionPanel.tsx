import { useState } from 'react';
import { Play, Send, Loader2, CheckCircle2, XCircle, Clock, AlertTriangle, Terminal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTime: number;
  error?: string;
  isHidden?: boolean;
}

interface ExecutionResult {
  verdict?: string;
  results: TestResult[];
  totalExecutionTime: number;
  passedCount: number;
  totalCount: number;
}

interface ExecutionPanelProps {
  onRun: () => Promise<ExecutionResult>;
  onSubmit: () => Promise<ExecutionResult>;
  isRunning: boolean;
  isSubmitting: boolean;
  lastResult: ExecutionResult | null;
}

const VERDICT_STYLES: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode; glow: string }> = {
  'Accepted': { 
    bg: 'bg-[hsl(var(--success))]/10', 
    text: 'text-[hsl(var(--success))]', 
    border: 'border-[hsl(var(--success))]/30',
    glow: 'shadow-[0_0_20px_hsl(var(--success)/0.3)]',
    icon: <CheckCircle2 className="h-5 w-5" /> 
  },
  'Wrong Answer': { 
    bg: 'bg-destructive/10', 
    text: 'text-destructive', 
    border: 'border-destructive/30',
    glow: 'shadow-[0_0_20px_hsl(var(--destructive)/0.3)]',
    icon: <XCircle className="h-5 w-5" /> 
  },
  'Time Limit Exceeded': { 
    bg: 'bg-[hsl(var(--warning))]/10', 
    text: 'text-[hsl(var(--warning))]', 
    border: 'border-[hsl(var(--warning))]/30',
    glow: 'shadow-[0_0_20px_hsl(var(--warning)/0.3)]',
    icon: <Clock className="h-5 w-5" /> 
  },
  'Runtime Error': { 
    bg: 'bg-destructive/10', 
    text: 'text-destructive', 
    border: 'border-destructive/30',
    glow: 'shadow-[0_0_20px_hsl(var(--destructive)/0.3)]',
    icon: <AlertTriangle className="h-5 w-5" /> 
  },
};

export function ExecutionPanel({
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
  lastResult,
}: ExecutionPanelProps) {
  const [activeTab, setActiveTab] = useState('testcases');

  const handleRun = async () => {
    setActiveTab('result');
    await onRun();
  };

  const handleSubmit = async () => {
    setActiveTab('result');
    await onSubmit();
  };

  return (
    <div className="flex flex-col h-full border-t border-border/30 bg-gradient-to-b from-card/50 to-background/30">
      {/* Premium Action Buttons */}
      <div className="flex items-center justify-between px-4 py-3 bg-card/50 backdrop-blur-sm border-b border-border/30">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="h-9 px-4 bg-secondary/50 border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 group"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            )}
            Run Code
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="h-9 px-4 bg-gradient-to-r from-primary to-[hsl(200,80%,50%)] hover:from-primary/90 hover:to-[hsl(200,80%,50%)]/90 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all duration-300 group"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
            )}
            Submit
          </Button>
        </div>
        {lastResult && lastResult.verdict && (
          <div className={cn(
            'flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-500 animate-scale-in',
            VERDICT_STYLES[lastResult.verdict]?.bg,
            VERDICT_STYLES[lastResult.verdict]?.text,
            VERDICT_STYLES[lastResult.verdict]?.border,
            VERDICT_STYLES[lastResult.verdict]?.glow
          )}>
            {VERDICT_STYLES[lastResult.verdict]?.icon}
            <span className="font-semibold">{lastResult.verdict}</span>
            {lastResult.verdict === 'Accepted' && <Sparkles className="h-4 w-4 animate-pulse" />}
          </div>
        )}
      </div>

      {/* Results Area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start rounded-none border-b border-border/30 bg-transparent px-4 h-10">
          <TabsTrigger 
            value="testcases" 
            className="data-[state=active]:bg-secondary/50 data-[state=active]:text-foreground transition-all duration-300"
          >
            <Terminal className="h-4 w-4 mr-2" />
            Test Cases
          </TabsTrigger>
          <TabsTrigger 
            value="result" 
            className="data-[state=active]:bg-secondary/50 data-[state=active]:text-foreground transition-all duration-300"
          >
            Result
          </TabsTrigger>
        </TabsList>

        <TabsContent value="testcases" className="flex-1 m-0 min-h-0">
          <ScrollArea className="h-full p-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary/50">
                <Terminal className="h-4 w-4" />
              </div>
              <span>Click "Run Code" to test against sample cases, or "Submit" to run against all hidden test cases.</span>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="result" className="flex-1 m-0 min-h-0">
          <ScrollArea className="h-full">
            {(isRunning || isSubmitting) ? (
              <div className="flex flex-col items-center justify-center h-32 gap-3">
                <div className="relative">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <div className="absolute inset-0 h-10 w-10 animate-ping">
                    <div className="h-full w-full rounded-full bg-primary/20" />
                  </div>
                </div>
                <span className="text-muted-foreground font-medium">
                  {isRunning ? 'Running your code...' : 'Submitting solution...'}
                </span>
              </div>
            ) : lastResult ? (
              <div className="p-4 space-y-4 animate-fade-in">
                {/* Summary with premium styling */}
                <div className="flex items-center gap-6 text-sm p-3 rounded-xl bg-secondary/30 border border-border/30">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                    <span className="text-muted-foreground">Passed:</span>
                    <span className="font-bold text-foreground">{lastResult.passedCount}/{lastResult.totalCount}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-bold text-foreground">{lastResult.totalExecutionTime}ms</span>
                  </span>
                </div>

                {/* Test Case Results with premium cards */}
                <div className="space-y-3">
                  {lastResult.results.map((result, index) => (
                    <div
                      key={index}
                      className={cn(
                        'p-4 rounded-xl border transition-all duration-300 hover:scale-[1.01]',
                        result.passed 
                          ? 'border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5 hover:bg-[hsl(var(--success))]/10' 
                          : 'border-destructive/30 bg-destructive/5 hover:bg-destructive/10'
                      )}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {result.passed ? (
                          <div className="relative">
                            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                          </div>
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <span className="font-semibold text-sm">
                          Test Case {index + 1} {result.isHidden && <span className="text-muted-foreground font-normal">(Hidden)</span>}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto px-2 py-0.5 rounded-full bg-secondary/50">
                          {result.executionTime}ms
                        </span>
                      </div>

                      {result.error ? (
                        <div className="mt-2 p-3 bg-destructive/10 rounded-lg text-sm font-mono text-destructive border border-destructive/20">
                          {result.error}
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm font-mono">
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground min-w-[70px]">Input:</span>
                            <code className="bg-secondary/50 px-2 py-0.5 rounded text-foreground">{result.input}</code>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-muted-foreground min-w-[70px]">Expected:</span>
                            <code className="bg-[hsl(var(--success))]/10 px-2 py-0.5 rounded text-[hsl(var(--success))]">{result.expectedOutput}</code>
                          </div>
                          {!result.passed && (
                            <div className="flex items-start gap-2">
                              <span className="text-muted-foreground min-w-[70px]">Output:</span>
                              <code className="bg-destructive/10 px-2 py-0.5 rounded text-destructive">
                                {result.actualOutput || '(no output)'}
                              </code>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
                <Terminal className="h-8 w-8 opacity-50" />
                <span>No results yet. Run your code to see output.</span>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
