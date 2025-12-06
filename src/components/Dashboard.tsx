"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, MessageCircle, Camera, Trophy, ShoppingBag } from "lucide-react";
import { generateDailyQuests, Quest } from "@/lib/quest-service";
import { useXP } from "@/hooks/useXP";
import { useAgent } from "@/context/AgentContext";

export default function Dashboard() {
    const [name, setName] = useState("Alex");
    const [quests, setQuests] = useState<Quest[]>([]);
    const { xp, addXP } = useXP();
    const { startAgent, stopAgent } = useAgent();

    useEffect(() => {
        // Start Agentic AI only when on Dashboard
        startAgent();
        return () => stopAgent();
    }, []);

    useEffect(() => {
        const storedName = localStorage.getItem("zest_username");
        if (storedName) setName(storedName);

        // Load quests (Refresh every 5 mins)
        const storedQuests = localStorage.getItem("zest_daily_quests_v4");
        const lastUpdate = localStorage.getItem("zest_quest_timestamp");
        const now = Date.now();
        const fiveMins = 5 * 60 * 1000;

        if (storedQuests && lastUpdate && (now - parseInt(lastUpdate) < fiveMins)) {
            setQuests(JSON.parse(storedQuests));
        } else {
            const newQuests = generateDailyQuests();
            setQuests(newQuests);
            localStorage.setItem("zest_daily_quests_v4", JSON.stringify(newQuests));
            localStorage.setItem("zest_quest_timestamp", now.toString());
        }
    }, []);

    const handleClaim = (index: number) => {
        const updated = [...quests];
        if (updated[index].done) return;

        updated[index].done = true;
        setQuests(updated);
        localStorage.setItem("zest_daily_quests_v4", JSON.stringify(updated));

        // Add XP
        addXP(updated[index].xp);
    };

    return (
        <div style={{ padding: "20px", paddingBottom: "80px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Good Morning, <span style={{ color: "var(--primary)" }}>{name}</span></h1>
                    <p style={{ color: "var(--text-muted)" }}>Level 5 • {xp} XP</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "#333", padding: "8px 12px", borderRadius: "99px" }}>
                    <Flame color="#FF6B6B" fill="#FF6B6B" size={20} />
                    <span style={{ fontWeight: "bold" }}>12</span>
                </div>
            </div>

            {/* Quests */}
            <h2 style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Daily Quests ⚔️</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
                {quests.map((quest, i) => (
                    <div key={i} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: quest.done ? 0.5 : 1 }}>
                        <div>
                            <h3 style={{ fontWeight: "bold", textDecoration: quest.done ? "line-through" : "none", fontSize: "1rem" }}>{quest.title}</h3>
                            <span style={{ color: "var(--primary)", fontSize: "0.9rem" }}>+{quest.xp} XP</span>
                        </div>
                        <button
                            onClick={() => handleClaim(i)}
                            disabled={quest.done}
                            style={{
                                background: quest.done ? "#333" : "var(--primary)",
                                color: quest.done ? "#888" : "black",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "99px",
                                fontWeight: "bold",
                                cursor: quest.done ? "default" : "pointer"
                            }}
                        >
                            {quest.done ? "Done" : "Claim"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Apps Grid */}
            <h2 style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Your Apps</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <Link href="/chat" className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textDecoration: "none", color: "white" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <MessageCircle size={24} color="white" />
                    </div>
                    <span style={{ fontWeight: "bold" }}>Money Twin</span>
                </Link>
                <Link href="/ar" className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textDecoration: "none", color: "white" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#FF6B6B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Camera size={24} color="white" />
                    </div>
                    <span style={{ fontWeight: "bold" }}>Future Me</span>
                </Link>
                <Link href="/challenges" className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textDecoration: "none", color: "white" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#4ECDC4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trophy size={24} color="white" />
                    </div>
                    <span style={{ fontWeight: "bold" }}>Challenges</span>
                </Link>
                <Link href="/products" className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textDecoration: "none", color: "white" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ShoppingBag size={24} color="black" />
                    </div>
                    <span style={{ fontWeight: "bold" }}>Marketplace</span>
                </Link>
                <Link href="/goals" className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", textDecoration: "none", color: "white", gridColumn: "span 2" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#FFE66D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trophy size={24} color="black" />
                    </div>
                    <span style={{ fontWeight: "bold" }}>Goal Achiever 🎯</span>
                </Link>
            </div>
        </div>
    );
}
