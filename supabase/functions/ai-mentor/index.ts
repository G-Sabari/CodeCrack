import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MentorRequest {
  mode: 'hint' | 'explain' | 'interview' | 'company-feedback';
  userCode: string;
  language: string;
  problemTitle: string;
  problemDescription: string;
  executionResult?: {
    verdict?: string;
    error?: string;
    actualOutput?: string;
    expectedOutput?: string;
  };
  userMessage: string;
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
  company?: string;
}

const SYSTEM_PROMPTS = {
  base: `You are CodeCrack Mentor, a strict but helpful coding interview mentor. Your role is to help candidates prepare for real technical interviews.

CORE RULES:
1. ONLY answer questions related to coding, data structures, algorithms, and technical interviews
2. REFUSE to answer off-topic questions politely but firmly
3. Never give direct solutions unless explicitly asked - guide the candidate to think
4. Point out logic flaws, edge cases, and complexity issues
5. Be encouraging but maintain high standards
6. Use clear, concise explanations

When analyzing code:
- Identify bugs and logic errors
- Suggest optimizations
- Discuss time and space complexity
- Point out edge cases the candidate might have missed`,

  hint: `MODE: Hint-Only
Provide ONLY subtle hints, never direct solutions. Ask guiding questions. Help the candidate discover the solution themselves.`,

  explain: `MODE: Code Explanation
Analyze the provided code thoroughly:
1. Explain what the code does step by step
2. Identify any bugs or logical errors
3. Discuss the time and space complexity
4. Suggest improvements if applicable
5. Mention edge cases that might fail`,

  interview: `MODE: Interview Simulation
Act as a strict technical interviewer:
1. Ask follow-up questions about the approach
2. Challenge their solution with edge cases
3. Ask about time/space complexity
4. Probe their understanding of alternatives
5. Be professional but demanding`,

  'company-feedback': `MODE: Company-Specific Feedback
Provide feedback tailored to the specified company's interview style:
- For Zoho: Focus on practical problem-solving and code quality
- For Amazon: Emphasize scalability and Leadership Principles
- For Google: Focus on optimal solutions and algorithmic thinking
- For Microsoft: Balance between code quality and problem-solving approach
- For TCS/Infosys: Focus on correctness and fundamental understanding`,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { 
      mode, 
      userCode, 
      language, 
      problemTitle,
      problemDescription,
      executionResult, 
      userMessage, 
      conversationHistory,
      company 
    }: MentorRequest = await req.json();

    console.log(`AI Mentor request - Mode: ${mode}, Problem: ${problemTitle}`);

    // Check if message is off-topic
    const offTopicKeywords = ['weather', 'sports', 'movie', 'music', 'food', 'politics', 'personal', 'dating'];
    const isOffTopic = offTopicKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword) && 
      !userMessage.toLowerCase().includes('algorithm') &&
      !userMessage.toLowerCase().includes('code')
    );

    if (isOffTopic) {
      return new Response(
        JSON.stringify({ 
          response: "I'm CodeCrack Mentor, and I'm here to help you with coding, algorithms, and interview preparation. Let's stay focused on your technical growth! What coding question can I help you with?" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the system prompt
    let systemPrompt = SYSTEM_PROMPTS.base + '\n\n' + SYSTEM_PROMPTS[mode];
    
    if (mode === 'company-feedback' && company) {
      systemPrompt += `\n\nTarget Company: ${company}`;
    }

    // Build context message
    let contextMessage = `CURRENT PROBLEM: ${problemTitle}\n\nPROBLEM DESCRIPTION:\n${problemDescription}\n\n`;
    
    if (userCode && userCode.trim()) {
      contextMessage += `USER'S CODE (${language}):\n\`\`\`${language}\n${userCode}\n\`\`\`\n\n`;
    }
    
    if (executionResult) {
      contextMessage += `EXECUTION RESULT:\n`;
      if (executionResult.verdict) {
        contextMessage += `Verdict: ${executionResult.verdict}\n`;
      }
      if (executionResult.error) {
        contextMessage += `Error: ${executionResult.error}\n`;
      }
      if (executionResult.actualOutput) {
        contextMessage += `Actual Output: ${executionResult.actualOutput}\n`;
      }
      if (executionResult.expectedOutput) {
        contextMessage += `Expected Output: ${executionResult.expectedOutput}\n`;
      }
      contextMessage += '\n';
    }

    // Prepare messages for the AI
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: contextMessage },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway error');
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('AI Mentor error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Mentor unavailable' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
