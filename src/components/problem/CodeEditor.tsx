import { useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CodeEditorProps {
  language: string;
  onLanguageChange: (language: string) => void;
  code: string;
  onCodeChange: (code: string) => void;
  problemId: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'python', label: 'Python 3' },
  { value: 'java', label: 'Java (JDK 17)' },
  { value: 'cpp', label: 'C++ (GCC)' },
  { value: 'javascript', label: 'JavaScript (Node.js)' },
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

  return (
    <div className="flex flex-col h-full">
      {/* Language Selector */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-card">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_OPTIONS.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={MONACO_LANGUAGE_MAP[language]}
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          onMount={handleEditorMount}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
}
