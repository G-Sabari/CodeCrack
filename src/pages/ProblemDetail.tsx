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
  Tag,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
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
    # Write your solution here
    pass`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`,
    javascript: `function twoSum(nums, target) {
    // Write your solution here
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
  Easy: 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20 shadow-[0_0_10px_hsl(var(--success)/0.2)]',
  Medium: 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20 shadow-[0_0_10px_hsl(var(--warning)/0.2)]',
  Hard: 'bg-destructive/10 text-destructive border-destructive/20 shadow-[0_0_10px_hsl(var(--destructive)/0.2)]',
};

const FREQUENCY_LABELS = {
  high: { label: '🔴 Frequently Asked', color: 'text-destructive' },
  medium: { label: '🟡 Occasionally Asked', color: 'text-[hsl(var(--warning))]' },
  low: { label: '🟢 Rarely Asked', color: 'text-[hsl(var(--success))]' },
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
  const [isMentorExpanded, setIsMentorExpanded] = useState(true);

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
      'h-screen flex flex-col bg-background relative overflow-hidden',
      isFullscreen && 'fixed inset-0 z-50'
    )}>
      {/* Subtle background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[hsl(280,65%,60%)]/3 rounded-full blur-[100px]" />
      </div>

      {/* Premium Header */}
      <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-card/80 backdrop-blur-xl flex-shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/problems">
            <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Problems
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6 bg-border/50" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-[hsl(280,65%,60%)]/20 border border-primary/20">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <h1 className="font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                {SAMPLE_PROBLEM.title}
              </h1>
            </div>
            <Badge variant="outline" className={cn("transition-all duration-300", DIFFICULTY_STYLES[SAMPLE_PROBLEM.difficulty])}>
              {SAMPLE_PROBLEM.difficulty}
            </Badge>
            <span className={cn('text-sm font-medium', FREQUENCY_LABELS[SAMPLE_PROBLEM.frequency].color)}>
              {FREQUENCY_LABELS[SAMPLE_PROBLEM.frequency].label}
            </span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleFullscreen}
          className="hover:bg-primary/10 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </header>

      {/* Main Content - Horizontal Split */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        {/* Left Panel - Problem Description */}
        <ResizablePanel defaultSize={40} minSize={25} maxSize={60}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-card/50 backdrop-blur-sm px-4 h-12 flex-shrink-0">
              <TabsTrigger 
                value="description" 
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all duration-300"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="approach" 
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all duration-300"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Approach
              </TabsTrigger>
              <TabsTrigger 
                value="mistakes" 
                className="data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive data-[state=active]:shadow-none transition-all duration-300"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Mistakes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="flex-1 m-0 min-h-0 bg-gradient-to-b from-card/30 to-background/50">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6 animate-fade-in">
                  {/* Tags & Companies - Premium Badges */}
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_PROBLEM.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="gap-1.5 bg-secondary/50 hover:bg-secondary/80 transition-colors border border-border/30"
                      >
                        <Tag className="h-3 w-3 text-primary" />
                        {tag}
                      </Badge>
                    ))}
                    {SAMPLE_PROBLEM.companies.slice(0, 3).map((company) => (
                      <Badge 
                        key={company} 
                        variant="outline" 
                        className="gap-1.5 hover:border-primary/50 transition-colors"
                      >
                        <Building2 className="h-3 w-3" />
                        {company}
                      </Badge>
                    ))}
                    {SAMPLE_PROBLEM.companies.length > 3 && (
                      <Badge variant="outline" className="text-muted-foreground">
                        +{SAMPLE_PROBLEM.companies.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Description with premium styling */}
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed">{SAMPLE_PROBLEM.description}</p>
                  </div>

                  {/* Examples with glassmorphism */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Examples
                    </h3>
                    {SAMPLE_PROBLEM.examples.map((example, index) => (
                      <div 
                        key={index} 
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-[hsl(280,65%,60%)]/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-secondary/30 backdrop-blur-sm rounded-xl p-4 space-y-2 border border-border/30 hover:border-primary/20 transition-colors">
                          <div className="font-medium text-sm text-primary">Example {index + 1}</div>
                          <div className="space-y-2 text-sm font-mono">
                            <div className="flex gap-2">
                              <span className="text-muted-foreground min-w-[60px]">Input:</span>
                              <code className="text-foreground">{example.input}</code>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-muted-foreground min-w-[60px]">Output:</span>
                              <code className="text-[hsl(var(--success))]">{example.output}</code>
                            </div>
                            {example.explanation && (
                              <div className="text-muted-foreground pt-1 text-xs italic border-t border-border/30 mt-2">
                                {example.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Constraints</h3>
                    <ul className="space-y-1.5">
                      {SAMPLE_PROBLEM.constraints.map((constraint, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <code className="font-mono text-muted-foreground">{constraint}</code>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Complexity with glow */}
                  <div className="flex gap-4 text-sm p-4 rounded-xl bg-gradient-to-r from-primary/5 to-[hsl(200,80%,60%)]/5 border border-primary/10">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Time:</span>
                      <code className="bg-secondary/50 px-2 py-0.5 rounded font-semibold text-primary">{SAMPLE_PROBLEM.complexity.time}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Space:</span>
                      <code className="bg-secondary/50 px-2 py-0.5 rounded font-semibold text-[hsl(280,65%,60%)]">{SAMPLE_PROBLEM.complexity.space}</code>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="approach" className="flex-1 m-0 min-h-0 bg-gradient-to-b from-card/30 to-background/50">
              <ScrollArea className="h-full">
                <div className="p-6 prose prose-sm dark:prose-invert max-w-none animate-fade-in">
                  <div className="whitespace-pre-wrap">{SAMPLE_PROBLEM.approach}</div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="mistakes" className="flex-1 m-0 min-h-0 bg-gradient-to-b from-card/30 to-background/50">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4 animate-fade-in">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Common Mistakes to Avoid
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl hover:bg-destructive/10 transition-colors">
                      <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                        <span className="text-lg">❌</span> Using the same element twice
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Make sure to check that the complement's index is different from the current index.
                      </p>
                    </div>
                    <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl hover:bg-destructive/10 transition-colors">
                      <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                        <span className="text-lg">❌</span> Brute force O(n²) approach
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        While it works, interviewers expect the O(n) hash map solution for this classic problem.
                      </p>
                    </div>
                    <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl hover:bg-destructive/10 transition-colors">
                      <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                        <span className="text-lg">❌</span> Not handling negative numbers
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        The array can contain negative numbers. Your solution should handle them correctly.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border/30 hover:bg-primary/20 transition-colors" />

        {/* Right Panel - Code Editor & Execution & AI Mentor */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <ResizablePanelGroup direction="vertical" className="h-full">
            {/* Code Editor - Always Visible */}
            <ResizablePanel defaultSize={60} minSize={30}>
              <CodeEditor
                language={language}
                onLanguageChange={handleLanguageChange}
                code={code}
                onCodeChange={setCode}
                problemId={id || 'unknown'}
              />
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-border/30 hover:bg-primary/20 transition-colors" />

            {/* Execution Panel */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
              <ExecutionPanel
                onRun={() => executeCode('run')}
                onSubmit={() => executeCode('submit')}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                lastResult={lastResult}
              />
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-border/30 hover:bg-primary/20 transition-colors" />

            {/* AI Mentor - Collapsible */}
            <ResizablePanel 
              defaultSize={20} 
              minSize={8} 
              maxSize={50}
              collapsible={true}
              collapsedSize={8}
            >
              <div className="h-full flex flex-col bg-gradient-to-b from-card/50 to-background/30">
                {/* Premium Mentor Toggle Header */}
                <button
                  onClick={() => setIsMentorExpanded(!isMentorExpanded)}
                  className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-primary/5 via-card/80 to-[hsl(280,65%,60%)]/5 border-b border-border/30 hover:from-primary/10 hover:to-[hsl(280,65%,60%)]/10 transition-all duration-300"
                >
                  <span className="font-medium text-sm flex items-center gap-2">
                    <div className="p-1 rounded-md bg-gradient-to-br from-primary/20 to-[hsl(280,65%,60%)]/20">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                    <span className="bg-gradient-to-r from-primary to-[hsl(280,65%,60%)] bg-clip-text text-transparent font-semibold">
                      CodeCrack AI Mentor
                    </span>
                  </span>
                  {isMentorExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {/* Mentor Content */}
                <div className={cn(
                  "flex-1 min-h-0 overflow-hidden",
                  !isMentorExpanded && "hidden"
                )}>
                  <AIMentor
                    problemTitle={SAMPLE_PROBLEM.title}
                    problemDescription={SAMPLE_PROBLEM.description}
                    userCode={code}
                    language={language}
                    executionResult={lastResult}
                  />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
