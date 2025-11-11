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
  const defaultInstructions = `INSTRUCTIONS: PRESERVE ORIGINAL TEXT VERBATIM. ADD EMPIRICAL EVIDENCE, CONCRETE EXAMPLES, AND EXPLICIT DEVELOPMENT.

NEVER EVER IMPROVE BY "REWORDING." ALL ADDITIONS MUST BE SUBSTANTIVE, NOT PHRASEOLOGICAL.

YOUR TASK:
1. Keep every original sentence EXACTLY as written (word-for-word)
2. INSERT new content BETWEEN original sentences that adds:
   - Empirical studies with quantitative data
   - Concrete biological/organizational examples
   - Explicit development of implicit points
   - Mechanisms and explanations

WHAT TO ADD:

FOR EVERY UNSUPPORTED CLAIM:
- Add specific research: "Solomon Asch's classic conformity experiments revealed that approximately 75% of participants conformed to obviously incorrect group judgments at least once, with about 32% of all responses conforming to the erroneous majority."
- Add concrete examples: "Consider apoptosis—programmed cell death. From an individual-cell perspective, apoptosis appears maladaptive: the cell actively dismantles itself through a genetically-encoded suicide program."
- Add quantitative data: Replace "high degree" with "75% of participants"
- Add mechanisms: Explain HOW and WHY, not just THAT

FOR EVERY ABSTRACT ARGUMENT:
- Add concrete cases from biology, psychology, history
- Add specific studies and researchers by name
- Add mathematical models or empirical demonstrations

FOR EVERY IMPLICIT POINT:
- Make it explicit by spelling out what's being assumed
- Add 1-3 paragraphs developing the implication
- Example: "geniuses as limiting cases" → Spell out three interpretations: (1) geniuses as collectives of one, (2) geniuses as rogue actors, (3) geniuses as specialized collective members

MANDATORY FORMAT:

Original sentence [PRESERVED VERBATIM]. New empirical content adding study/data/example. More development making implicit points explicit. Original next sentence [PRESERVED VERBATIM]. New concrete biological example. Mechanism explanation.

EXAMPLE:

ORIGINAL: "This methodological stance cannot be reconciled with the incredibly high degree of conformism exhibited by people"

IMPROVED: "However, this methodological stance cannot be reconciled with the incredibly high degree of conformism exhibited by people—even after intellectual shortcomings on their part are taken into account—to other people's opinions. Solomon Asch's classic conformity experiments revealed that approximately 75% of participants conformed to obviously incorrect group judgments at least once, with about 32% of all responses conforming to the erroneous majority. Crucially, these effects persisted even when the perceptual task was unambiguous and participants were demonstrably capable of accurate independent judgment."

WHAT WAS DONE:
✓ Original text preserved: "This methodological stance cannot be reconciled with the incredibly high degree of conformism exhibited by people"
✓ Added Asch experiments (specific study)
✓ Added 75% and 32% (quantitative data)
✓ Added "effects persisted even when..." (empirical detail)
✗ Did NOT change "cannot be reconciled" to "is incompatible with"
✗ Did NOT change "people" to "individuals"
✗ Did NOT make it sound more academic

FORBIDDEN:
❌ Changing "Most people" → "The prevailing assumption" (rephrasing)
❌ Changing "operate on the assumption" → "posit that" (rephrasing)  
❌ Changing "it is hard to believe" → "it is impossible" (unless you prove it)
❌ Adding "wherein", "whereby", "thereof" without adding meaning
❌ Changing casual voice to academic voice

RESULT MUST BE:
- Original text appears word-for-word
- 2-3x longer from substantive additions
- Every claim backed by specific study or concrete case
- Implicit points explicitly developed
- Same voice, same rhythm, more empirical grounding`;

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