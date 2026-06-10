import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint to generate history article
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { heritageName, researchContent, drawingDesc, studentName } = req.body;

    if (!heritageName || !researchContent) {
      return res.status(400).json({ error: "문화유산 이름과 조사 내용은 필수 입력 항목입니다." });
    }

    const systemInstruction = `당신은 초등학교 5학년 학생들의 역사 탐구를 돕는 다정하고 열정적인 '어린이 역사 신문 편집장 AI'입니다.
학생이 입력한 문화유산 이름과 조사 노트를 바탕으로, 5학년 수준에 맞춰 아주 흥미롭고 역사적 가치를 쉽게 설명하는 멋진 기사를 만들어 주세요.

항상 다음 JSON 형식으로 정확히 반환하세요:
{
  "newspaperTitle": "귀여운 역사 신문 제호 (예: '무등일보 역사돋보기', '백제 타임즈', '조선의 소리' 등 다양하고 귀여운 이름)",
  "editorGreetingComment": "학생을 극찬하고 다정하게 격려해줄 편집장의 짤막한 격려 코멘트 (존댓말 사용만 하되, 5학년 학생에게 말하듯 '~~했구나! 정말 대단해!' 같은 친근하고 부드러운 격려)",
  "headline": "기사의 멋진 1면 특종 제목 (5학년 눈높이에 맞춘 흥미진진하고 전문적인 역사기사 느낌)",
  "subheadline": "기사의 부제목",
  "paragraphs": [
    "첫 번째 문단: 문화유산의 소개와 발견 등에 대한 재미있는 이야기",
    "두 번째 문단: 이 문화유산의 과학적, 역사적 가치와 조상들의 지혜에 대한 자세한 설명 (쉽게 이해가 쏙쏙 되도록 예시 포함)",
    "세 번째 문단: 이 유산이 우리에게 주는 교훈과 앞으로 왜 지켜나가야 하는지에 대한 생각"
  ],
  "editorColumn": "신문 한쪽에 실리는 '편집장의 한마디' 오피니언 섹션 내용 (학생의 멋진 열정을 칭찬하고 왜 이 조사가 훌륭했는지 따뜻하게 평가해주는 글)"
}`;

    const prompt = `학생 이름: ${studentName || "꿈나무 학생"}
문화유산 이름: ${heritageName}
조사한 정보: ${researchContent}
그린 그림에 대한 설명(있는 경우): ${drawingDesc || "설명 없음"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            newspaperTitle: { type: Type.STRING },
            editorGreetingComment: { type: Type.STRING },
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            paragraphs: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            editorColumn: { type: Type.STRING }
          },
          required: ["newspaperTitle", "editorGreetingComment", "headline", "subheadline", "paragraphs", "editorColumn"]
        }
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "기사를 생성하는 도중 오류가 발생했습니다." });
  }
});

// Setup Vite or static serving
async function setupServer() {
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

setupServer();
