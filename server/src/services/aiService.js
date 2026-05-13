const OpenAI = require('openai');

// ─── OpenAI client (singleton) ───────────────────────────────────────────────
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ─── Constants ────────────────────────────────────────────────────────────────
const VALID_CATEGORIES = [
  'Website Development',
  'Mobile App Development',
  'SEO/Marketing',
  'E-Commerce',
  'CRM/Software',
  'Support',
  'Partnership',
  'General Inquiry',
];

const VALID_PRIORITIES = ['High', 'Medium', 'Low'];

const DEFAULT_RESULT = {
  aiSummary: null,
  category: 'General Inquiry',
  priority: 'Medium',
  aiEnriched: false,
};

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a lead classification assistant for a digital agency.
Analyze the customer's message and service type, then return a JSON object with exactly these fields:
- aiSummary: A 1-2 sentence plain-English summary of what the customer needs.
- category: Exactly one of [Website Development, Mobile App Development, SEO/Marketing, E-Commerce, CRM/Software, Support, Partnership, General Inquiry].
- priority: Exactly one of [High, Medium, Low].

Priority guidelines:
  - High  → message contains urgency words like: urgent, urgently, ASAP, immediately, critical, deadline, today, emergency.
  - Low   → message contains low-urgency phrases like: whenever, no rush, exploring, curious, just wondering.
  - Medium → everything else.

Respond ONLY with valid JSON. No markdown, no extra text, no code fences.`;

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Enriches a lead with AI-generated summary, category, and priority.
 *
 * @param {object} params
 * @param {string} params.message     - The raw customer message.
 * @param {string} params.serviceType - The service type selected by the customer.
 * @returns {Promise<{aiSummary: string|null, category: string, priority: string, aiEnriched: boolean}>}
 */
async function enrichLead({ message, serviceType }) {
  // Guard: skip API call if key is not configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn('[aiService] OPENAI_API_KEY not set — using default values.');
    return DEFAULT_RESULT;
  }

  try {
    const userPrompt = `Service Type: ${serviceType || 'Not specified'}\nCustomer Message: ${message}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.2,        // Low temperature for consistent, deterministic output
      max_tokens: 200,
      response_format: { type: 'json_object' }, // Enforces JSON output (gpt-3.5-turbo+)
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error('Empty response from OpenAI.');

    const parsed = JSON.parse(raw);

    // Validate and sanitize the returned fields
    const aiSummary = typeof parsed.aiSummary === 'string' && parsed.aiSummary.trim()
      ? parsed.aiSummary.trim()
      : null;

    const category = VALID_CATEGORIES.includes(parsed.category)
      ? parsed.category
      : 'General Inquiry';

    const priority = VALID_PRIORITIES.includes(parsed.priority)
      ? parsed.priority
      : 'Medium';

    console.log(`[aiService] Lead enriched ✓  category="${category}"  priority="${priority}"`);

    return { aiSummary, category, priority, aiEnriched: true };

  } catch (error) {
    // Log the error but do NOT throw — let the lead save with defaults
    console.error('[aiService] OpenAI enrichment failed. Falling back to defaults.', {
      error: error.message,
      status: error?.status,
    });
    return DEFAULT_RESULT;
  }
}

module.exports = { enrichLead };
