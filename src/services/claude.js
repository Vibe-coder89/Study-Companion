const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

async function callClaude(
  systemPrompt,
  userPrompt,
  onChunk
) {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization: `Bearer ${API_KEY}`,
        },

        body: JSON.stringify({
          model:
            "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",
              content: systemPrompt,
            },

            {
              role: "user",
              content: userPrompt,
            },
          ],

          temperature: 0.7,

          max_tokens: 1024,
        }),
      }
    );

    const data =
      await response.json();

    console.log(data);

    const text =
      data.choices?.[0]?.message
        ?.content ||
      "No response from AI.";

    onChunk(text);
  } catch (err) {
    console.log(err);

    onChunk(
      "Error connecting to AI."
    );
  }
}

async function callClaudeJSON(
  systemPrompt,
  userPrompt
) {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization: `Bearer ${API_KEY}`,
      },

      body: JSON.stringify({
        model:
          "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",

            content:
              systemPrompt +
              "\nReturn ONLY valid JSON.",
          },

          {
            role: "user",
            content: userPrompt,
          },
        ],

        temperature: 0.7,

        max_tokens: 1500,
      }),
    }
  );

  const data =
    await response.json();

  console.log(data);

  const text =
    data.choices?.[0]?.message
      ?.content || "{}";

  return JSON.parse(
    text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()
  );
}

export {
  callClaude,
  callClaudeJSON,
};