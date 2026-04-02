import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_CODE_LENGTH = 10000;
const ALLOWED_LANGUAGES = ['python', 'java', 'cpp', 'javascript'];
const ALLOWED_MODES = ['run', 'submit'];

// Language-specific execution templates and configurations
const languageConfigs: Record<string, { extension: string; command: string; timeout: number; memoryLimit: string }> = {
  python: { extension: '.py', command: 'python3', timeout: 5000, memoryLimit: '128m' },
  java: { extension: '.java', command: 'java', timeout: 10000, memoryLimit: '256m' },
  cpp: { extension: '.cpp', command: 'g++', timeout: 5000, memoryLimit: '128m' },
  javascript: { extension: '.js', command: 'node', timeout: 5000, memoryLimit: '128m' },
};

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

interface ExecutionRequest {
  code: string;
  language: 'python' | 'java' | 'cpp' | 'javascript';
  mode: 'run' | 'submit';
  testCases: TestCase[];
  problemId: string;
}

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTime: number;
  error?: string;
  isHidden?: boolean;
}

// Simulated code execution (in production, this would use Docker containers)
async function simulateExecution(
  code: string,
  language: string,
  input: string,
  expectedOutput: string
): Promise<{ output: string; executionTime: number; error?: string }> {
  const startTime = Date.now();
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
  const executionTime = Date.now() - startTime;

  const syntaxErrors = checkSyntaxErrors(code, language);
  if (syntaxErrors) return { output: '', executionTime, error: syntaxErrors };

  const runtimeError = checkRuntimeErrors(code, language);
  if (runtimeError) return { output: '', executionTime, error: runtimeError };

  if (checkTLE(code)) return { output: '', executionTime: 5000, error: 'Time Limit Exceeded' };

  const simulatedOutput = simulateOutput(code, language, input, expectedOutput);
  return { output: simulatedOutput, executionTime };
}

function checkSyntaxErrors(code: string, language: string): string | null {
  if (language === 'python') {
    const singleQuotes = (code.match(/'/g) || []).length;
    const doubleQuotes = (code.match(/"/g) || []).length;
    if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) return 'SyntaxError: EOL while scanning string literal';
    if ((code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length) return 'SyntaxError: unexpected EOF while parsing';
  }
  if (language === 'java' || language === 'cpp') {
    if (!code.includes(';') && code.length > 20) return `${language === 'java' ? 'Error' : 'error'}: expected ';'`;
    if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) return `${language === 'java' ? 'Error' : 'error'}: expected '}'`;
  }
  if (language === 'javascript') {
    if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) return 'SyntaxError: Unexpected end of input';
  }
  return null;
}

function checkRuntimeErrors(code: string, language: string): string | null {
  if (code.includes('/ 0') || code.includes('/0')) {
    if (language === 'python') return 'ZeroDivisionError: division by zero';
    if (language === 'java') return 'Exception in thread "main" java.lang.ArithmeticException: / by zero';
    if (language === 'cpp') return 'Floating point exception';
    if (language === 'javascript') return 'Infinity';
  }
  if (code.includes('[-1]') && !code.includes('python')) {
    if (language === 'java') return 'ArrayIndexOutOfBoundsException';
    if (language === 'cpp') return 'Segmentation fault';
  }
  return null;
}

function checkTLE(code: string): boolean {
  const hasNestedLoops = (code.match(/for.*for/gs) || []).length > 0 || (code.match(/while.*while/gs) || []).length > 0;
  const hasLargeRange = code.includes('10000000') || code.includes('1000000000');
  return hasNestedLoops && hasLargeRange;
}

function simulateOutput(code: string, language: string, input: string, expectedOutput: string): string {
  const codeHasReturn = code.includes('return') || code.includes('print') || code.includes('System.out') || code.includes('cout') || code.includes('console.log');
  if (!codeHasReturn) return '';
  if (code.includes('target') && (code.includes('dict') || code.includes('HashMap') || code.includes('map') || code.includes('{}') || code.includes('Map'))) return expectedOutput;
  if (code.includes('for') && code.match(/for.*for/gs)) return expectedOutput;
  if (code.length < 50 || code.includes('# Write your code here') || code.includes('// Write your code here')) return '';
  const isLikelyCorrect = Math.random() > 0.3;
  return isLikelyCorrect ? expectedOutput : expectedOutput.split('').reverse().join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { code, language, mode, testCases, problemId }: ExecutionRequest = await req.json();

    // Input validation
    if (!code || typeof code !== 'string' || code.length > MAX_CODE_LENGTH) {
      return new Response(
        JSON.stringify({ error: 'Invalid or too long code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!language || !ALLOWED_LANGUAGES.includes(language)) {
      return new Response(
        JSON.stringify({ error: 'Unsupported language' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!mode || !ALLOWED_MODES.includes(mode)) {
      return new Response(
        JSON.stringify({ error: 'Invalid mode' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Test cases are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!problemId || typeof problemId !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Problem ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Executing ${language} code for problem ${problemId} in ${mode} mode`);

    const casesToRun = mode === 'run'
      ? testCases.filter(tc => !tc.isHidden).slice(0, 3)
      : testCases;

    const results: TestResult[] = [];
    let allPassed = true;

    for (const testCase of casesToRun) {
      const { output, executionTime, error } = await simulateExecution(code, language, testCase.input, testCase.expectedOutput);
      const passed = !error && output.trim() === testCase.expectedOutput.trim();
      if (!passed) allPassed = false;

      results.push({
        passed,
        input: testCase.isHidden && mode === 'submit' && !passed ? '[Hidden]' : testCase.input,
        expectedOutput: testCase.isHidden && mode === 'submit' && !passed ? '[Hidden]' : testCase.expectedOutput,
        actualOutput: output,
        executionTime,
        error,
        isHidden: testCase.isHidden,
      });

      if (mode === 'submit' && !passed) break;
    }

    let verdict = 'Accepted';
    if (!allPassed) {
      const failedResult = results.find(r => !r.passed);
      if (failedResult?.error?.includes('Time Limit')) verdict = 'Time Limit Exceeded';
      else if (failedResult?.error) verdict = 'Runtime Error';
      else verdict = 'Wrong Answer';
    }

    const totalExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0);

    return new Response(
      JSON.stringify({
        verdict: mode === 'submit' ? verdict : undefined,
        results,
        totalExecutionTime,
        passedCount: results.filter(r => r.passed).length,
        totalCount: mode === 'submit' ? testCases.length : results.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Code execution error:', error);
    return new Response(
      JSON.stringify({ error: 'Execution failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
