import { useState } from 'react';
import { Play, Send, Loader2, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
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

const VERDICT_STYLES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  'Accepted': { 
    bg: 'bg-success/10', 
    text: 'text-success', 
    icon: <CheckCircle2 className="h-5 w-5" /> 
  },
  'Wrong Answer': { 
    bg: 'bg-destructive/10', 
    text: 'text-destructive', 
    icon: <XCircle className="h-5 w-5" /> 
  },
  'Time Limit Exceeded': { 
    bg: 'bg-warning/10', 
    text: 'text-warning', 
    icon: <Clock className="h-5 w-5" /> 
  },
  'Runtime Error': { 
    bg: 'bg-destructive/10', 
    text: 'text-destructive', 
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
    <div className="flex flex-col h-full border-t border-border">
      {/* Action Buttons */}
      <div className="flex items-center justify-between p-3 bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Run Code
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Submit
          </Button>
        </div>
        {lastResult && lastResult.verdict && (
          <div className={cn(
            'flex items-center gap-2 px-3 py-1 rounded-md',
            VERDICT_STYLES[lastResult.verdict]?.bg,
            VERDICT_STYLES[lastResult.verdict]?.text
          )}>
            {VERDICT_STYLES[lastResult.verdict]?.icon}
            <span className="font-medium">{lastResult.verdict}</span>
          </div>
        )}
      </div>

      {/* Results Area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-3">
          <TabsTrigger value="testcases" className="data-[state=active]:bg-secondary">
            Test Cases
          </TabsTrigger>
          <TabsTrigger value="result" className="data-[state=active]:bg-secondary">
            Result
          </TabsTrigger>
        </TabsList>

        <TabsContent value="testcases" className="flex-1 m-0 min-h-0">
          <ScrollArea className="h-full p-4">
            <div className="text-sm text-muted-foreground">
              Click "Run Code" to test against sample cases, or "Submit" to run against all hidden test cases.
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="result" className="flex-1 m-0 min-h-0">
          <ScrollArea className="h-full">
            {(isRunning || isSubmitting) ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">
                  {isRunning ? 'Running...' : 'Submitting...'}
                </span>
              </div>
            ) : lastResult ? (
              <div className="p-4 space-y-4">
                {/* Summary */}
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Passed: <span className="font-medium text-foreground">{lastResult.passedCount}/{lastResult.totalCount}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Time: <span className="font-medium text-foreground">{lastResult.totalExecutionTime}ms</span>
                  </span>
                </div>

                {/* Test Case Results */}
                <div className="space-y-3">
                  {lastResult.results.map((result, index) => (
                    <div
                      key={index}
                      className={cn(
                        'p-3 rounded-lg border',
                        result.passed ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {result.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="font-medium text-sm">
                          Test Case {index + 1} {result.isHidden && '(Hidden)'}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {result.executionTime}ms
                        </span>
                      </div>

                      {result.error ? (
                        <div className="mt-2 p-2 bg-destructive/10 rounded text-sm font-mono text-destructive">
                          {result.error}
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Input: </span>
                            <code className="bg-secondary px-1 rounded">{result.input}</code>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected: </span>
                            <code className="bg-secondary px-1 rounded">{result.expectedOutput}</code>
                          </div>
                          {!result.passed && (
                            <div>
                              <span className="text-muted-foreground">Output: </span>
                              <code className="bg-destructive/20 px-1 rounded text-destructive">
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
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No results yet. Run your code to see output.
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
