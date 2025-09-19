
import { GoogleGenAI, Type } from "@google/genai";
import { Message, Scenario, GeminiResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        reply: {
            type: Type.STRING,
            description: "The AI’s next message in the conversation, staying in character."
        },
        analysis: {
            type: Type.OBJECT,
            properties: {
                trigger: {
                    type: Type.BOOLEAN,
                    description: "True if feedback is needed, false if not."
                },
                summary: {
                    type: Type.STRING,
                    description: "A 1-line quick note about the user's message (e.g., 'Too apologetic,' 'Good confidence')."
                },
                positives: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of 1-2 things the user did well."
                },
                improvements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of 1-2 suggestions for better responses, including examples."
                }
            },
            required: ['trigger', 'summary', 'positives', 'improvements']
        }
    },
    required: ['reply', 'analysis']
};

const getSystemInstruction = (role: string, mode: string) => `
You are Convo Trainer, an AI conversation simulator and feedback coach.
Your job is to roleplay realistic conversations and also provide coaching analysis.

### Core Behavior:
1.  Always act in the ROLE: ${role} and MODE: ${mode}.
2.  Only write the AI’s side of the conversation (do not answer for the user).
3.  Keep replies short and natural (1–3 sentences), like a real conversation.
4.  Stay in character for the ROLE. If the role is "crush," be casual/flirty. If it is "professor," be formal and academic. If it is "senior," be teasing/confident. Adapt tone accordingly.

### Feedback Analysis:
After every user input, generate an \`analysis\` object with:
-   trigger: boolean (true if feedback is needed, false if not).
-   summary: a 1-line quick note (e.g., "Too apologetic," "Good confidence," "Sounded stiff").
-   positives: list of 1–2 things user did well.
-   improvements: list of 1–2 suggestions for better responses (with examples).

### Rules:
-   If the user writes “END SESSION” or “NEW SCENARIO”, set the analysis trigger to false and do not provide feedback, just the appropriate reply.
-   Never write both sides of the conversation.
-   Never break character while roleplaying.
-   Make the analysis concise, but useful.
-   The entire response must be a single JSON object matching the provided schema.
`;

export const getAiResponse = async (history: Message[], scenario: Scenario): Promise<GeminiResponse> => {
    const { role, mode } = scenario;
    const conversationHistory = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const userMessage = history[history.length - 1].text;
    
    const prompt = `
Conversation History:
${conversationHistory}

Based on the last user message ("${userMessage}"), continue the conversation and provide analysis.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(role, mode),
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.8,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as GeminiResponse;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a response from the AI. Please check the console for details.");
    }
};


export const getSessionSummary = async (history: Message[]): Promise<string> => {
    const conversationHistory = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

    const prompt = `
The user has ended the session. Based on the entire conversation history provided below, generate a session summary.
The summary should include:
- Strengths: What the user did well consistently.
- Weaknesses: Areas where the user struggled.
- Actionable homework: A specific, small task the user can do to practice and improve.

Conversation History:
${conversationHistory}

Provide the summary as a concise, formatted text response.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return `**Session Ended**\n\nHere is your summary:\n\n${response.text}`;
    } catch (error) {
        console.error("Error generating session summary:", error);
        return "Sorry, I was unable to generate a session summary due to an error.";
    }
};
