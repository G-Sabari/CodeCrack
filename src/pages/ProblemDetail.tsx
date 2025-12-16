import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Play,
  Send,
  Building2,
  Clock,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  Code2,
  BookOpen,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample problem data
const problemData = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy",
  company: "Amazon",
  year: "2023",
  round: "Technical Round",
  frequency: "high",
  pattern: "Hashing",
  topic: "Arrays",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists.",
  ],
  approach: `### Thought Process

1. **Brute Force (Not recommended for interviews)**
   - Check every pair of numbers → O(n²) time
   
2. **Optimal: Hash Map Approach**
   - For each number, check if (target - num) exists in the map
   - If yes, return both indices
   - If no, add current number and index to map
   
### Step-by-Step Solution

1. Create an empty hash map to store numbers and their indices
2. Iterate through the array
3. For each number, calculate complement = target - current_number
4. Check if complement exists in hash map
5. If found, return [map[complement], current_index]
6. Otherwise, add current number to map with its index
7. Continue until solution is found`,
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  commonMistakes: [
    "Using the same element twice (e.g., if target is 6 and nums has only one 3)",
    "Returning values instead of indices",
    "Not handling negative numbers in the array",
    "Starting nested loop from 0 instead of i+1 in brute force approach",
  ],
  starterCode: {
    python: `def twoSum(nums: list[int], target: int) -> list[int]:
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
  },
};

const difficultyColors = {
  Easy: "text-[hsl(var(--success))] bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/30",
  Medium: "text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/10 border-[hsl(var(--warning))]/30",
  Hard: "text-destructive bg-destructive/10 border-destructive/30",
};

export default function ProblemDetail() {
  const { id } = useParams();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(problemData.starterCode.python);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content: "Hi! I'm your CodeCrack Mentor. Ask me anything about this problem - I can give hints, explain concepts, or help you debug your approach. What would you like help with?",
    },
  ]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(problemData.starterCode[newLang as keyof typeof problemData.starterCode]);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setChatHistory([
      ...chatHistory,
      { role: "user", content: chatMessage },
      {
        role: "assistant",
        content: "Great question! For this problem, think about what data structure would allow you to quickly check if a number exists. What's the time complexity of checking if an element exists in a hash map?",
      },
    ]);
    setChatMessage("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 pt-16">
        {/* Problem Header */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 mb-3">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/problems">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-2xl font-bold">{problemData.title}</h1>
              <Badge
                variant="outline"
                className={cn("font-medium", difficultyColors[problemData.difficulty as keyof typeof difficultyColors])}
              >
                {problemData.difficulty}
              </Badge>
              <Badge variant="secondary">{problemData.pattern}</Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {problemData.company} - {problemData.round} ({problemData.year})
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left Panel - Problem Description */}
          <div className="w-full lg:w-1/2 border-r border-border overflow-auto">
            <Tabs defaultValue="description" className="h-full">
              <div className="border-b border-border bg-card/50 px-4">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="description" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Problem
                  </TabsTrigger>
                  <TabsTrigger value="approach" className="gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Approach
                  </TabsTrigger>
                  <TabsTrigger value="mistakes" className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Mistakes
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="description" className="m-0 space-y-6">
                  {/* Problem Statement */}
                  <div>
                    <h3 className="font-semibold mb-3">Problem Statement</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {problemData.description}
                    </p>
                  </div>

                  {/* Examples */}
                  <div>
                    <h3 className="font-semibold mb-3">Examples</h3>
                    <div className="space-y-4">
                      {problemData.examples.map((example, idx) => (
                        <div key={idx} className="rounded-lg border border-border bg-secondary/30 p-4">
                          <div className="mb-2">
                            <span className="text-sm font-medium">Input:</span>
                            <code className="ml-2 text-sm text-primary">{example.input}</code>
                          </div>
                          <div className="mb-2">
                            <span className="text-sm font-medium">Output:</span>
                            <code className="ml-2 text-sm text-primary">{example.output}</code>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Explanation:</span> {example.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Constraints */}
                  <div>
                    <h3 className="font-semibold mb-3">Constraints</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {problemData.constraints.map((constraint, idx) => (
                        <li key={idx}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="approach" className="m-0 space-y-6">
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-line text-muted-foreground">
                      {problemData.approach}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border bg-secondary/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Time Complexity</span>
                      </div>
                      <code className="text-lg text-primary">{problemData.timeComplexity}</code>
                    </div>
                    <div className="rounded-lg border border-border bg-secondary/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Code2 className="h-4 w-4 text-primary" />
                        <span className="font-medium">Space Complexity</span>
                      </div>
                      <code className="text-lg text-primary">{problemData.spaceComplexity}</code>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mistakes" className="m-0">
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-[hsl(var(--warning))]" />
                      Common Mistakes to Avoid
                    </h3>
                    <ul className="space-y-3">
                      {problemData.commonMistakes.map((mistake, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                          <span className="text-destructive font-bold">✗</span>
                          <span className="text-sm">{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Panel - Code Editor & Chat */}
          <div className="w-full lg:w-1/2 flex flex-col">
            {/* Code Editor */}
            <div className="flex-1 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-2">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  <span className="font-medium text-sm">Code Editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 p-4 bg-[hsl(222,47%,8%)]">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-transparent font-mono text-sm resize-none focus:outline-none text-foreground"
                  spellCheck={false}
                />
              </div>
              <div className="flex items-center justify-between border-t border-border bg-card/50 px-4 py-2">
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </Button>
                <Button size="sm" variant="success">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>

            {/* AI Chat */}
            <div className="h-80 border-t border-border flex flex-col">
              <div className="flex items-center gap-2 border-b border-border bg-card/50 px-4 py-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">CodeCrack Mentor</span>
                <Badge variant="secondary" className="text-xs">AI</Badge>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "max-w-[85%] rounded-lg p-3 text-sm",
                      msg.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask for hints, explanations, or help..."
                    className="flex-1 bg-secondary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
