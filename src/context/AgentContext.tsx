"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { generateAgentReaction } from "@/lib/ai-service";

type AgentContextType = {
    triggerNotification: (msg: string) => void;
    notifyEvent: (event: "GOAL_ADDED" | "GOAL_COMPLETED" | "SPENDING_SPIKE", data?: string) => void;
    startAgent: () => void;
    stopAgent: () => void;
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
    const [notification, setNotification] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]); // Track seen messages
    const [isActive, setIsActive] = useState(false); // Only run when explicitly started (e.g. on Dashboard)
    const isPaused = useRef(false); // Pause background checks when showing a notification

    // Helper to show notification if not recently seen
    const showSmartNotification = (msg: string, force = false) => {
        if (isPaused.current) return;

        // Avoid repetition: Don't show if it's in the last 5 messages (unless forced)
        if (!force && history.includes(msg)) {
            console.log("Skipping repeated message:", msg);
            return;
        }

        setNotification(msg);
        setHistory(prev => {
            const newHistory = [msg, ...prev];
            return newHistory.slice(0, 10); // Keep last 10
        });

        isPaused.current = true;
        setTimeout(() => {
            setNotification(null);
            isPaused.current = false;
        }, 8000); // Show for 8s
    };

    // Direct Event Triggers (Called by components)
    const notifyEvent = async (event: "GOAL_ADDED" | "GOAL_COMPLETED" | "SPENDING_SPIKE", data: string = "") => {
        // Try Gen AI first
        const aiMsg = await generateAgentReaction(event, data);
        if (aiMsg) {
            showSmartNotification(aiMsg, true);
            return;
        }

        // Fallback to hardcoded
        if (event === "GOAL_ADDED") {
            showSmartNotification("Slayyy! New goal locked in. Proud of you for leveling up your financial game 👏 I’ll keep reminding you so you actually hit it, no delulu this time.", true);
        } else if (event === "GOAL_COMPLETED") {
            showSmartNotification("OMG you actually did it?! 🎉 Goal smashed. Now don't blow it all—invest some of that cash!", true);
        } else if (event === "SPENDING_SPIKE") {
            showSmartNotification("Whoa money outflow detected—math ain’t mathing 😭 Slow down king/queen.", true);
        }
    };

    // Background "Thinking" Logic
    useEffect(() => {
        const interval = setInterval(async () => {
            if (!isActive || isPaused.current) return;

            const goals = JSON.parse(localStorage.getItem("zest_goals") || "[]");
            const rand = Math.random();

            // Only generate background tips if no active notification

            // 1. Goal Specific Nudges (High Priority)
            if (goals.length > 0 && rand > 0.7) {
                const goal = goals[Math.floor(Math.random() * goals.length)];
                // Gen AI Nudge
                const aiMsg = await generateAgentReaction("GOAL_REMINDER", `User has a goal: ${goal.name}. Remind them to save.`);
                if (aiMsg) {
                    showSmartNotification(aiMsg);
                    return;
                }

                // Fallback
                let msg = "";
                if (goal.name.toLowerCase().includes("trip") || goal.name.toLowerCase().includes("travel")) {
                    msg = "Yo, you're saving for that trip, right? Skip one unnecessary spend today and you’re a day closer.";
                } else if (goal.name.toLowerCase().includes("laptop") || goal.name.toLowerCase().includes("phone") || goal.name.toLowerCase().includes("gadget")) {
                    msg = `${goal.name} goal needs a boost. Want me to generate a 30-day micro-saving plan?`;
                } else {
                    msg = `Quick vibe check: How's the ${goal.name} fund looking? Even ₹50 counts today.`;
                }

                showSmartNotification(msg);
                return;
            }

            // 2. Investment & Savings (Medium Priority)
            if (rand > 0.4 && rand <= 0.7) {
                const nudges = [
                    "Quick vibe check: Your FD balance is unchanged. Wanna grow that money or let it sleep forever?",
                    "SIP alert: Markets looking stable today. ₹100–₹200 daily can push your goal faster.",
                    "Insurance hack: You can redeem XP for a premium discount. Don’t sleep on free money.",
                    "Hey, you haven’t invested anything lately. Should I ask Money Twin to cook up a quick SIP/FD suggestion for you? 👀"
                ];
                const randomNudge = nudges[Math.floor(Math.random() * nudges.length)];
                showSmartNotification(randomNudge);
                return;
            }

            // 3. General Wellness (Low Priority)
            if (rand <= 0.2) {
                const tips = [
                    "BTW your XP is collecting dust 🧹 Redeem it for insurance discounts inside the Rewards Zone.",
                    "Finance check time! Missed opportunities: XP rewards + SIP options. Want a summary report?"
                ];
                showSmartNotification(tips[Math.floor(Math.random() * tips.length)]);
            }

        }, 15000); // Check every 15 seconds

        return () => clearInterval(interval);
    }, [history, isActive]); // Re-run effect when history changes to keep closure fresh (though refs handle pause)

    return (
        <AgentContext.Provider value={{
            triggerNotification: (msg) => showSmartNotification(msg, true),
            notifyEvent,
            startAgent: () => setIsActive(true),
            stopAgent: () => setIsActive(false)
        }}>
            {children}
            {notification && (
                <div style={{
                    position: "fixed",
                    top: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.95)",
                    border: "1px solid var(--primary)",
                    padding: "15px 20px",
                    borderRadius: "12px",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    width: "90%",
                    maxWidth: "400px",
                    animation: "slideDown 0.5s ease-out"
                }}>
                    <div style={{ fontSize: "1.5rem" }}>🤖</div>
                    <div>
                        <h4 style={{ fontWeight: "bold", color: "var(--primary)", fontSize: "0.9rem" }}>Money Twin says:</h4>
                        <p style={{ fontSize: "0.9rem", color: "white" }}>{notification}</p>
                    </div>
                    <button onClick={() => setNotification(null)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#666", fontSize: "1.2rem", cursor: "pointer" }}>×</button>
                </div>
            )}
        </AgentContext.Provider>
    );
}

export const useAgent = () => {
    const context = useContext(AgentContext);
    if (!context) throw new Error("useAgent must be used within AgentProvider");
    return context;
};
