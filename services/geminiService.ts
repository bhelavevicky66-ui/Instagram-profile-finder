
import { GoogleGenAI } from "@google/genai";
import { SearchResult, InstagramProfile } from "../types";

const extractUsername = (url: string): string => {
  try {
    const cleanUrl = url.split('?')[0].replace(/\/$/, '');
    const parts = cleanUrl.split('/');
    const lastPart = parts[parts.length - 1];
    // Avoid returning common words or subdomains
    if (!lastPart || lastPart === 'www.instagram.com' || lastPart === 'reels' || lastPart === 'p') return 'user';
    return lastPart;
  } catch {
    return 'user';
  }
};

const isValidInstaUsername = (str: string): boolean => {
  // Instagram usernames: alphanumeric, periods, underscores, max 30 chars
  return /^[a-zA-Z0-9\._]{1,30}$/.test(str);
};

export const performInstaSearch = async (query: string): Promise<SearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are an elite Instagram ID Finder. 
    Your mission: Find the direct Instagram profile link for: "${query}".
    
    CRITICAL RULES:
    1. Use Google Search to find any mention of this person on Instagram.
    2. Look for patterns like instagram.com/username.
    3. Even if you are unsure, provide the most likely Instagram link.
    4. If the query looks like a username (e.g., has underscores or dots), prioritize that as the ID.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ parts: [{ text: `What is the Instagram ID for "${query}"? Give me the direct URL.` }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstruction,
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    let profiles: InstagramProfile[] = [];

    // 1. Check grounding chunks for instagram.com links
    groundingChunks.forEach(chunk => {
      const uri = chunk.web?.uri;
      if (uri && uri.includes('instagram.com/')) {
        // Exclude non-profile pages
        if (uri.includes('/reels/') || uri.includes('/p/') || uri.includes('/explore/') || uri.includes('/stories/')) return;

        const username = extractUsername(uri);
        if (username !== 'user') {
          profiles.push({
            name: chunk.web?.title?.split('•')[0].trim() || "Instagram User",
            bio: chunk.web?.title?.split('•')[1]?.trim() || "Instagram Profile",
            url: uri,
            username: username
          });
        }
      }
    });

    // 2. Regex fallback for text mentions in AI response
    const urlRegex = /https?:\/\/(www\.)?instagram\.com\/([a-zA-Z0-9\._]+)/gi;
    let match;
    while ((match = urlRegex.exec(text)) !== null) {
      const url = match[0];
      const username = match[2];
      if (username && !['reels', 'p', 'explore', 'stories'].includes(username.toLowerCase())) {
        if (!profiles.some(p => p.username === username)) {
          profiles.push({
            name: query,
            bio: "Found via AI search analysis",
            url: `https://www.instagram.com/${username}/`,
            username: username
          });
        }
      }
    }

    // 3. DIRECT GUESS FALLBACK: 
    // If we found nothing but the query looks like a direct ID (e.g., vicky_bhelave)
    if (profiles.length === 0 && isValidInstaUsername(query)) {
      profiles.push({
        name: query,
        bio: "Directly identified from your search query.",
        url: `https://www.instagram.com/${query}/`,
        username: query
      });
    }

    if (profiles.length === 0) {
      throw new Error("Could not find this Instagram ID. Check the spelling and try again.");
    }

    // Deduplicate
    const uniqueProfiles = profiles.filter((v, i, a) => a.findIndex(t => t.username === v.username) === i);

    return {
      text,
      profiles: uniqueProfiles
    };
  } catch (error: any) {
    console.error("Insta Search Failed:", error);
    // Even if API fails, if it's a valid username, let's just show it!
    if (isValidInstaUsername(query)) {
      return {
        text: "Direct search used.",
        profiles: [{
          name: query,
          bio: "Search result for the provided ID.",
          url: `https://www.instagram.com/${query}/`,
          username: query
        }]
      };
    }
    throw new Error(error.message || "Search failed. Check your internet.");
  }
};
