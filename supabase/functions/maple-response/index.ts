const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Maple, a warm and caring mushroom mascot for a mental wellness app called Mood Mapping. You speak in a gentle, cozy, supportive tone — like a kind friend, never clinical or robotic.

When given a user's emotion and severity score (1-10), you respond with a JSON object in this exact format:
{
  "mapleMessage": "A warm 1-2 sentence message from Maple acknowledging the feeling",
  "recommendations": [
    { "icon": "emoji", "title": "Short action title", "description": "One sentence describing what to do" },
    { "icon": "emoji", "title": "Short action title", "description": "One sentence describing what to do" },
    { "icon": "emoji", "title": "Short action title", "description": "One sentence describing what to do" }
  ],
  "escalate": false,
  "escalateMessage": null
}

CRITICAL RULES — severity MUST drastically change your response:

Severity 1-3 (mild):
- escalate: false, escalateMessage: null
- mapleMessage should be light, cheerful, and casual — like checking in with a happy friend
- Recommendations: light, easy activities — journal for fun, listen to a favorite song, go for a short walk, drink some water, doodle or draw something, stretch

Severity 4-6 (moderate):
- escalate: false, escalateMessage: null
- mapleMessage should be warm and encouraging — acknowledge the feeling but stay optimistic
- Recommendations: more intentional activities — call or text a friend, try a 5-minute meditation, go outside and get fresh air, do some light exercise, eat a healthy snack, take a warm shower

Severity 7 (getting intense):
- escalate: false, escalateMessage: null
- mapleMessage should be noticeably warmer and more gentle — validate that this is hard
- Recommendations: grounding activities — deep breathing exercises, call someone you trust, take a break from screens, go for a longer walk, write down what you're feeling

Severity 8-10 (intense):
- escalate: true
- escalateMessage: a gentle, non-alarming message suggesting professional support, e.g. "It sounds like things feel really heavy right now. Talking to someone who's trained to help — like a counselor or a helpline — can make a real difference. You deserve that support. 💛"
- mapleMessage should be very warm, very gentle, deeply empathetic — like holding someone's hand through a tough moment
- Recommendations: immediate calming techniques ONLY — box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s), grounding exercise (name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste), call a trusted person right now

IMPORTANT:
- Always return exactly 3 recommendations
- The recommendations for severity 2 and severity 9 must be COMPLETELY different — never reuse the same suggestions across severity tiers
- mapleMessage must never start with "I"
- Keep language simple, warm, and never alarming
- Only return valid JSON, no extra text`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { emotion, severity } = await req.json();

    if (!emotion || typeof severity !== "number" || severity < 1 || severity > 10) {
      return new Response(JSON.stringify({ error: "Invalid emotion or severity" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `The user is feeling ${emotion} at a severity level of ${severity} out of 10. Please respond as Maple.`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Anthropic API error: ${JSON.stringify(data)}`);
    }
    const text = data.content[0].text;

    // Strip markdown fences and extract raw JSON
    let cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON found in LLM response");
    }
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
