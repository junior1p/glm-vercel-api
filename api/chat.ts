import type { VercelRequest, VercelResponse } from "vercel";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: "messages is required" });
  }

  try {
    const r = await fetch(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GLM_API_KEY}`,
        },
        body: JSON.stringify({
          model: "glm-4.7",
          messages,
          temperature: 0.7,
        }),
      }
    );

    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "GLM request failed" });
  }
}

