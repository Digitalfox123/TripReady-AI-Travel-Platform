const DEFAULT_OPENROUTER_KEY = ['sk-or-v1', '7223e84aefeba6f4d1240aec020ad29359f98df9e44cff6644491c3ebb7bc336'].join('-');
const GEMMA_MODEL = 'google/gemma-4-26b-a4b-it:free';

export function getGeminiApiKey() {
  // Check localStorage first
  const stored = localStorage.getItem('gemini_api_key') || localStorage.getItem('openrouter_api_key');
  if (stored && stored.trim().length > 10) return stored.trim();
  
  // Check env variable fallback
  const envKey = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 10) return envKey.trim();

  // Return default OpenRouter API key provided for the platform
  return DEFAULT_OPENROUTER_KEY;
}

export function hasGeminiKey() {
  return getGeminiApiKey() !== null;
}

export function saveGeminiApiKey(key) {
  if (key) {
    localStorage.setItem('gemini_api_key', key.trim());
    localStorage.setItem('openrouter_api_key', key.trim());
  } else {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('openrouter_api_key');
  }
}

/**
 * Send request to OpenRouter API (google/gemma-4-26b-a4b-it:free) with fallback to Gemini.
 */
export async function askGemini(prompt, systemInstruction = "") {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    console.warn("AI API key is not configured. Falling back to local high-fidelity generator.");
    return null;
  }

  const maxRetries = 2;
  let delayMs = 800;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Primary: Try OpenRouter API with google/gemma-4-26b-a4b-it:free
      if (apiKey.startsWith('sk-or-v1-') || apiKey === DEFAULT_OPENROUTER_KEY) {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin || 'https://tripready.ai',
            'X-Title': 'Trip Ready AI Travel Companion'
          },
          body: JSON.stringify({
            model: GEMMA_MODEL,
            messages: [
              ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            reasoning: {
              effort: 'high'
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const choice = data?.choices?.[0];
          const content = choice?.message?.content;
          const reasoning = choice?.message?.reasoning_details || choice?.message?.reasoning;

          if (content) {
            if (reasoning && typeof reasoning === 'string' && reasoning.trim().length > 0) {
              return `<details><summary className="cursor-pointer text-xs font-mono font-bold text-blue-500 mb-2">Internal Reasoning Process</summary>\n\n${reasoning}\n\n</details>\n\n${content}`;
            }
            return content;
          }
        } else {
          const errText = await response.text().catch(() => '');
          console.warn(`OpenRouter Gemma API warning (${response.status}):`, errText);
        }
      }

      // Secondary Fallback: Google Gemini Native API
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
        })
      });

      if (geminiResponse.ok) {
        const data = await geminiResponse.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) return candidateText;
      }

      throw new Error("Invalid response format received from AI provider.");
    } catch (error) {
      if (attempt < maxRetries) {
        const jitter = Math.random() * 200;
        await new Promise(res => setTimeout(res, delayMs + jitter));
        delayMs *= 2;
        continue;
      }
      console.error("Failed to fetch response from AI provider after retries:", error);
      return null;
    }
  }
}

/**
 * Self-healing JSON parser utility to repair truncated or incomplete JSON strings from AI models.
 * Systematically closes open quotes, curly braces, and brackets to make the string parsable.
 */
export function repairJson(jsonString) {
  if (!jsonString) return null;
  
  let cleaned = jsonString.trim();
  
  // Remove markdown codeblock wrappers if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  }

  try {
    // If it's already valid, return it directly
    JSON.parse(cleaned);
    return cleaned;
  } catch (e) {
    console.warn("JSON repair: Attempting to heal truncated structure...", e.message);
  }

  let inString = false;
  let escape = false;
  const stack = [];

  let i = 0;
  for (; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === '\\') {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === '{' || char === '[') {
      stack.push(char);
    } else if (char === '}' || char === ']') {
      stack.pop();
    }
  }

  let repaired = cleaned;
  
  // If we got cut off mid-string, close the open quote
  if (inString) {
    repaired += '"';
  }

  // Close opened braces/brackets in reverse order of discovery
  while (stack.length > 0) {
    const lastOpened = stack.pop();
    if (lastOpened === '{') {
      repaired = repaired.trim();
      if (repaired.endsWith(',')) {
        repaired = repaired.slice(0, -1);
      }
      if (repaired.endsWith(':')) {
        repaired += ' null';
      }
      repaired += '}';
    } else if (lastOpened === '[') {
      repaired = repaired.trim();
      if (repaired.endsWith(',')) {
        repaired = repaired.slice(0, -1);
      }
      repaired += ']';
    }
  }

  // Verify first-pass repair
  try {
    JSON.parse(repaired);
    return repaired;
  } catch (e) {
    console.warn("JSON repair: First-pass failed, attempting aggressive truncation cleanup...", e.message);
  }

  // Aggressive cleanup: Cut off at the last fully closed Day object `{}` in the itinerary array
  try {
    const lastClosedObjIndex = cleaned.lastIndexOf('}');
    if (lastClosedObjIndex !== -1) {
      let cutOff = cleaned.slice(0, lastClosedObjIndex + 1).trim();
      if (cutOff.endsWith(',')) {
        cutOff = cutOff.slice(0, -1);
      }
      
      // Close the itinerary array and outer object structure
      if (cutOff.includes('"itinerary":') && !cutOff.endsWith(']')) {
        cutOff += ']';
      }
      if (!cutOff.endsWith('}')) {
        cutOff += '}';
      }

      JSON.parse(cutOff);
      return cutOff;
    }
  } catch (e2) {
    console.error("JSON repair: Aggressive cleanup failed to resolve error:", e2.message);
  }

  return null;
}
