import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Language-specific execution templates and configurations
const languageConfigs = {
  python: {
    extension: '.py',
    command: 'python3',
    timeout: 5000,
    memoryLimit: '128m',
  },
  java: {
    extension: '.java',
    command: 'java',
    timeout: 10000,
    memoryLimit: '256m',
  },
  cpp: {
    extension: '.cpp',
    command: 'g++',
    timeout: 5000,
    memoryLimit: '128m',
  },
  javascript: {
    extension: '.js',
    command: 'node',
    timeout: 5000,
    memoryLimit: '128m',
  },
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
// For now, we'll simulate execution with realistic behavior
async function simulateExecution(
  code: string,
  language: string,
  input: string,
  expectedOutput: string
): Promise<{ output: string; executionTime: number; error?: string }> {
  const startTime = Date.now();
  
  // Simulate execution delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
  
  const executionTime = Date.now() - startTime;
  
  // Check for common syntax errors (simplified)
  const syntaxErrors = checkSyntaxErrors(code, language);
  if (syntaxErrors) {
    return { output: '', executionTime, error: syntaxErrors };
  }
  
  // Check for runtime errors (simplified detection)
  const runtimeError = checkRuntimeErrors(code, language);
  if (runtimeError) {
    return { output: '', executionTime, error: runtimeError };
  }
  
  // Check for TLE (simplified: if code has nested loops with large iterations)
  if (checkTLE(code)) {
    return { output: '', executionTime: 5000, error: 'Time Limit Exceeded' };
  }
  
  // For demo purposes, simulate output based on code logic patterns
  const simulatedOutput = simulateOutput(code, language, input, expectedOutput);
  
  return { output: simulatedOutput, executionTime };
}

function checkSyntaxErrors(code: string, language: string): string | null {
  // Basic syntax checks
  if (language === 'python') {
    // Check for unclosed strings
    const singleQuotes = (code.match(/'/g) || []).length;
    const doubleQuotes = (code.match(/"/g) || []).length;
    if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
      return 'SyntaxError: EOL while scanning string literal';
    }
    // Check for unmatched brackets
    if ((code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length) {
      return 'SyntaxError: unexpected EOF while parsing';
    }
  }
  
  if (language === 'java' || language === 'cpp') {
    // Check for missing semicolons (simplified)
    if (!code.includes(';') && code.length > 20) {
      return `${language === 'java' ? 'Error' : 'error'}: expected ';'`;
    }
    // Check for unmatched braces
    if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) {
      return `${language === 'java' ? 'Error' : 'error'}: expected '}'`;
    }
  }
  
  if (language === 'javascript') {
    // Check for unmatched brackets/braces
    if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) {
      return 'SyntaxError: Unexpected end of input';
    }
  }
  
  return null;
}

function checkRuntimeErrors(code: string, language: string): string | null {
  // Check for division by zero pattern
  if (code.includes('/ 0') || code.includes('/0')) {
    if (language === 'python') return 'ZeroDivisionError: division by zero';
    if (language === 'java') return 'Exception in thread "main" java.lang.ArithmeticException: / by zero';
    if (language === 'cpp') return 'Floating point exception';
    if (language === 'javascript') return 'Infinity';
  }
  
  // Check for index out of bounds patterns
  if (code.includes('[-1]') && !code.includes('python')) {
    if (language === 'java') return 'ArrayIndexOutOfBoundsException';
    if (language === 'cpp') return 'Segmentation fault';
  }
  
  return null;
}

function checkTLE(code: string): boolean {
  // Simple TLE detection: nested loops with large ranges
  const hasNestedLoops = (code.match(/for.*for/gs) || []).length > 0 ||
                         (code.match(/while.*while/gs) || []).length > 0;
  const hasLargeRange = code.includes('10000000') || code.includes('1000000000');
  
  return hasNestedLoops && hasLargeRange;
}

function simulateOutput(code: string, language: string, input: string, expectedOutput: string): string {
  // For demo: simulate based on code patterns
  // In production, this would be actual Docker-based execution
  
  // Check if the code looks correct (has expected patterns)
  const codeHasReturn = code.includes('return') || code.includes('print') || 
                        code.includes('System.out') || code.includes('cout') ||
                        code.includes('console.log');
  
  if (!codeHasReturn) {
    return '';
  }
  
  // For Two Sum problem patterns
  if (code.includes('target') && (code.includes('dict') || code.includes('HashMap') || 
      code.includes('map') || code.includes('{}') || code.includes('Map'))) {
    // Likely a correct hash map approach
    return expectedOutput;
  }
  
  // For brute force approach (less optimal but might still work)
  if (code.includes('for') && code.match(/for.*for/gs)) {
    // Nested loops - brute force, still returns correct answer but slower
    return expectedOutput;
  }
  
  // Check if it's an empty or template code
  if (code.length < 50 || code.includes('# Write your code here') || 
      code.includes('// Write your code here')) {
    return '';
  }
  
  // Return expected output with some probability for demo
  // In real implementation, this would be actual execution
  const isLikelyCorrect = Math.random() > 0.3;
  return isLikelyCorrect ? expectedOutput : expectedOutput.split('').reverse().join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, mode, testCases, problemId }: ExecutionRequest = await req.json();

    console.log(`Executing ${language} code for problem ${problemId} in ${mode} mode`);
    
    if (!code || !language || !testCases || testCases.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: code, language, testCases' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!languageConfigs[language]) {
      return new Response(
        JSON.stringify({ error: `Unsupported language: ${language}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter test cases based on mode
    const casesToRun = mode === 'run' 
      ? testCases.filter(tc => !tc.isHidden).slice(0, 3) // Run: sample + 2 dry-run cases
      : testCases; // Submit: all test cases

    const results: TestResult[] = [];
    let allPassed = true;

    for (const testCase of casesToRun) {
      const { output, executionTime, error } = await simulateExecution(
        code,
        language,
        testCase.input,
        testCase.expectedOutput
      );

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

      // For submit mode, stop on first failure to show the failing case
      if (mode === 'submit' && !passed) {
        break;
      }
    }

    // Determine verdict
    let verdict = 'Accepted';
    if (!allPassed) {
      const failedResult = results.find(r => !r.passed);
      if (failedResult?.error?.includes('Time Limit')) {
        verdict = 'Time Limit Exceeded';
      } else if (failedResult?.error) {
        verdict = 'Runtime Error';
      } else {
        verdict = 'Wrong Answer';
      }
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
      JSON.stringify({ error: error instanceof Error ? error.message : 'Execution failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
