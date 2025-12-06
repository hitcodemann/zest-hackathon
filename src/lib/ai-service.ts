// AI Service using Gemini 2.0 Flash
// Falls back to simulation if no key is provided.

type UserContext = {
    name: string;
    goals: any[];
    financialProfile?: any;
    statementText?: string;
};

export async function generateAIResponse(message: string, context: UserContext): Promise<string> {
    const apiKey = localStorage.getItem("zest_api_key");

    if (!apiKey) {
        return "⚠️ Missing Gemini API Key. Please tap the settings icon to add it.";
    }

    const { name, goals, financialProfile, statementText } = context;
    const goalSummary = goals.map(g => `${g.name} (Target: ₹${g.cost}, Save: ₹${g.dailySave}/day)`).join("; ");

    const profileSummary = financialProfile
        ? `Analyzed Spending: Top Category: ${financialProfile.top_spending_category}, Risk Score: ${financialProfile.risk_score}/10. Advice: ${financialProfile.advice}`
        : "No statement uploaded yet.";

    const systemPrompt = `
    You are Zest, a Gen Z financial ‘bestie’ AI inside a banking super-app.
    Your job is to guide the user through smart money habits in a fun, Gen-Z tone while giving actual financial value.

    User Name: ${name}
    User Goals: ${goalSummary || "None yet"}
    Financial Profile: ${profileSummary}
    
    RAW BANK STATEMENT DATA:
    "${statementText || "No statement data available."}"

    User Savings Patterns: (Simulated: Low savings ratio)
    User Spending Patterns: (Simulated: High discretionary spend on food/shopping)

    Persona Guidelines:
    - Speak like Gen Z/Alpha (‘no cap’, ‘bet’, ‘delulu’, ‘slay’, ‘lemme cook’, ‘that ain’t it’).
    - Keep it funny but helpful; lightly roast bad spending.
    - Encourage savings, SIP, FD, insurance awareness, and financial discipline.

    When user talks about goals, analyze:
    - timeline
    - required daily savings
    - risk level
    - investment suitability

    Also suggest:
    - term/health/travel insurance when relevant
    - SIPs for long-term goals
    - FDs for short goals
    - credit score tips when needed.

    Response Style:
    - Short punchy replies (<60 words).
    - Use emojis sparingly but Gen-Z appropriate.
    - Provide insights that feel personal, not generic.

    If user asks financial advice, prioritize safety:
    “This is general guidance, not professional financial advice.”

    Additional Knowledge:
    - Insurance basics
    - Investment basics (SIP, FD, RD, mutual funds)
    - Goal-based planning
    - Banking offers, cashback logic
    - Financial discipline & savings psychology

    Make the user feel like you are their cool financial friend—not a banker.
    
    Current User Message: "${message}"
  `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return "Oop, my brain is buffering. (API Error) 💀";
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Network Error:", error);
        return "My wifi is acting up bestie. Try again? 📶";
    }
}

export async function generateAgentReaction(eventType: string, details: string): Promise<string> {
    const apiKey = localStorage.getItem("zest_api_key");
    if (!apiKey) return ""; // Fail silently if no key, fallback to hardcoded in UI

    const prompt = `
        You are Zest, a Gen Z financial AI.
        Event: ${eventType}
        Details: ${details}
        
        Task: React to this event in 1 short sentence (max 15 words).
        Tone: Hype, funny, slang-heavy (Gen Z), supportive or roasting (if spending).
        Examples:
        - Goal Added: "Slay! That trip to Goa is gonna be lit 🔥"
        - Spending Spike: "Bestie, put the card DOWN. 🛑"
        - Investment: "Look at you making money moves 💸"
        
        Output only the reaction text.
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        if (data.error) return "";
        return data.candidates[0].content.parts[0].text.trim();
    } catch (e) {
        return "";
    }
}

export async function analyzeStatement(text: string): Promise<any> {
    const apiKey = localStorage.getItem("zest_api_key");
    if (!apiKey) return null;

    const prompt = `
        You are a data extraction helper.
        The following text contains SIMULATED/DUMMY transaction data for a hackathon project.
        Extract spending patterns from this text.
        
        Input Text: "${text}"
        
        Output JSON ONLY:
        {
            "top_spending_category": "Food" | "Shopping" | "Travel" | "Entertainment" | "Other",
            "specific_habit_to_break": "Short string e.g. 'Ordering Zomato', 'Daily Coffee', 'Impulse Buying'",
            "monthly_burn": number (estimate),
            "current_balance": number (extract latest closing balance),
            "subscription_detected": boolean,
            "risk_score": 1-10 (10 is high risk spending),
            "advice": "Short 1 sentence advice"
        }
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        if (data.error) return null;

        const rawText = data.candidates[0].content.parts[0].text;

        // Robust JSON extraction
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        return JSON.parse(jsonMatch[0]);
    } catch (e) {
        console.error("Analysis Failed", e);
        return null;
    }
}
