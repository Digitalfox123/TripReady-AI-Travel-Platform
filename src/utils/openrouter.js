// ── OPENROUTER AI CHATBOT ENGINE CONNECTOR ──────────────────────────────────
// Model: nvidia/nemotron-3-super-120b-a12b:free via OpenRouter API

const OPENROUTER_MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';

export function getOpenRouterApiKey() {
  const stored = localStorage.getItem('openrouter_api_key');
  if (stored && stored.trim().length > 10) return stored.trim();
  
  const envKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (envKey && envKey.trim().length > 10) return envKey.trim();

  if (typeof window !== 'undefined' && window.__OPENROUTER_KEY__) {
    return window.__OPENROUTER_KEY__;
  }

  return null;
}

export function hasOpenRouterKey() {
  return getOpenRouterApiKey() !== null;
}

export function saveOpenRouterApiKey(key) {
  if (key && key.trim().length > 0) {
    localStorage.setItem('openrouter_api_key', key.trim());
  } else {
    localStorage.removeItem('openrouter_api_key');
  }
}

/**
 * Send chat request to OpenRouter API (supports streaming & reasoning tokens)
 * Model: nvidia/nemotron-3-super-120b-a12b:free
 */
export async function askOpenRouter({
  messages = [],
  systemInstruction = "",
  prompt = "",
  onChunk = null,
  enableReasoning = true,
  temperature = 0.7,
  maxTokens = 8192
}) {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    console.warn("OpenRouter API key not configured.");
    return null;
  }

  // Format payload messages
  const formattedMessages = [];

  if (systemInstruction) {
    formattedMessages.push({
      role: 'system',
      content: systemInstruction
    });
  }

  if (messages && messages.length > 0) {
    messages.forEach(m => {
      formattedMessages.push({
        role: m.role || (m.sender === 'user' ? 'user' : 'assistant'),
        content: m.content || m.text
      });
    });
  } else if (prompt) {
    formattedMessages.push({
      role: 'user',
      content: prompt
    });
  }

  const payload = {
    model: OPENROUTER_MODEL,
    messages: formattedMessages,
    temperature,
    max_tokens: maxTokens,
    stream: Boolean(onChunk),
    ...(enableReasoning ? { reasoning: { effort: "high" } } : {})
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'HTTP-Referer': window.location.origin || 'https://tripready.ai',
    'X-Title': 'Trip Ready AI Travel Platform'
  };

  const maxRetries = 2;
  let delayMs = 1000;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("OpenRouter API returned error status:", response.status, errData);

        if ((response.status === 503 || response.status === 429) && attempt < maxRetries) {
          const finalDelay = delayMs + Math.random() * 300;
          console.warn(`OpenRouter API busy/rate-limited (${response.status}). Retrying in ${Math.round(finalDelay)}ms...`);
          await new Promise(res => setTimeout(res, finalDelay));
          delayMs *= 2;
          continue;
        }

        throw new Error(errData?.error?.message || `OpenRouter API error ${response.status}`);
      }

      // If streaming response handler provided
      if (onChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullText = "";
        let reasoningText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

          for (const line of lines) {
            const jsonStr = line.replace(/^data:\s*/, '').trim();
            if (jsonStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const delta = parsed.choices?.[0]?.delta;
              const content = delta?.content || "";
              const reasoning = delta?.reasoning || parsed.choices?.[0]?.reasoning || "";

              if (reasoning) {
                reasoningText += reasoning;
              }
              if (content) {
                fullText += content;
                onChunk(content, fullText, reasoningText);
              }
            } catch (e) {
              // Ignore partial JSON parse chunks
            }
          }
        }

        if (reasoningText && !fullText.includes('<details>')) {
          fullText = `<details><summary>Thought Process</summary>\n\n${reasoningText.trim()}\n\n</details>\n\n${fullText}`;
        }

        return fullText;
      }

      // Standard Non-Streaming JSON Response
      const data = await response.json();
      const choice = data?.choices?.[0];
      let content = choice?.message?.content || "";
      const reasoning = choice?.message?.reasoning || choice?.reasoning || data?.reasoning_details;

      if (reasoning && typeof reasoning === 'string' && !content.includes('<details>')) {
        content = `<details><summary>Thought Process</summary>\n\n${reasoning.trim()}\n\n</details>\n\n${content}`;
      }

      return content;

    } catch (error) {
      if (attempt < maxRetries) {
        const finalDelay = delayMs + Math.random() * 300;
        console.warn(`OpenRouter call failed: ${error.message}. Retrying in ${Math.round(finalDelay)}ms...`);
        await new Promise(res => setTimeout(res, finalDelay));
        delayMs *= 2;
        continue;
      }
      console.error("Failed to fetch response from OpenRouter API:", error);
      return null;
    }
  }
}
