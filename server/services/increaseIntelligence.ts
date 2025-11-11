// Increase Intelligence Function - Expands text with empirical grounding and explicit reasoning
// Based on intelligence maximization specifications

export interface IncreaseIntelligenceRequest {
  text: string;
  provider: string;
}

export interface IncreaseIntelligenceResult {
  originalText: string;
  expandedText: string;
  originalWordCount: number;
  expandedWordCount: number;
  expansionRatio: number;
  provider: string;
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

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export async function performIncreaseIntelligence(request: IncreaseIntelligenceRequest): Promise<IncreaseIntelligenceResult> {
  const { text, provider: rawProvider } = request;
  const provider = mapZhiToProvider(rawProvider);
  
  console.log(`Starting intelligence increase with ${provider}`);
  console.log(`Original text length: ${text.length} characters, ${countWords(text)} words`);
  
  // Intelligence Maximization Prompt - Based on specification document
  const prompt = `INTELLIGENCE MAXIMIZATION TASK

CRITICAL INSTRUCTIONS

Your task is to transform the input text by MAXIMIZING INTELLIGENCE through:

1. EXPANSION (4-6x word count) - Every sentence becomes multiple sentences or paragraphs
2. EMPIRICAL GROUNDING - Add real studies, experiments, data, and research findings
3. MAXIMAL EXPLICITNESS - Unpack every logical step, spell out every inference
4. CITATIONS - Reference real research from cognitive science, neuroscience, psychology, etc.
5. PRESERVE ARGUMENTS - Keep all original points, never simplify or condense

WHAT TO DO

Principle 1: EXPAND EVERY SENTENCE

Take each sentence and:
- Break it into multiple sentences
- Elaborate each point in detail
- Add supporting paragraphs
- Develop implicit implications

Example:
INPUT: "Most people operate on the assumption that group psychology is to be understood in terms of individual psychology."

OUTPUT: "Most people, including most psychologists, operate on the assumption that group psychology is to be understood in terms of individual psychology. This methodological individualism posits that collective behavior emerges from the aggregation of individual motivations, preferences, and decision-making processes. The implicit model here is one of reduction: collective behavior is treated as an epiphenomenon—a mere aggregate or distortion of underlying individual psychological processes. This framework assumes that if we fully understand individual psychology, we can explain group phenomena simply by summing up or combining individual-level explanations."

Principle 2: ADD EMPIRICAL GROUNDING

For every significant claim, add:
- Specific studies with researchers' names and years
- Quantitative data (percentages, sample sizes, effect sizes)
- Research paradigms (e.g., "habituation studies," "masked priming," "neuroimaging")
- Specific findings (e.g., "75% of participants," "150-200ms latencies")
- Brain regions if relevant (e.g., "VWFA in left fusiform gyrus")
- Patient populations if relevant (e.g., "acquired dyslexia," "semantic dementia")

Example:
INPUT: "But this cannot be reconciled with the high degree of conformism exhibited by people."

OUTPUT: "However, this framework cannot be reconciled with the high degree of conformism exhibited by people. Solomon Asch's classic conformity experiments revealed that approximately 75% of participants conformed to obviously incorrect group judgments at least once, with about 32% of all responses conforming to the erroneous majority. The conformity occurred even when the correct answer was perceptually obvious, with discrepancies of several inches visible to anyone with normal vision. This suggests that the drive to conform operates independently of, and often in opposition to, individual survival-oriented reasoning."

Principle 3: MAKE IMPLICIT EXPLICIT

Use these techniques:
- Number premises in arguments: "Premise 1:..., Premise 2:..., Conclusion:..."
- Use phrases like "Let us make this completely explicit..."
- State inferential connections: "This follows from...", "Therefore...", "Given that..."
- Define all technical terms
- Spell out logical steps
- Anticipate and address objections
- Provide multiple examples for abstract concepts

Example:
INPUT: "It is viciously regressive to suppose that information-bearing mental entities are categorically in the nature of representations."

OUTPUT: "It is viciously regressive to suppose that information-bearing mental entities are categorically in the nature of representations, as opposed to presentations. Let us make the regress argument completely explicit through a step-by-step derivation:

Premise 1: If mental state M is a representation, then accessing M's content requires an interpretive process D that decodes M.

Premise 2: Process D is itself a mental operation that must have representational content (namely, the interpretation rules).

Premise 3: By Premise 1, accessing D's content requires another interpretive process D2.

Premise 4: This generates an infinite regress (D requires D2, which requires D3, ad infinitum).

Conclusion: Therefore, not all information-bearing mental entities can be representations; some must be presentations (directly accessible without decoding)."

WHAT NOT TO DO

DO NOT simplify - Never make the text shorter or more accessible
DO NOT condense - Never reduce complexity or combine points
DO NOT paraphrase without adding - Don't just reword, ADD SUBSTANCE
DO NOT use vague language - Replace "studies show" with specific citations
DO NOT leave claims unsupported - Every assertion needs empirical backing

TARGET SPECIFICATIONS

- Length: Expand original by 4-6x word count minimum
- Structure: Use numbered premises, section headers, explicit logical connectives
- Evidence: At least 5-10 specific empirical references with quantitative data
- Explicitness: Every inferential step stated, every assumption made explicit
- Technical precision: Define terms, use precise language, maintain rigor

INPUT TEXT TO EXPAND

${text}

OUTPUT FORMAT - CRITICAL

ABSOLUTELY NO MARKDOWN FORMATTING:
- NO headers (###, ##, #)
- NO bold (**text**)
- NO italics (*text*)
- NO bullet points (-, *, •)
- NO numbered lists with markdown
- Use plain text ONLY

For structure:
- Use blank lines to separate paragraphs
- Use "Premise 1:", "Premise 2:" for numbered items (plain text, not markdown)
- Use ALL CAPS for section labels if needed (e.g., "EMPIRICAL EVIDENCE:")
- Use quotation marks for emphasis instead of bold/italics

OUTPUT

Provide ONLY the expanded text in PLAIN TEXT format with ZERO markdown. Begin immediately with the enhanced version. NO preamble, NO meta-commentary, NO "Here's an expanded version..." - just start with the expanded text itself.`;


  let expandedText: string;
  
  try {
    if (provider === 'openai') {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 4000
      });
      
      expandedText = completion.choices[0]?.message?.content || "No response generated";
      
    } else if (provider === 'anthropic') {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }]
      });
      
      expandedText = response.content[0].type === 'text' ? response.content[0].text : "No response generated";
      
    } else if (provider === 'deepseek') {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 4000
        })
      });
      
      const data = await response.json();
      expandedText = data.choices?.[0]?.message?.content || "No response generated";
      
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
    const originalWordCount = countWords(text);
    const expandedWordCount = countWords(expandedText);
    const expansionRatio = expandedWordCount / originalWordCount;
    
    console.log(`Expansion complete:`);
    console.log(`  Original: ${originalWordCount} words`);
    console.log(`  Expanded: ${expandedWordCount} words`);
    console.log(`  Ratio: ${expansionRatio.toFixed(2)}x`);
    
    return {
      originalText: text,
      expandedText,
      originalWordCount,
      expandedWordCount,
      expansionRatio,
      provider
    };
    
  } catch (error) {
    console.error(`Intelligence increase error:`, error);
    throw error;
  }
}
