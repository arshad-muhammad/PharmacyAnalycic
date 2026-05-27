import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Tesseract from 'tesseract.js';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

app.post('/api/analyze-medicine', async (req, res) => {
  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    console.log("-----------------------------------------");
    console.log("[OCR] Starting image text extraction...");

    // 1. OCR Extract Text (to help even if blurred)
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
    console.log("[OCR] Extracted text snippet:", text.replace(/\n/g, ' ').substring(0, 150), '...');

    // 2. Query Gemini with OCR text + Original Image
    const prompt = `Analyze this image of a medicine (packaging, bottle, or tablet).
I have also run OCR on this image which may help if the image is blurred. Here is the raw extracted text:
"""
${text}
"""

Using both the image and the OCR text context, identify the medicine accurately. 
Extract and structure the following information in strict JSON format.
If you cannot identify the medicine, at least try to guess based on the OCR raw text, or return an error message in the JSON.
Ensure your response is valid JSON that can be parsed by JSON.parse().
Do NOT wrap the response in markdown blocks like \`\`\`json. Just return the raw JSON object.

The required JSON structure is:
{
  "identified": boolean (true if a medicine was found, false otherwise),
  "name": string (Name of the medicine),
  "composition": string[] (Array of active ingredients),
  "usage": string (Primary uses and indications),
  "dosage": string (General dosage guidelines, with a disclaimer to consult a doctor),
  "sideEffects": string[] (List of common side effects),
  "precautions": string[] (List of warnings/interactions),
  "alternatives": string[] (List of general, safer alternative names with similar composition),
  "safetyRating": string (A general safety sentiment: e.g., "Safe for general use", "Requires prescription", "Use with caution"),
  "purchaseQuery": string (A search query string that could be used on an online pharmacy, like "buy [medicine name]")
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType || 'image/jpeg'
              }
            }
          ]
        }
      ]
    });

    let rawText = response.text || "{}";
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsedData = JSON.parse(rawText);
      res.json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", rawText);
      res.status(500).json({ error: 'Failed to process AI response into structured data.' });
    }

  } catch (error: any) {
    console.error('[API Router] Error analyzing medicine:', error);
    res.status(500).json({ error: error.message || 'Network failure or an error occurred during analysis.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
