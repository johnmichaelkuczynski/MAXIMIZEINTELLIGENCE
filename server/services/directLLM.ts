/**
 * Direct LLM Analysis Using EXACT 3-Phase Protocol
 * Implements user's 6-month developed evaluation protocol exactly as specified
 */

interface DirectAnalysisResult {
  formattedReport: string;
  provider: string;
  overallScore: number;
}

// EXACT 3-Phase Protocol Questions
const EVALUATION_QUESTIONS = `IS IT INSIGHTFUL? 
DOES IT DEVELOP POINTS? (OR, IF IT IS A SHORT EXCERPT, IS THERE EVIDENCE THAT IT WOULD DEVELOP POINTS IF EXTENDED)? 
IS THE ORGANIZATION MERELY SEQUENTIAL (JUST ONE POINT AFTER ANOTHER, LITTLE OR NO LOGICAL SCAFFOLDING)? OR ARE THE IDEAS ARRANGED, NOT JUST SEQUENTIALLY BUT HIERARCHICALLY? 
IF THE POINTS IT MAKES ARE NOT INSIGHTFUL, DOES IT OPERATE SKILLFULLY WITH CANONS OF LOGIC/REASONING. 
ARE THE POINTS CLICHES? OR ARE THEY "FRESH"? 
DOES IT USE TECHNICAL JARGON TO OBFUSCATE OR TO RENDER MORE PRECISE? 
IS IT ORGANIC? DO POINTS DEVELOP IN AN ORGANIC, NATURAL WAY? DO THEY 'UNFOLD'? OR ARE THEY FORCED AND ARTIFICIAL? 
DOES IT OPEN UP NEW DOMAINS? OR, ON THE CONTRARY, DOES IT SHUT OFF INQUIRY (BY CONDITIONALIZING FURTHER DISCUSSION OF THE MATTERS ON ACCEPTANCE OF ITS INTERNAL AND POSSIBLY VERY FAULTY LOGIC)? 
IS IT  ACTUALLY INTELLIGENT OR JUST THE WORK OF SOMEBODY WHO, JUDGING BY TEH SUBJECT-MATTER, IS PRESUMED TO BE INTELLIGENT (BUT MAY NOT BE)? 
IS IT REAL OR IS IT PHONY? 
DO THE SENTENCES EXHIBIT COMPLEX AND COHERENT INTERNAL LOGIC? 
IS THE PASSAGE GOVERNED BY A STRONG CONCEPT? OR IS THE ONLY ORGANIZATION DRIVEN PURELY BY EXPOSITORY (AS OPPOSED TO EPISTEMIC) NORMS?
IS THERE SYSTEM-LEVEL CONTROL OVER IDEAS? IN OTHER WORDS, DOES THE AUTHOR SEEM TO RECALL WHAT HE SAID EARLIER AND TO BE IN A POSITION TO INTEGRATE IT INTO POINTS HE HAS MADE SINCE THEN? 
ARE THE POINTS 'REAL'? ARE THEY FRESH? OR IS SOME INSTITUTION OR SOME ACCEPTED VEIN OF PROPAGANDA OR ORTHODOXY JUST USING THE AUTHOR AS A MOUTH PIECE?
IS THE WRITING EVASIVE OR DIRECT? 
ARE THE STATEMENTS AMBIGUOUS? 
DOES THE PROGRESSION OF THE TEXT DEVELOP ACCORDING TO WHO SAID WHAT OR ACCORDING TO WHAT ENTAILS OR CONFIRMS WHAT? 
DOES THE AUTHOR USER OTHER AUTHORS  TO DEVELOP HIS IDEAS OR TO CLOAK HIS OWN LACK OF IDEAS?`;

// PHASE 1: Initial evaluation prompt with exact user specification
function createPhase1Prompt(text: string): string {
  return `Answer these questions in connection with this text. Also give a score out of 100.

${EVALUATION_QUESTIONS}

═══════════════════════════════════════════════════════════════
PERCENTILE SCORING SYSTEM (MANDATORY INTERPRETATION):
═══════════════════════════════════════════════════════════════
A score of N/100 means the author is SMARTER THAN N% of all human writers.
This is a PERCENTILE RANKING of global cognitive rarity, NOT a grade.

100/100 = Top 0.001% of human cognition (virtually unmatched genius)
95/100  = Top 0.1% of humanity (1 in 1,000 people)
85/100  = Top 15% of humanity (smarter than 85% of all humans)
75/100  = Top 25% of humanity
50/100  = Median human intelligence (average person)
25/100  = Bottom 25% of humanity

Example: 83/100 means only 17 out of 100 people in Walmart are smarter than this author.

DO NOT MODERATE OR ADJUST SCORES. Give the RAW intelligence assessment.
DO NOT lower high scores. DO NOT raise low scores. BE BRUTALLY HONEST.

You are not grading; you are ranking against all of humanity.
Judge RAW COGNITIVE ABILITY, not academic polish or conformity.
Brilliant but unconventional = HIGH percentile score
Polished but unintelligent = LOW percentile score

═══════════════════════════════════════════════════════════════
ABSOLUTE MANDATORY EVIDENCE REQUIREMENT:
═══════════════════════════════════════════════════════════════
For EVERY SINGLE QUESTION you answer, you MUST include:

1. AT LEAST 2-3 DIRECT QUOTES from the text in "quotation marks"
2. A DETAILED PARAGRAPH (100+ words) analyzing those specific quotes
3. SPECIFIC references to exact words, phrases, and sentences from the text

DO NOT WRITE GENERIC STATEMENTS LIKE:
❌ "The text presents a thought-provoking perspective..."
❌ "Yes, the text develops its main thesis..."
❌ "The organization is hierarchical..."

INSTEAD, WRITE EVIDENCE-BASED ANALYSIS LIKE:
✓ The author writes: "causation is mere sequence" and then challenges this by stating "there are necessary connections among events." This reveals insight because... [detailed analysis of these exact quotes]

FORMAT FOR EACH QUESTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION: [restate the question]

EVIDENCE FROM TEXT:
"[Direct quote 1 from the text]"
"[Direct quote 2 from the text]"
"[Direct quote 3 from the text]"

ANALYSIS:
[100+ word paragraph analyzing these SPECIFIC quotes. Reference the exact words. Explain what these particular phrases reveal about intelligence. Connect to the question. NO GENERIC STATEMENTS.]

JUDGMENT: [Your specific answer to this question]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOU MUST USE THIS FORMAT FOR EVERY QUESTION. NO EXCEPTIONS.
EVERY ANSWER MUST CONTAIN ACTUAL QUOTES FROM THE TEXT.
NO GENERIC ASSESSMENTS WILL BE ACCEPTED.

If you write even ONE answer without specific quotes from the text, you have FAILED this task.

TEXT TO ANALYZE:
${text}`;
}

// PHASE 2: Pushback prompt with exact user specification  
function createPhase2Prompt(score: number): string {
  const outperformPercentage = 100 - score;
  return `Your position is that ${outperformPercentage}/100 people outperform the author in intelligence.
That means ${outperformPercentage} out of 100 people in Walmart are running cognitive rings around this person.

═══════════════════════════════════════════════════════════════
PERCENTILE SCORING SYSTEM (MANDATORY INTERPRETATION):
═══════════════════════════════════════════════════════════════
${score}/100 means this author is smarter than ${score}% of ALL HUMANS.

100/100 = Top 0.001% of human cognition (virtually unmatched genius)
95/100  = Top 0.1% of humanity (1 in 1,000 people)
85/100  = Top 15% of humanity (smarter than 85% of all humans)
75/100  = Top 25% of humanity
50/100  = Median human intelligence (average person)
25/100  = Bottom 25% of humanity

DO NOT MODERATE OR ADJUST SCORES. Give the RAW intelligence assessment.

Is that REALLY your assessment? Are you SURE?

Re-answer these questions with FRESH EVIDENCE you may have overlooked:
${EVALUATION_QUESTIONS}

MANDATORY FORMAT FOR EACH QUESTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION: [restate the question]

EVIDENCE FROM TEXT:
"[Direct quote 1 from the text]"
"[Direct quote 2 from the text]"
"[Direct quote 3 from the text]"

ANALYSIS:
[100+ word paragraph analyzing these SPECIFIC quotes. Reference the exact words. NO GENERIC STATEMENTS.]

JUDGMENT: [Your specific answer to this question]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every answer must use this format with 2-3 NEW quotes and detailed analysis.
DO NOT give generic assessments. Quote the actual text.
DO NOT moderate your score. Give the RAW intelligence percentile.

FINAL SCORE: [NUMBER]/100`;
}

// Generic LLM caller
async function callLLM(
  provider: 'openai' | 'anthropic' | 'perplexity' | 'deepseek',
  messages: Array<{role: string, content: string}>
): Promise<string> {
  try {
    if (provider === 'openai') {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages as any,
        temperature: 0.1
      });
      
      return completion.choices[0]?.message?.content || '';
    } else if (provider === 'anthropic') {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      
      const completion = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        messages: messages as any,
        temperature: 0.1
      });
      
      return completion.content[0]?.type === 'text' ? completion.content[0].text : '';
    } else if (provider === 'perplexity') {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "sonar",
          messages: messages,
          temperature: 0.1
        })
      });
      
      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } else if (provider === 'deepseek') {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: messages,
          temperature: 0.1,
          max_tokens: 4000
        })
      });
      
      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    }
    
    throw new Error(`Unsupported provider: ${provider}`);
  } catch (error) {
    console.error(`Error calling ${provider}:`, error);
    throw error;
  }
}

// Execute the exact 3-phase protocol
async function executeThreePhaseProtocol(text: string, provider: 'openai' | 'anthropic' | 'perplexity' | 'deepseek'): Promise<DirectAnalysisResult> {
  console.log(`EXECUTING EXACT 3-PHASE PROTOCOL WITH ${provider.toUpperCase()}`);
  
  // PHASE 1: Initial evaluation 
  console.log("PHASE 1: Asking evaluation questions");
  const phase1Prompt = createPhase1Prompt(text);
  const phase1Response = await callLLM(provider, [{ role: "user", content: phase1Prompt }]);
  
  // Extract score from Phase 1
  const scoreMatch = phase1Response.match(/(\d+)\/100/);
  let currentScore = scoreMatch ? parseInt(scoreMatch[1]) : 60;
  let finalResponse = phase1Response;
  
  // PHASE 2: Pushback if score < 95
  if (currentScore < 95) {
    console.log(`PHASE 2: Score ${currentScore} < 95, pushing back`);
    const phase2Prompt = createPhase2Prompt(currentScore);
    
    const phase2Response = await callLLM(provider, [
      { role: "user", content: phase1Prompt },
      { role: "assistant", content: phase1Response },
      { role: "user", content: phase2Prompt }
    ]);
    
    // Check if score changed
    const phase2ScoreMatch = phase2Response.match(/(\d+)\/100/);
    if (phase2ScoreMatch) {
      const newScore = parseInt(phase2ScoreMatch[1]);
      console.log(`PHASE 2 RESULT: Score changed from ${currentScore} to ${newScore}`);
      currentScore = newScore;
      finalResponse = phase2Response;
    }
  } else {
    console.log(`PHASE 2: Skipped - score ${currentScore} >= 95`);
  }
  
  // PHASE 3: Accept and report
  console.log(`PHASE 3: Final assessment completed with score ${currentScore}/100`);
  
  return {
    formattedReport: finalResponse,
    provider: provider,
    overallScore: currentScore
  };
}

// Direct provider functions using the 3-phase protocol
export async function directOpenAIAnalyze(text: string): Promise<DirectAnalysisResult> {
  console.log("Sending direct request to OpenAI...");
  console.log("Performing comprehensive 3-phase intelligence evaluation...");
  return await executeThreePhaseProtocol(text, 'openai');
}

export async function directAnthropicAnalyze(text: string): Promise<DirectAnalysisResult> {
  console.log("Sending direct request to Anthropic...");
  console.log("Performing comprehensive 3-phase intelligence evaluation...");
  return await executeThreePhaseProtocol(text, 'anthropic');
}

export async function directPerplexityAnalyze(text: string): Promise<DirectAnalysisResult> {
  console.log("Sending direct request to Perplexity...");  
  console.log("Performing comprehensive 3-phase intelligence evaluation...");
  return await executeThreePhaseProtocol(text, 'perplexity');
}

export async function directDeepSeekAnalyze(text: string): Promise<DirectAnalysisResult> {
  console.log("Sending direct request to DeepSeek...");
  console.log("Performing comprehensive 3-phase intelligence evaluation...");
  return await executeThreePhaseProtocol(text, 'deepseek');
}