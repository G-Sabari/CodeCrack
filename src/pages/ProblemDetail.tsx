import { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Maximize2, 
  Minimize2,
  BookOpen,
  AlertCircle,
  Lightbulb,
  Clock,
  Building2,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CodeEditor } from '@/components/problem/CodeEditor';
import { ExecutionPanel } from '@/components/problem/ExecutionPanel';
import { AIMentor } from '@/components/problem/AIMentor';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Sample problem data - in production this would come from the database
const SAMPLE_PROBLEM = {
  id: 'two-sum',
  title: 'Two Sum',
  difficulty: 'Easy' as const,
  frequency: 'high' as const,
  companies: ['Amazon', 'Google', 'Microsoft', 'Zoho'],
  tags: ['Array', 'Hash Table'],
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]',
      explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
    },
    {
      input: 'nums = [3,3], target = 6',
      output: '[0,1]',
      explanation: '',
    },
  ],
  constraints: [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists.',
  ],
  approach: `## Optimal Approach: Hash Map

The key insight is that for each number \`x\`, we need to find if \`target - x\` exists in the array.

### Steps:
1. Create a hash map to store each number and its index
2. For each number, check if \`target - num\` exists in the map
3. If found, return the indices
4. If not, add the current number to the map

### Why this works:
- We iterate through the array once
- For each element, the lookup in hash map is O(1)
- This gives us O(n) time complexity

### Common Mistakes:
- Using the same element twice (index check is important)
- Forgetting to handle negative numbers
- Using brute force O(n²) approach in interviews`,
  complexity: {
    time: 'O(n)',
    space: 'O(n)',
  },
  starterCode: {
    python: `def twoSum(nums, target):
    # Write your code here
    pass`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};`,
    javascript: `function twoSum(nums, target) {
    // Write your code here
    return [];
}`,
  },
  testCases: [
    { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]', isHidden: false },
    { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]', isHidden: false },
    { input: 'nums = [3,3], target = 6', expectedOutput: '[0,1]', isHidden: false },
    { input: 'nums = [1,2,3,4,5], target = 9', expectedOutput: '[3,4]', isHidden: true },
    { input: 'nums = [-1,-2,-3,-4,-5], target = -8', expectedOutput: '[2,4]', isHidden: true },
    { input: 'nums = [0,4,3,0], target = 0', expectedOutput: '[0,3]', isHidden: true },
  ],
};

const DIFFICULTY_STYLES = {
  Easy: 'bg-success/10 text-success border-success/20',
  Medium: 'bg-warning/10 text-warning border-warning/20',
  Hard: 'bg-destructive/10 text-destructive border-destructive/20',
};

const FREQUENCY_LABELS = {
  high: { label: '🔴 Frequently Asked', color: 'text-destructive' },
  medium: { label: '🟡 Occasionally Asked', color: 'text-warning' },
  low: { label: '🟢 Rarely Asked', color: 'text-success' },
};

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(SAMPLE_PROBLEM.starterCode.python);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('description');

  // Load starter code when language changes
  const handleLanguageChange = useCallback((newLang: string) => {
    setLanguage(newLang);
    const savedCode = localStorage.getItem(`codecrack_code_${id}_${newLang}`);
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(SAMPLE_PROBLEM.starterCode[newLang as keyof typeof SAMPLE_PROBLEM.starterCode] || '');
    }
  }, [id]);

  // Execute code
  const executeCode = async (mode: 'run' | 'submit') => {
    if (mode === 'run') {
      setIsRunning(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            code,
            language,
            mode,
            testCases: SAMPLE_PROBLEM.testCases,
            problemId: id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Execution failed');
      }

      const result = await response.json();
      setLastResult(result);

      if (mode === 'submit') {
        if (result.verdict === 'Accepted') {
          toast.success('All test cases passed!');
        } else {
          toast.error(`${result.verdict}`);
        }
      }

      return result;
    } catch (error) {
      console.error('Execution error:', error);
      toast.error('Failed to execute code');
      return null;
    } finally {
      setIsRunning(false);
      setIsSubmitting(false);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeCode('run');
        } else if (e.shiftKey && e.key === 'Enter') {
          e.preventDefault();
          executeCode('submit');
        } else if (e.key === 'Escape') {
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language]);

  return (
    <div className={cn(
      'h-screen flex flex-col bg-background',
      isFullscreen && 'fixed inset-0 z-50'
    )}>
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/problems">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Problems
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-3">
            <h1 className="font-semibold">{SAMPLE_PROBLEM.title}</h1>
            <Badge variant="outline" className={DIFFICULTY_STYLES[SAMPLE_PROBLEM.difficulty]}>
              {SAMPLE_PROBLEM.difficulty}
            </Badge>
            <span className={cn('text-sm', FREQUENCY_LABELS[SAMPLE_PROBLEM.frequency].color)}>
              {FREQUENCY_LABELS[SAMPLE_PROBLEM.frequency].label}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Problem Description */}
        <div className="w-[45%] border-r border-border flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-4 h-11 flex-shrink-0">
              <TabsTrigger value="description" className="data-[state=active]:bg-secondary">
                <BookOpen className="h-4 w-4 mr-2" />
                Description
              </TabsTrigger>
              <TabsTrigger value="approach" className="data-[state=active]:bg-secondary">
                <Lightbulb className="h-4 w-4 mr-2" />
                Approach
              </TabsTrigger>
              <TabsTrigger value="mistakes" className="data-[state=active]:bg-secondary">
                <AlertCircle className="h-4 w-4 mr-2" />
                Common Mistakes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 m-0 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  {/* Tags & Companies */}
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_PROBLEM.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                    {SAMPLE_PROBLEM.companies.slice(0, 3).map((company) => (
                      <Badge key={company} variant="outline" className="gap-1">
                        <Building2 className="h-3 w-3" />
                        {company}
                      </Badge>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{SAMPLE_PROBLEM.description}</p>
                  </div>

                  {/* Examples */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Examples</h3>
                    {SAMPLE_PROBLEM.examples.map((example, index) => (
                      <div key={index} className="bg-secondary/50 rounded-lg p-4 space-y-2">
                        <div className="font-medium text-sm">Example {index + 1}:</div>
                        <div className="space-y-1 text-sm font-mono">
                          <div><span className="text-muted-foreground">Input:</span> {example.input}</div>
                          <div><span className="text-muted-foreground">Output:</span> {example.output}</div>
                          {example.explanation && (
                            <div className="text-muted-foreground">{example.explanation}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Constraints</h3>
                    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                      {SAMPLE_PROBLEM.constraints.map((constraint, index) => (
                        <li key={index} className="font-mono">{constraint}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Complexity */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Time:</span>
                      <code className="bg-secondary px-2 py-0.5 rounded">{SAMPLE_PROBLEM.complexity.time}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Space:</span>
                      <code className="bg-secondary px-2 py-0.5 rounded">{SAMPLE_PROBLEM.complexity.space}</code>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="approach" className="flex-1 m-0 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{SAMPLE_PROBLEM.approach}</div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="mistakes" className="flex-1 m-0 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Common Mistakes to Avoid</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <h4 className="font-medium text-destructive mb-2">❌ Using the same element twice</h4>
                      <p className="text-sm text-muted-foreground">
                        Make sure to check that the complement's index is different from the current index.
                      </p>
                    </div>
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <h4 className="font-medium text-destructive mb-2">❌ Brute force O(n²) approach</h4>
                      <p className="text-sm text-muted-foreground">
                        While it works, interviewers expect the O(n) hash map solution for this classic problem.
                      </p>
                    </div>
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <h4 className="font-medium text-destructive mb-2">❌ Not handling negative numbers</h4>
                      <p className="text-sm text-muted-foreground">
                        The array can contain negative numbers. Your solution should handle them correctly.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Code Editor & AI Mentor */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Code Editor - Top */}
          <div className="flex-1 flex flex-col min-h-0">
            <CodeEditor
              language={language}
              onLanguageChange={handleLanguageChange}
              code={code}
              onCodeChange={setCode}
              problemId={id || 'unknown'}
            />
          </div>

          {/* Execution Panel */}
          <div className="h-[200px] flex-shrink-0">
            <ExecutionPanel
              onRun={() => executeCode('run')}
              onSubmit={() => executeCode('submit')}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              lastResult={lastResult}
            />
          </div>

          {/* AI Mentor - Bottom Right (collapsible) */}
          <div className="h-[300px] border-t border-border flex-shrink-0">
            <AIMentor
              problemTitle={SAMPLE_PROBLEM.title}
              problemDescription={SAMPLE_PROBLEM.description}
              userCode={code}
              language={language}
              executionResult={lastResult ? {
                verdict: lastResult.verdict,
                error: lastResult.results?.[0]?.error,
                actualOutput: lastResult.results?.[0]?.actualOutput,
                expectedOutput: lastResult.results?.[0]?.expectedOutput,
              } : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
