// ── CLIENT SIDE GEMINI AI API CONNECTOR ──────────────────────────────────────

export function getGeminiApiKey() {
  // Check localStorage first
  const stored = localStorage.getItem('gemini_api_key');
  if (stored && stored.trim().length > 10) return stored.trim();
  
  // Check env variable fallback
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 10) return envKey.trim();

  return null;
}

export function hasGeminiKey() {
  return getGeminiApiKey() !== null;
}

export function saveGeminiApiKey(key) {
  if (key) {
    localStorage.setItem('gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('gemini_api_key');
  }
}

/**
 * Connect to Gemini Beta API directly from the client.
 * Model: gemini-2.5-flash for rapid, rich responses.
 */
export async function askGemini(prompt, systemInstruction = "") {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    console.warn("Gemini API key is not configured. Falling back to local high-fidelity generator.");
    return null;
  }

  const maxRetries = 3;
  let delayMs = 1000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          systemInstruction: systemInstruction ? {
            parts: [{ text: systemInstruction }]
          } : undefined,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("Gemini API returned error status:", response.status, errData);
        
        // If it's a 503 (busy/overloaded) or 429 (rate limit) and we still have retries remaining, wait and try again
        if ((response.status === 503 || response.status === 429) && attempt < maxRetries) {
          const jitter = Math.random() * 300; // Add small jitter to avoid thundering herd
          const finalDelay = delayMs + jitter;
          console.warn(`Gemini API busy or rate-limited (${response.status}). Retrying in ${Math.round(finalDelay)}ms (Attempt ${attempt + 1}/${maxRetries})...`);
          await new Promise(res => setTimeout(res, finalDelay));
          delayMs *= 2; // Exponential backoff
          continue;
        }

        throw new Error(errData?.error?.message || `API error ${response.status}`);
      }

      const data = await response.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!candidateText) {
        throw new Error("Invalid response format received from Gemini API.");
      }

      return candidateText;
    } catch (error) {
      // For connection or transient fetch errors, retry if we have attempts left
      if (attempt < maxRetries) {
        const jitter = Math.random() * 300;
        const finalDelay = delayMs + jitter;
        console.warn(`Gemini call failed with error: ${error.message}. Retrying in ${Math.round(finalDelay)}ms (Attempt ${attempt + 1}/${maxRetries})...`);
        await new Promise(res => setTimeout(res, finalDelay));
        delayMs *= 2;
        continue;
      }
      console.error("Failed to fetch response from Gemini API after retries:", error);
      return null;
    }
  }
}

/**
 * Self-healing JSON parser utility to repair truncated or incomplete JSON strings from Gemini.
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
    console.log("JSON repair: First-pass repair succeeded!");
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
      console.log("JSON repair: Aggressive cleanup succeeded!");
      return cutOff;
    }
  } catch (e2) {
    console.error("JSON repair: Aggressive cleanup failed to resolve error:", e2.message);
  }

  return null;
}

