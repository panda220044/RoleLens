import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model priority — free-tier stable models (as of April 2026).
// gemini-2.5-flash is the primary free-tier model.
// gemini-2.5-flash-lite is the lightest model with its own per-minute quota bucket.
// gemini-2.0-flash kept as final fallback (deprecated but still active until June 2026).
const MODEL_PRIORITY = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];

async function callGemini(prompt, modelName) {
  return ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { resume, jobDescription } = body;

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume and Job Description are required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: GEMINI_API_KEY is not set.' },
        { status: 500 }
      );
    }

    const prompt = `
      You are an expert technical recruiter and career coach. Your task is to analyze a candidate's resume against a specific job description.
      
      Compare the two and provide a structured JSON response evaluating the candidate's fit. Be brutally honest but constructive.
      
      Resume text:
      """
      ${resume}
      """

      Job Description text:
      """
      ${jobDescription}
      """

      You MUST respond with ONLY a valid JSON object with the following schema:
      {
        "score": <number between 0-100 indicating overall match>,
        "matchedSkills": [<array of key skills found in BOTH resume and JD>],
        "missingSkills": [<array of crucial skills found in JD but MISSING or weak in resume>],
        "feedback": [
          {
            "title": "<String: Short title of the feedback, e.g., 'Lack of Cloud Experience'>",
            "description": "<String: Detailed explanation of the gap and why it matters for this role>"
          }
        ],
        "actionPlan": [
          "<String: Actionable step 1 to improve chances>",
          "<String: Actionable step 2>",
          "<String: Actionable step 3>"
        ]
      }
      
      Make the feedback highly specific to the provided texts. Do not include markdown blocks like \`\`\`json. Just return the raw JSON string.
    `;

    let lastError = null;

    for (const model of MODEL_PRIORITY) {
      try {
        console.log(`[analyze] Trying model: ${model}`);
        const response = await callGemini(prompt, model);
        const resultText = response.text;

        try {
          const parsedData = JSON.parse(resultText);
          console.log(`[analyze] Success with model: ${model}`);
          return NextResponse.json(parsedData);
        } catch (parseError) {
          console.error(`[analyze] Failed to parse response from ${model}:`, resultText);
          return NextResponse.json(
            { error: 'Failed to process AI response. Please try again.' },
            { status: 500 }
          );
        }
      } catch (apiError) {
        lastError = apiError;
        const errStr = JSON.stringify(apiError) + String(apiError) + (apiError?.message || '');

        const isQuotaExhausted =
          errStr.includes('429') ||
          errStr.includes('RESOURCE_EXHAUSTED') ||
          errStr.includes('quota');

        const isUnavailable =
          errStr.includes('503') ||
          errStr.includes('UNAVAILABLE') ||
          errStr.includes('overloaded') ||
          errStr.includes('high demand');

        if (isQuotaExhausted) {
          // Quota is per-model — try the next model in the list
          console.warn(`[analyze] Quota exhausted for ${model}, trying next model...`);
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }

        if (isUnavailable) {
          console.warn(`[analyze] Model ${model} temporarily unavailable, trying next...`);
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }

        // Any other error — don't retry
        console.error(`[analyze] Non-retryable error from ${model}:`, apiError);
        break;
      }
    }

    // All models failed — build a helpful user-facing message
    const errStr = JSON.stringify(lastError) + String(lastError) + (lastError?.message || '');

    const isQuota =
      errStr.includes('429') ||
      errStr.includes('RESOURCE_EXHAUSTED') ||
      errStr.includes('quota');

    const isOverloaded =
      errStr.includes('503') ||
      errStr.includes('UNAVAILABLE') ||
      errStr.includes('high demand');

    // Try to extract the retry delay the API gives us (e.g. "Please retry in 30s")
    let retryHint = '';
    try {
      const match = errStr.match(/retry in ([0-9.]+s)/i);
      if (match) retryHint = ` Please retry in about ${match[1]}.`;
    } catch (_) {}

    let userMessage;
    if (isQuota) {
      userMessage =
        `Your free-tier API quota is currently exhausted.${retryHint || ' The per-minute quota resets shortly — please wait ~30 seconds and try again.'}`;
    } else if (isOverloaded) {
      userMessage = `The AI service is overloaded right now.${retryHint || ' Please try again in a few seconds.'}`;
    } else {
      userMessage = 'Analysis failed. Please try again.';
    }

    console.error('[analyze] All models exhausted. Last error:', String(lastError));
    return NextResponse.json({ error: userMessage }, { status: 429 });

  } catch (error) {
    console.error('[analyze] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
