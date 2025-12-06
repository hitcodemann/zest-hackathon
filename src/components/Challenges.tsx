"use client";

import Link from "next/link";
import { ArrowLeft, Share2, Users } from "lucide-react";

export default function Challenges() {
    const challenges = [
        { title: "No Spend November", participants: "12.5k", reward: "500 XP" },
        { title: "₹5000 to ₹20000 in 14 days", participants: "8.2k", reward: "1000 XP" },
        { title: "Coffee Detox Week", participants: "5.1k", reward: "300 XP" },
    ];

    const handleShare = (title: string) => {
        alert(`Shared "${title}" to TikTok! 🎥\n(Simulated)`);
    };

    return (
        <div style={{ padding: "20px", paddingBottom: "80px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
                <Link href="/dashboard"><ArrowLeft color="white" /></Link>
                <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Viral Challenges</h1>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {challenges.map((c, i) => (
                    <div key={i} className="card" style={{ background: "linear-gradient(45deg, #333, #222)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <h3 style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{c.title}</h3>
                            <span style={{ color: "var(--primary)", fontWeight: "bold" }}>{c.reward}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--text-muted)", marginBottom: "20px" }}>
                            <Users size={16} />
                            <span>{c.participants} joined</span>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button className="btn-primary" style={{ flex: 1, fontSize: "0.9rem" }}>Join Challenge</button>
                            <button onClick={() => handleShare(c.title)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "99px", width: "50px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                                <Share2 color="white" size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
