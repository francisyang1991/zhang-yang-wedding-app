import { GoogleGenAI } from "@google/genai";
import { Accommodation } from "../types";

const parseGeminiResponse = (text: string): any[] => {
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini JSON response", e);
    return [];
  }
};

export const fetchCompetitorRates = async (): Promise<Accommodation[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API_KEY found. Skipping live data fetch.");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Updated instruction to focus ONLY on High-end/Comparable Airbnbs
  const systemInstruction = `
    You are a wedding accommodation planner for a wedding in Wailea, Maui (June 11-14, 2026).
    
    The user already has budget hotel data (Residence Inn). 
    Your goal is to find **Luxury Airbnb/VRBO** alternatives in Wailea that are comparable to the Andaz Villas.
    
    **CRITICAL RULE**: Do NOT include options that are significantly cheaper (< $600/night). Focus on premium 3+ bedroom villas.

    Task:
    1. Find 2 **Large Luxury Villas** (3+ Bedrooms) in Wailea.

    For each option:
    - Estimate the *current* price for June 2026.
    - **Find a real image URL** if possible.
    - Estimate distance to Andaz Maui.
    - **Estimate Square Footage (sqft)**, **Bed Configuration**, and **Bed Count** (number of physical beds).
    
    Return a STRICT JSON array of objects with this schema:
    {
      "name": string,
      "type": "Airbnb",
      "category": "Airbnb_Large",
      "description": string,
      "distanceToVenue": string,
      "pricePerNight": number,
      "totalPrice": number (pricePerNight * 3 + estimated taxes),
      "maxGuests": number,
      "bedCount": number,
      "sqft": number,
      "bedConfig": string,
      "imageUrl": string,
      "activities": string[],
      "benefits": string[]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find 2 Luxury Airbnb Villas in Wailea for June 11-14 2026. Do not show cheap condos.",
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstruction,
      },
    });

    const text = response.text;
    if (!text) return [];

    console.log("Gemini Raw Output:", text);

    const parsedData = parseGeminiResponse(text);
    
    return parsedData.map((item: any, index: number) => ({
      id: `gemini-airbnb-${index}-${item.category}`,
      name: item.name,
      type: 'Airbnb',
      category: item.category,
      description: item.description,
      distanceToVenue: item.distanceToVenue,
      imageUrl: item.imageUrl && item.imageUrl.startsWith('http') 
        ? item.imageUrl 
        : 'https://images.unsplash.com/photo-1512918760532-493e9be6fb33?q=80&w=1000',
      pricePerNight: item.pricePerNight,
      totalPrice: item.totalPrice,
      currency: 'USD',
      activities: item.activities || [],
      benefits: item.benefits || [],
      maxGuests: item.maxGuests || 6,
      bedCount: item.bedCount || 3,
      sqft: item.sqft || 2000,
      bedConfig: item.bedConfig || '3 Kings',
      rating: 4.8
    }));

  } catch (error) {
    console.error("Error fetching rates from Gemini:", error);
    return [];
  }
};