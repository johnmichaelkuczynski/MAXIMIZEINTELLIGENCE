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
  const defaultInstructions = `YOUR JOB: PRESERVE THE ORIGINAL TEXT. ADD EMPIRICAL EVIDENCE AND CONCRETE EXAMPLES.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ KEEP ORIGINAL TEXT INTACT. ADD EVIDENCE, EXAMPLES, DATA. ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT TO ADD (in order of priority):

1. EMPIRICAL STUDIES: Add research citations for unsupported claims
   - "incredibly high degree of conformism" → Add Asch experiments (75% conformed, 32% of responses)
   - "wisdom of crowds" → Add actual research on aggregated judgments

2. CONCRETE EXAMPLES: Add specific cases for abstract arguments
   - "collectives exhibit intelligence" → Add apoptosis, cellular differentiation examples
   - "scientific progress" → Add historical analysis of specific discoveries

3. QUANTITATIVE DATA: Add numbers for qualitative claims
   - "high degree" → "75% of participants"
   - "most" → Specify actual percentages

4. IMPLICIT → EXPLICIT: Develop underdeveloped implications
   - "geniuses as limiting cases" → Spell out three interpretations explicitly
   - "collective is primary" → Explain the ontological claim

5. BIOLOGICAL/EMPIRICAL GROUNDING: Add mechanisms, not just assertions
   - "cells sacrifice for organism" → Explain apoptosis machinery
   - "organizations exhibit rationality" → Cite organizational routine research

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXAMPLE OF CORRECT IMPROVEMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORIGINAL: "This methodological stance cannot be reconciled with the incredibly high degree of conformism exhibited by people"

CORRECT IMPROVEMENT: "However, this methodological stance cannot be reconciled with the incredibly high degree of conformism exhibited by people—even after intellectual shortcomings on their part are taken into account—to other people's opinions. Solomon Asch's classic conformity experiments revealed that approximately 75% of participants conformed to obviously incorrect group judgments at least once, with about 32% of all responses conforming to the erroneous majority. Crucially, these effects persisted even when the correct answer was unambiguous and conformity imposed no material benefit."

WHAT WAS ADDED:
✓ Asch experiments (specific study)
✓ 75% conformed at least once (quantitative data)
✓ 32% of responses (more precise metric)
✓ "effects persisted even when..." (empirical detail)

WHAT WAS PRESERVED:
✓ "This methodological stance cannot be reconciled" (exact wording)
✓ "incredibly high degree of conformism" (exact wording)
✓ Author's natural voice and rhythm

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORIGINAL: "A cell is an individual organism. But how well can you understand a cell if you try to understand on its own terms?"

CORRECT IMPROVEMENT: "A cell is an individual organism. But how well can you understand a cell if you try to understand it on its own terms? Pretty well but not maximally well. If you tried to understand its behavior in terms of a drive on its part to live or flourish or reproduce, you would get far. Cellular biology successfully explains many phenomena—metabolism, homeostasis, mitosis—by treating cells as autonomous units with their own survival machinery. But there would still be some unanswered, and unanswerable, questions.

Consider apoptosis—programmed cell death. From an individual-cell perspective, apoptosis appears maladaptive: the cell actively dismantles itself through a genetically-encoded suicide program. Why would an organism whose fundamental drive is survival and reproduction possess elaborate mechanisms for self-destruction?"

WHAT WAS ADDED:
✓ Apoptosis as concrete example
✓ Biological mechanism explanation
✓ The puzzle it creates for individualist framework

WHAT WAS PRESERVED:
✓ Original question structure
✓ Original phrasing ("Pretty well but not maximally well")
✓ Conversational tone

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROCEDURE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Identify every unsupported claim
- "incredibly high degree of conformism" → Needs Asch experiments
- "wisdom of crowds" → Needs actual research citation
- "collectives exhibit more intelligence" → Needs concrete examples (apoptosis, neurons/brains)

STEP 2: For each unsupported claim, add:
- Specific study name (Solomon Asch, James Surowiecki, etc.)
- Quantitative data (75%, 32%, etc.)
- Concrete biological/organizational example
- Mechanism explanation (how/why it works)

STEP 3: Preserve original text EXACTLY
- Keep "Most people, including most psychologists" (don't change to "The prevailing assumption")
- Keep "it is hard to believe" (don't change to "this is impossible" unless you can prove it)
- Keep author's casual, direct voice
- Only add content BETWEEN original sentences, never replace them

STEP 4: Develop implicit points explicitly
- "geniuses as limiting cases" → Spell out all three interpretations
- "collective is primary" → Explain what this means ontologically
- Add 2-3 paragraphs developing underdeveloped implications

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORBIDDEN ACTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Changing "Most people" to "The prevailing assumption" (just rephrasing)
❌ Changing "operate on the assumption" to "posit that" (just rephrasing)
❌ Adding "wherein" or "whereby" or "thereof" (just padding)
❌ Making sentences longer without adding substance
❌ Changing casual voice to academic voice
❌ Rephrasing clear statements in fancier words

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT REQUIREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MANDATORY:
1. Original sentences must appear VERBATIM (exact same words)
2. Add empirical studies, quantitative data, concrete examples BETWEEN original sentences
3. Expand underdeveloped implications with 1-3 new paragraphs
4. Keep author's natural, conversational voice
5. Never rephrase, never swap synonyms, never make it sound more academic

RESULT SHOULD BE:
- Original text 100% preserved
- 2-3x longer due to evidence and examples
- Every claim now backed by specific study or concrete case
- Implicit arguments made fully explicit
- Same voice, same style, more substance`;

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