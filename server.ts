import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Generation endpoint for social posts & hashtags
  const PLATFORM_LIMITS: Record<string, number> = {
    twitter: 280,
    instagram: 2200,
    facebook: 63200,
  };

  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt: topic, tone = "professional", platforms = ["twitter", "instagram"], hashtagCount = 5 } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const targetPlatform = platforms[0] || "twitter";
      const maxChars = PLATFORM_LIMITS[targetPlatform] || 280;

      const systemInstruction = `
Eres un experto copywriter de redes sociales.
Escribe un post sobre "${topic || 'Innovación tecnológica'}" con tono "${tone}" para ${targetPlatform}.
Devuelve SOLO un objeto JSON válido con la siguiente estructura exacta:
{
  "variants": [
    { "platform": "${targetPlatform}", "content": "Texto del post adaptado..." }
  ],
  "hashtags": ["#tag1", "#tag2", "#tag3"]
}
Añade ${hashtagCount} hashtags al final.
Máximo ${maxChars} caracteres.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Topic/Prompt: ${topic || 'Innovación'}\nTone: ${tone}\nTarget Platform: ${targetPlatform}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      const data = JSON.parse(text);
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to generate content" });
    }
  });

  // n8n Webhook proxy / test endpoint
  app.post("/api/n8n/trigger", async (req, res) => {
    try {
      const { webhookUrl, apiKey, payload } = req.body;
      
      if (!webhookUrl) {
        // Fallback simulation if webhook URL is not provided
        console.log("Simulating n8n webhook execution (no URL provided):", payload);
        await new Promise((resolve) => setTimeout(resolve, 1200));
        return res.json({
          success: true,
          simulated: true,
          postId: "n8n_sim_" + Math.random().toString(36).substring(7),
          message: "Successfully triggered n8n workflow (Simulated)"
        });
      }

      // Forward request to n8n webhook
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
        headers["X-N8N-API-KEY"] = apiKey;
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { rawResponse: responseText };
      }

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: `n8n webhook returned status ${response.status}`,
          details: responseData
        });
      }

      res.json({
        success: true,
        simulated: false,
        data: responseData,
        postId: responseData.postId || "n8n_exec_" + Math.random().toString(36).substring(7)
      });
    } catch (error: any) {
      console.error("n8n Trigger Error:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to reach n8n webhook" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
