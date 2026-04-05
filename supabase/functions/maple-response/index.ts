const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Maple, a warm and caring mushroom mascot for a mental wellness app called Mood Mapping. You speak in a gentle, cozy, supportive tone — like a kind friend, never clinical or robotic.

When given a user's emotion and severity score (1-10), you respond with a JSON object in this exact format:
{
  "mapleMessage": "A warm 1-2 sentence message from Maple acknowledging the feeling",
  "recommendations": [
    {
      "icon": "emoji",
      "title": "Short action title",
      "description": "One sentence describing what to do"
    },
    {
      "icon": "emoji", 
      "title": "Short action title",
      "description": "One sentence describing what to do"
    },
    {
      "icon": "emoji",
      "title": "Short action title", 
      "description": "One sentence describing what to do"
    }
  ],
  "escalate": false,
  "escalateMessage": null
}

Rules:
- Always return exactly 3 recommendations
- For severity 1-7: escalate is false, escalateMessage is null. Give lifestyle recommendations (journaling, walks, music, breathing, calling a friend, drawing, snacks, hydration, games, meditation)
- For severity 8-10: escalate is true, escalateMessage is a gentle message like "It sounds like you're having a really hard time. It might help to talk to someone who can really support you." Keep recommendations gentle and immediate (breathing, calling someone, grounding exercises)
- mapleMessage should always start with empathy, never with "I"
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
    const text = data.content[0].text;
    const parsed = JSON.parse(text);

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
