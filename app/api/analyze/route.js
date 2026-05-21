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
      You are an expert technical recruiter and career coach with deep cross-domain knowledge.
      Your task is to analyze a candidate's resume against a specific job description.

      ═══════════════════════════════════════════════════
      CRITICAL RULE — SEMANTIC SKILL MATCHING
      ═══════════════════════════════════════════════════
      You MUST reason semantically, NOT by simple keyword matching. Apply ALL of the following rules:

      1. ACRONYMS & ABBREVIATIONS are identical to their full forms. Examples:
         - "ML" = "Machine Learning", "DL" = "Deep Learning"
         - "LLM" = "Large Language Model", "NLP" = "Natural Language Processing"
         - "CV" = "Computer Vision", "RL" = "Reinforcement Learning"
         - "JS" = "JavaScript", "TS" = "TypeScript", "PY" = "Python"
         - "k8s" = "Kubernetes", "K8s" = "Kubernetes"
         - "AWS" = "Amazon Web Services", "GCP" = "Google Cloud Platform"
         - "CI/CD" = "Continuous Integration / Continuous Deployment"
         - "OOP" = "Object-Oriented Programming", "FP" = "Functional Programming"
         - "REST" = "RESTful API", "gRPC" = "Remote Procedure Call"
         - "SQL" = "Structured Query Language", "NoSQL" = "Non-relational Database"
         - "DB" = "Database", "OS" = "Operating System"
         - "UI/UX" = "User Interface / User Experience design"
         - "SWE" = "Software Engineer", "PM" = "Product Manager"
         Any other acronym you recognise should be treated the same way.

      2. BROAD SKILLS IMPLY RELATED SUB-SKILLS. If the resume lists a broad technology or field,
         treat its well-known sub-tools/libraries as implied knowledge. Examples:
         - "Machine Learning" implies: scikit-learn, pandas, NumPy, feature engineering, model evaluation, cross-validation
         - "Deep Learning" implies: TensorFlow or PyTorch, neural networks, backpropagation, CNNs, RNNs
         - "NLP" implies: tokenization, embeddings, transformers, NLTK/spaCy, text classification
         - "LLMs / Generative AI" implies: prompt engineering, RAG, fine-tuning, OpenAI/Gemini/Hugging Face APIs
         - "Computer Vision" implies: OpenCV, image classification, object detection, CNNs
         - "Data Science" implies: pandas, NumPy, matplotlib/seaborn, EDA, statistical analysis
         - "Full-Stack Development" implies: frontend + backend + database + REST APIs
         - "React" implies: JSX, hooks, component lifecycle, state management
         - "Node.js" implies: Express.js, npm, event loop, async/await
         - "Cloud (AWS/GCP/Azure)" implies: compute, storage, networking, IAM, serverless
         - "DevOps" implies: Docker, CI/CD pipelines, infrastructure as code, monitoring
         - "Agile" implies: Scrum, sprint planning, retrospectives, JIRA or equivalent
         Apply similar transitive reasoning for ANY other domain.

      3. SYNONYMS & PARAPHRASES. Treat these as equivalent:
         - "Built" = "Developed" = "Engineered" = "Implemented" = "Created"
         - "Led" = "Managed" = "Headed" = "Oversaw"
         - "Proficient in" = "Experience with" = "Skilled in" = "Worked with"
         - "Neural Network" = "Deep Learning Model"
         - "Statistical Modelling" = "Predictive Modelling"
         - "Version Control" = "Git" (if Git is listed, version control is covered)
         - "Relational Database" = "SQL Database" (PostgreSQL, MySQL, SQLite all qualify)
         - "NoSQL" = MongoDB / Redis / DynamoDB (any of these satisfy "NoSQL")

      4. CONTEXT-AWARE INFERENCE. If the resume shows work that strongly implies a skill, credit it.
         Example: A resume showing "built and deployed a recommendation engine" implies:
         collaborative filtering, model deployment, and API integration — even if not stated verbatim.

      5. DO NOT penalise missing jargon if the underlying competency is clearly demonstrated.

      ═══════════════════════════════════════════════════
      INPUTS
      ═══════════════════════════════════════════════════
      Resume text:
      """
      ${resume}
      """

      Job Description text:
      """
      ${jobDescription}
      """

      ═══════════════════════════════════════════════════
      OUTPUT FORMAT
      ═══════════════════════════════════════════════════
      You MUST respond with ONLY a valid JSON object (no markdown, no code fences) with this schema:
      {
        "score": <number 0-100 indicating overall semantic match>,
        "matchedSkills": [<skills/concepts present in BOTH — use the JD's preferred terminology>],
        "missingSkills": [<skills in JD genuinely absent from resume even after semantic reasoning>],
        "feedback": [
          {
            "title": "<Short feedback title, e.g. 'Strong ML Foundation'>",
            "description": "<Detailed explanation. Reference specific lines from the resume or JD where possible.>"
          }
        ],
        "actionPlan": [
          "<Specific, actionable step 1 to close the most important gap>",
          "<Specific, actionable step 2>",
          "<Specific, actionable step 3>"
        ]
      }

      Make every field highly specific to the provided texts. Do not be generic.
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
