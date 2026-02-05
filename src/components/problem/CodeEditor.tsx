import { useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Code2, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  language: string;
  onLanguageChange: (language: string) => void;
  code: string;
  onCodeChange: (code: string) => void;
  problemId: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'python', label: 'Python 3', icon: '🐍' },
  { value: 'java', label: 'Java (JDK 17)', icon: '☕' },
  { value: 'cpp', label: 'C++ (GCC)', icon: '⚡' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
];

const MONACO_LANGUAGE_MAP: Record<string, string> = {
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  javascript: 'javascript',
};

export function CodeEditor({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  problemId,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const [editorMounted, setEditorMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Autosave to localStorage
  useEffect(() => {
    if (code && problemId && editorMounted) {
      const key = `codecrack_code_${problemId}_${language}`;
      localStorage.setItem(key, code);
    }
  }, [code, problemId, language, editorMounted]);

  // Load saved code on mount or language change
  useEffect(() => {
    const key = `codecrack_code_${problemId}_${language}`;
    const savedCode = localStorage.getItem(key);
    if (savedCode) {
      onCodeChange(savedCode);
    }
  }, [problemId, language]);

  const handleEditorMount: OnMount = (editor) => {
    setEditorMounted(true);
    editor.focus();
  };

  const handleReset = () => {
    const key = `codecrack_code_${problemId}_${language}`;
    localStorage.removeItem(key);
    toast.success('Code reset to starter template');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const currentLang = LANGUAGE_OPTIONS.find(l => l.value === language);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-card/50 to-background/30">
      {/* Premium Language Selector Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-[hsl(200,80%,60%)]/20 border border-primary/20">
            <Code2 className="h-4 w-4 text-primary" />
          </div>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[180px] h-9 bg-secondary/50 border-border/50 hover:border-primary/30 transition-colors">
              <SelectValue placeholder="Select language">
                <span className="flex items-center gap-2">
                  <span>{currentLang?.icon}</span>
                  <span>{currentLang?.label}</span>
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
              {LANGUAGE_OPTIONS.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  <span className="flex items-center gap-2">
                    <span>{lang.icon}</span>
                    <span>{lang.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-3 hover:bg-primary/10 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-[hsl(var(--success))]" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-3 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Monaco Editor with premium border */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 rounded-none overflow-hidden">
          <Editor
            height="100%"
            language={MONACO_LANGUAGE_MAP[language]}
            value={code}
            onChange={(value) => onCodeChange(value || '')}
            onMount={handleEditorMount}
            theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 14,
              lineHeight: 24,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              insertSpaces: true,
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              bracketPairColorization: { enabled: true },
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              formatOnPaste: true,
              formatOnType: true,
              scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                useShadows: false,
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              renderLineHighlightOnlyWhenFocus: false,
              occurrencesHighlight: 'singleFile',
              selectionHighlight: true,
              guides: {
                indentation: true,
                bracketPairs: true,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
