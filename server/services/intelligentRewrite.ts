import { executeFourPhaseProtocol } from './fourPhaseProtocol';

type LLMProvider = 'openai' | 'anthropic' | 'perplexity' | 'deepseek';

interface IntelligentRewriteRequest {
  text: string;
  customInstructions?: string;
  provider: LLMProvider;
}

interface IntelligentRewriteResult {
  originalText: string;
  rewrittenText: string;
  originalScore: number;
  rewrittenScore: number;
  provider: string;
  instructions: string;
  rewriteReport: string;
  newAnalysis: {
    intelligence_score: number;
    analysis: string;
    formattedReport: string;
  };
}

// Map ZHI names to actual provider names
function mapZhiToProvider(zhiName: string): string {
  const mapping: Record<string, string> = {
    'zhi1': 'openai',
    'zhi2': 'anthropic', 
    'zhi3': 'deepseek',
  };
  return mapping[zhiName] || zhiName;
}

export async function performIntelligentRewrite(request: IntelligentRewriteRequest): Promise<IntelligentRewriteResult> {
  const { text, customInstructions, provider: rawProvider } = request;
  const provider = mapZhiToProvider(rawProvider) as LLMProvider;
  
  console.log(`Starting intelligent rewrite with ${provider}`);
  
  // Step 1: Get baseline score using 4-phase protocol
  console.log('Step 1: Evaluating original text...');
  const originalEvaluation = await executeFourPhaseProtocol(text, provider);
  const originalScore = originalEvaluation.overallScore;
  
  console.log(`Original score: ${originalScore}/100`);
  
  // Step 2: Create rewrite instructions
  const defaultInstructions = `REWRITE THIS TEXT TO MAKE IT GENUINELY SMARTER WITHOUT INFLATING WORD COUNT.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CRITICAL: IF YOU ADD BLOAT OR ACADEMIC PADDING, YOU HAVE FAILED ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXAMPLES OF FAILURES (DO NOT DO THIS):

❌ ORIGINAL: "Most people operate on the assumption that"
❌ BLOATED REWRITE: "The prevailing assumption among both laypeople and psychologists posits that"
→ This is 40% longer, sounds pretentious, adds ZERO insight. TOTAL FAILURE.

❌ ORIGINAL: "various self-directed drives"
❌ BLOATED REWRITE: "individuals possess self-directed drives that, within group contexts, are redirected"
→ Adding "possess" and "within group contexts" is just padding. FAILURE.

❌ ORIGINAL: "this position is understandable"
❌ BLOATED REWRITE: "This perspective holds descriptive validity"
→ Swapping natural language for jargon without adding precision. FAILURE.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO ACTUALLY MAKE TEXT SMARTER (NOT LONGER):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Replace vague terms with precise ones:
  "various drives" → "survival drives and status drives" (same length, more specific)

✓ Add a conceptual distinction the author missed:
  "group psychology" → "emergent collective behavior vs aggregated individual behavior" (new distinction)

✓ Make a bolder, riskier claim if you can defend it:
  "it is hard to believe" → "this is impossible" (stronger if you can justify it)

✓ Expose hidden assumptions:
  Add: "This assumes individuals can exist independently, which may be false"

✓ Cut redundancy:
  "try to survive, flourish and reproduce" → "try to survive and reproduce" (flourish is implied)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY CONSTRAINTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. NEVER replace simple words with complex synonyms just to sound smart
2. NEVER add "wherein", "whereby", "thereof" unless it actually clarifies something
3. NEVER change "people" to "individuals" or "laypeople" unless it matters
4. NEVER add words like "posit", "manifest", "embody" when simple verbs work
5. KEEP the author's natural voice and rhythm
6. ADD insight, NOT word count
7. If you can't make it genuinely smarter, change NOTHING

OUTPUT TARGET: Same length or SHORTER, with MORE actual conceptual content.`;

  const finalInstructions = customInstructions 
    ? `${defaultInstructions}\n\nADDITIONAL CUSTOM INSTRUCTIONS:\n${customInstructions}\n\nNote: Balance custom instructions with the intelligence optimization criteria above.`
    : defaultInstructions;

  // Step 3: Perform the rewrite
  console.log('Step 2: Performing intelligent rewrite...');
  const rewritePrompt = `${finalInstructions}

ORIGINAL TEXT:
${text}

CRITICAL: Output ONLY the rewritten text. NO commentary, NO explanations, NO preamble like "Here's a rewrite..." Just the pure rewritten text starting immediately.

REWRITTEN TEXT:`;

  let rewrittenText: string;
  try {
    // Use the same LLM call pattern as other services
    if (provider === 'openai') {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: rewritePrompt }],
        temperature: 0.1
      });
      
      rewrittenText = completion.choices[0]?.message?.content || '';
      
      // Strip out AI commentary bullshit  
      rewrittenText = rewrittenText
        .replace(/^Here's.*?rewrite.*?:/i, '')
        .replace(/^This.*?version.*?:/i, '')
        .replace(/^The following.*?:/i, '')
        .replace(/^Below.*?:/i, '')
        .replace(/^\*\*.*?\*\*:?/gm, '')
        .replace(/^--+/gm, '')
        .trim();
    } else if (provider === 'anthropic') {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      
      const completion = await anthropic.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4000,
        messages: [{ role: "user", content: rewritePrompt }],
        temperature: 0.1
      });
      
      rewrittenText = completion.content[0]?.type === 'text' ? completion.content[0].text : '';
      
      // Strip out AI commentary bullshit
      rewrittenText = rewrittenText
        .replace(/^Here's.*?rewrite.*?:/i, '')
        .replace(/^This.*?version.*?:/i, '')
        .replace(/^The following.*?:/i, '')
        .replace(/^Below.*?:/i, '')
        .replace(/^\*\*.*?\*\*:?/gm, '')
        .replace(/^--+/gm, '')
        .trim();
    } else if (provider === 'perplexity') {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [{ role: "user", content: rewritePrompt }],
          temperature: 0.1
        })
      });
      
      const data = await response.json();
      rewrittenText = data.choices[0]?.message?.content || '';
    } else if (provider === 'deepseek') {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: rewritePrompt }],
          temperature: 0.1,
          max_tokens: 4000
        })
      });
      
      const data = await response.json();
      rewrittenText = data.choices[0]?.message?.content || '';
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error during rewrite with ${provider}:`, error);
    throw new Error(`Rewrite failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Step 4: Evaluate the rewritten text
  console.log('Step 3: Evaluating rewritten text...');
  const rewrittenEvaluation = await executeFourPhaseProtocol(rewrittenText, provider);
  const rewrittenScore = rewrittenEvaluation.overallScore;
  
  console.log(`Rewritten score: ${rewrittenScore}/100`);
  console.log(`Score improvement: ${rewrittenScore - originalScore} points`);
  
  // Step 5: Generate rewrite report
  const improvementType = rewrittenScore > originalScore ? 'improvement' : 
                         rewrittenScore < originalScore ? 'regression' : 'no change';
  
  const rewriteReport = `Intelligent Rewrite Analysis:

Original Score: ${originalScore}/100
Rewritten Score: ${rewrittenScore}/100
Change: ${rewrittenScore > originalScore ? '+' : ''}${rewrittenScore - originalScore} points (${improvementType})

Provider: ${provider}
Instructions: ${customInstructions || 'Default intelligence optimization'}

The rewrite ${improvementType === 'improvement' ? 'successfully enhanced' : 
             improvementType === 'regression' ? 'unfortunately decreased' : 'maintained'} 
the text's intelligence evaluation score through ${improvementType === 'improvement' ? 'strategic structural and logical improvements' : 
                                                  improvementType === 'regression' ? 'changes that may have disrupted the original logical flow' :
                                                  'modifications that preserved the original intellectual level'}.`;

  return {
    originalText: text,
    rewrittenText,
    originalScore,
    rewrittenScore,
    provider,
    instructions: customInstructions || 'Default intelligence optimization',
    rewriteReport,
    newAnalysis: {
      intelligence_score: rewrittenScore,
      analysis: rewrittenEvaluation.formattedReport || rewrittenEvaluation.analysis || rewriteReport,
      formattedReport: rewrittenEvaluation.formattedReport || rewrittenEvaluation.analysis || rewriteReport
    }
  };
}