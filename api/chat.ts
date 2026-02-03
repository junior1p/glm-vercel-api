export default async function handler(req: any, res: any) {
  /* =========================
     CORS 设置（最终版）
     ========================= */

  // 🔐 推荐：只允许你自己的前端域名
  // 如果你还没部署前端，可以临时用 "*"
  const ALLOWED_ORIGINS = [
    "https://junior1p.github.io", // ✅ GitHub Pages 主域名（不带仓库路径）
    // "http://localhost:8000",   // 本地开发可选
  ];

  const origin = req.headers.origin;

  if (!origin) {
    // 非浏览器请求（如 curl / PowerShell）
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // 预检请求（浏览器会先发 OPTIONS）
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  /* =========================
     只允许 POST
     ========================= */

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { messages } = req.body || {};
  if (!messages) {
    return res.status(400).json({ error: "messages is required" });
  }

  /* =========================
     调用 GLM
     ========================= */

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
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({
      error: "GLM request failed",
      detail: String(e?.message || e),
    });
  }
}
