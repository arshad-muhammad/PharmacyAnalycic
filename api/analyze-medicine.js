import { GoogleGenAI } from '@google/genai';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    let base64Data = image;
    if (base64Data.includes('base64,')) {
      base64Data = base64Data.split('base64,')[1];
    }
    
    // Clean string to prevent "The string did not match the expected pattern" InvalidCharacterError
    base64Data = base64Data.replace(/[^A-Za-z0-9+/=]/g, '');
    while (base64Data.length % 4 !== 0) {
      base64Data += '=';
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `Analyze this image of a medicine (packaging, bottle, or tablet).
Act as an expert AI medicine recognizer. Even if the image is slightly blurred, carefully read the text physically present on the medicine to determine its brand name, active ingredients, dosage, and usage instructions.

Extract and structure the following information in strict JSON format.
If you cannot identify the medicine at all, or if the image is completely unrelated to medicine, return {"identified": false, "name": "Unknown", precautions: [], sideEffects: [], alternatives: [], composition: []}.
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
      res.status(200).json(parsedData);
    } catch (parseError) {
      res.status(500).json({ error: 'Failed to process AI response into structured data.' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message || 'Network failure or an error occurred' });
  }
}
