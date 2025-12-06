export type Quest = {
    title: string;
    xp: number;
    done: boolean;
    type: "habit" | "goal" | "bonus";
};

export function generateDailyQuests(): Quest[] {
    // 1. Get User Preferences, Goals & Financial Profile
    const prefs = JSON.parse(localStorage.getItem("zest_preferences") || "{}");
    const goals = JSON.parse(localStorage.getItem("zest_goals") || "[]");
    const profile = JSON.parse(localStorage.getItem("zest_financial_profile") || "null");

    const quests: Quest[] = [];

    // 2. Habit Quest (Personalized from Statement if available)
    if (profile) {
        if (profile.specific_habit_to_break) {
            quests.push({
                title: `Challenge: Avoid ${profile.specific_habit_to_break} 🚫`,
                xp: 500,
                done: false,
                type: "habit"
            });
        } else if (profile.top_spending_category) {
            quests.push({
                title: `Spend ₹0 on ${profile.top_spending_category} today 🛑`,
                xp: 400,
                done: false,
                type: "habit"
            });
        }
    } else if (prefs.cut_cost_area) {
        quests.push({
            title: `Spend ₹0 on ${prefs.cut_cost_area} today`,
            xp: 300,
            done: false,
            type: "habit"
        });
    } else {
        quests.push({
            title: "Track all your expenses today",
            xp: 150,
            done: false,
            type: "habit"
        });
    }

    // 3. Goal Check-in Quest
    if (goals.length > 0) {
        quests.push({
            title: "Check your Goal Progress 🎯",
            xp: 200,
            done: false,
            type: "goal"
        });
    } else {
        quests.push({
            title: "Create your first financial goal",
            xp: 200,
            done: false,
            type: "goal"
        });
    }

    // 4. AI Bonus Quest (Dynamic based on Risk/Advice)
    if (profile) {
        if (profile.risk_score >= 7) {
            quests.push({
                title: "🔥 High Spend Alert: No Spend Day",
                xp: 1000,
                done: false,
                type: "bonus"
            });
        } else if (profile.risk_score <= 3) {
            quests.push({
                title: "💰 Smart Saver: Invest ₹500 today",
                xp: 500,
                done: false,
                type: "bonus"
            });
        } else {
            // Use advice or generic
            const adviceAction = profile.advice ? `Action: ${profile.advice.substring(0, 20)}...` : "Read a finance article";
            quests.push({
                title: adviceAction,
                xp: 200,
                done: false,
                type: "bonus"
            });
        }
    } else {
        // Fallback if no profile yet
        quests.push({
            title: "Upload Statement for AI Quests 📄",
            xp: 100,
            done: false,
            type: "bonus"
        });
    }

    // 5. Knowledge Quest (New)
    quests.push({
        title: "🧠 Knowledge: Read one finance tip",
        xp: 150,
        done: false,
        type: "bonus"
    });

    // 6. Engagement Quest (New)
    quests.push({
        title: "👀 Check the Financial Rewards Zone",
        xp: 100,
        done: false,
        type: "bonus"
    });

    return quests;
}
