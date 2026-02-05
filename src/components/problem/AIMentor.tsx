import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Lightbulb, Code2, Mic, Building2, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIMentorProps {
  problemTitle: string;
  problemDescription: string;
  userCode: string;
  language: string;
  executionResult?: {
    verdict?: string;
    error?: string;
    actualOutput?: string;
    expectedOutput?: string;
  };
}

type MentorMode = 'hint' | 'explain' | 'interview' | 'company-feedback';

const MODE_OPTIONS = [
  { value: 'hint', label: 'Hint Mode', icon: Lightbulb, description: 'Get subtle hints', color: 'text-[hsl(var(--warning))]' },
  { value: 'explain', label: 'Explain Code', icon: Code2, description: 'Analyze your code', color: 'text-primary' },
  { value: 'interview', label: 'Interview Sim', icon: Mic, description: 'Practice interview', color: 'text-[hsl(280,65%,60%)]' },
  { value: 'company-feedback', label: 'Company Mode', icon: Building2, description: 'Company feedback', color: 'text-[hsl(var(--success))]' },
];

const COMPANY_OPTIONS = [
  'Zoho', 'Amazon', 'Google', 'Microsoft', 'TCS', 'Infosys', 'Wipro', 'Flipkart', 'Atlassian'
];

export function AIMentor({
  problemTitle,
  problemDescription,
  userCode,
  language,
  executionResult,
}: AIMentorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your CodeCrack AI Mentor. I'm here to help you solve "${problemTitle}". I won't give you direct answers, but I'll guide you through the problem-solving process.\n\nSelect a mode above and ask me anything about the problem!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<MentorMode>('hint');
  const [company, setCompany] = useState('Zoho');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-mentor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            mode,
            userCode,
            language,
            problemTitle,
            problemDescription,
            executionResult,
            userMessage,
            conversationHistory: messages.slice(-10),
            company: mode === 'company-feedback' ? company : undefined,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast.error('Rate limit exceeded. Please wait a moment.');
          return;
        }
        if (response.status === 402) {
          toast.error('AI credits exhausted. Please try again later.');
          return;
        }
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantMessage = '';
      let textBuffer = '';

      // Add empty assistant message that we'll update
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: assistantMessage,
                };
                return newMessages;
              });
            }
          } catch {
            // Incomplete JSON, wait for more data
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error('AI Mentor error:', error);
      toast.error('Failed to get response from mentor');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const currentMode = MODE_OPTIONS.find(m => m.value === mode);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-card/30 to-background/20">
      {/* Premium Mode Selection Bar */}
      <div className="p-3 border-b border-border/30 flex items-center gap-3 flex-shrink-0 bg-card/30 backdrop-blur-sm">
        <Select value={mode} onValueChange={(v) => setMode(v as MentorMode)}>
          <SelectTrigger className="w-[160px] h-9 bg-secondary/50 border-border/50 hover:border-primary/30 transition-colors">
            <SelectValue>
              {currentMode && (
                <span className="flex items-center gap-2">
                  <currentMode.icon className={cn("h-4 w-4", currentMode.color)} />
                  <span>{currentMode.label}</span>
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
            {MODE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <div className="flex items-center gap-2">
                  <opt.icon className={cn("h-4 w-4", opt.color)} />
                  <span>{opt.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {mode === 'company-feedback' && (
          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger className="w-[120px] h-9 bg-secondary/50 border-border/50 hover:border-primary/30 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
              {COMPANY_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Premium Messages Area */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex gap-3 animate-fade-in',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {message.role === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-[hsl(280,65%,60%)]/20 border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_hsl(var(--primary)/0.2)]">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg transition-all duration-300',
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-primary to-[hsl(200,80%,50%)] text-primary-foreground rounded-br-md'
                    : 'bg-secondary/50 backdrop-blur-sm border border-border/30 rounded-bl-md hover:bg-secondary/70'
                )}
              >
                <pre className="whitespace-pre-wrap font-sans leading-relaxed">{message.content}</pre>
              </div>
              {message.role === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 border border-border/30 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-[hsl(280,65%,60%)]/20 border border-primary/20 flex items-center justify-center shadow-[0_0_15px_hsl(var(--primary)/0.2)]">
                <Brain className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="bg-secondary/50 backdrop-blur-sm border border-border/30 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Premium Input Area */}
      <div className="p-3 border-t border-border/30 bg-card/30 backdrop-blur-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the problem..."
            disabled={isLoading}
            className="flex-1 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-primary to-[hsl(200,80%,50%)] hover:from-primary/90 hover:to-[hsl(200,80%,50%)]/90 shadow-[0_0_15px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send • Ctrl+Enter for code run
        </p>
      </div>
    </div>
  );
}
