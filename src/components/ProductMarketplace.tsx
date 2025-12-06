"use client";

import { useState } from "react";
import { ArrowLeft, Shield, TrendingUp, CreditCard, Activity, Zap, Percent } from "lucide-react";
import Link from "next/link";
import { useXP } from "@/hooks/useXP";

export default function ProductMarketplace() {
    const [activeTab, setActiveTab] = useState<"redeem" | "cashback" | "wellness">("redeem");
    const [showConfetti, setShowConfetti] = useState(false);
    const { xp, spendXP } = useXP();

    const handleClaim = (msg: string, cost: number = 0) => {
        if (cost > 0) {
            const success = spendXP(cost);
            if (!success) {
                alert("Not enough XP! 😢 Do more quests.");
                return;
            }
        }

        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        alert(msg);
    };

    return (
        <div style={{ padding: "20px", paddingBottom: "80px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Link href="/dashboard"><ArrowLeft color="white" /></Link>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Financial Rewards Zone</h1>
                    <p style={{ color: "var(--primary)", fontSize: "0.9rem" }}>XYZ Bank Ecosystem</p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "5px", marginBottom: "20px", overflowX: "auto", paddingBottom: "5px" }}>
                <button
                    onClick={() => setActiveTab("redeem")}
                    style={{
                        flex: 1, padding: "10px", borderRadius: "12px", border: "none", fontWeight: "bold", whiteSpace: "nowrap",
                        background: activeTab === "redeem" ? "var(--primary)" : "#333",
                        color: activeTab === "redeem" ? "black" : "white"
                    }}
                >
                    Redeem XP 💎
                </button>
                <button
                    onClick={() => setActiveTab("cashback")}
                    style={{
                        flex: 1, padding: "10px", borderRadius: "12px", border: "none", fontWeight: "bold", whiteSpace: "nowrap",
                        background: activeTab === "cashback" ? "var(--primary)" : "#333",
                        color: activeTab === "cashback" ? "black" : "white"
                    }}
                >
                    Cashback 💸
                </button>
                <button
                    onClick={() => setActiveTab("wellness")}
                    style={{
                        flex: 1, padding: "10px", borderRadius: "12px", border: "none", fontWeight: "bold", whiteSpace: "nowrap",
                        background: activeTab === "wellness" ? "var(--primary)" : "#333",
                        color: activeTab === "wellness" ? "black" : "white"
                    }}
                >
                    Wellness 🧘
                </button>
            </div>

            {/* XP Balance */}
            <div style={{ textAlign: "center", padding: "20px", background: "linear-gradient(45deg, #333, #222)", borderRadius: "20px", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary)" }}>{xp} XP</h2>
                <p style={{ color: "#ccc" }}>Available Balance</p>
            </div>

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                {/* REDEEM XP TAB */}
                {activeTab === "redeem" && (
                    <>
                        <h3 style={{ fontWeight: "bold", color: "#888" }}>Insurance Discounts</h3>
                        <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <div style={{ padding: "10px", background: "rgba(255, 107, 107, 0.2)", borderRadius: "10px" }}>
                                    <Shield color="#FF6B6B" />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: "bold" }}>5% Off Health Ins.</h3>
                                    <p style={{ fontSize: "0.8rem", color: "#888" }}>XYZ Health Shield</p>
                                </div>
                            </div>
                            <button onClick={() => handleClaim("Code: HEALTH5 applied!", 200)} className="btn-primary" style={{ padding: "5px 15px", fontSize: "0.8rem" }}>200 XP</button>
                        </div>

                        <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <div style={{ padding: "10px", background: "rgba(78, 205, 196, 0.2)", borderRadius: "10px" }}>
                                    <Shield color="#4ECDC4" />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: "bold" }}>₹100 Off Motor Ins.</h3>
                                    <p style={{ fontSize: "0.8rem", color: "#888" }}>Policy.com Voucher</p>
                                </div>
                            </div>
                            <button onClick={() => handleClaim("Voucher sent to email!", 200)} className="btn-primary" style={{ padding: "5px 15px", fontSize: "0.8rem" }}>200 XP</button>
                        </div>

                        <h3 style={{ fontWeight: "bold", color: "#888", marginTop: "10px" }}>Banking Boosts</h3>
                        <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #FFE66D" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                <div style={{ padding: "10px", background: "rgba(255, 230, 109, 0.2)", borderRadius: "10px" }}>
                                    <Zap color="#FFE66D" />
                                </div>
                                <div>
                                    <h3 style={{ fontWeight: "bold" }}>1% Interest Boost</h3>
                                    <p style={{ fontSize: "0.8rem", color: "#888" }}>On Short-term FD</p>
                                </div>
                            </div>
                            <button onClick={() => handleClaim("Interest Boost Activated! 🚀", 300)} className="btn-primary" style={{ padding: "5px 15px", fontSize: "0.8rem", background: "#FFE66D", color: "black" }}>300 XP</button>
                        </div>
                    </>
                )}

                {/* CASHBACK TAB */}
                {activeTab === "cashback" && (
                    <>
                        <div className="card">
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                                <TrendingUp color="#4ECDC4" />
                                <h3 style={{ fontWeight: "bold" }}>Start a SIP</h3>
                            </div>
                            <p style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "10px" }}>Get <strong>₹50 Cashback</strong> when you start your first SIP of ₹500+.</p>
                            <button onClick={() => handleClaim("Redirecting to SIP setup...")} className="btn-primary" style={{ width: "100%" }}>Start SIP</button>
                        </div>

                        <div className="card">
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                                <Shield color="#FF6B6B" />
                                <h3 style={{ fontWeight: "bold" }}>Buy Travel Insurance</h3>
                            </div>
                            <p style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "10px" }}>Flat <strong>10% Cashback</strong> on international travel insurance.</p>
                            <button onClick={() => handleClaim("Redirecting to Insurance...")} className="btn-primary" style={{ width: "100%" }}>Get Insured</button>
                        </div>

                        <div className="card">
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                                <CreditCard color="#FFE66D" />
                                <h3 style={{ fontWeight: "bold" }}>Pay Credit Card Bill</h3>
                            </div>
                            <p style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "10px" }}>Earn scratch cards up to <strong>₹100</strong> on bill payments &gt; ₹5000.</p>
                            <button onClick={() => handleClaim("Redirecting to Payments...")} className="btn-primary" style={{ width: "100%" }}>Pay Bill</button>
                        </div>
                    </>
                )}

                {/* WELLNESS TAB */}
                {activeTab === "wellness" && (
                    <>
                        <div className="card" style={{ background: "linear-gradient(135deg, #2a2a72, #009ffd)" }}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                                <Activity color="white" />
                                <h3 style={{ fontWeight: "bold", color: "white" }}>Free Advisor Session</h3>
                            </div>
                            <p style={{ fontSize: "0.9rem", color: "white", marginBottom: "10px" }}>1-on-1 call with a certified financial planner. (Worth ₹999)</p>
                            <button onClick={() => handleClaim("Session Booked! Check email.")} style={{ width: "100%", padding: "10px", borderRadius: "99px", border: "none", background: "white", color: "black", fontWeight: "bold", cursor: "pointer" }}>Book for Free</button>
                        </div>

                        <div className="card">
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                                <Percent color="#4ECDC4" />
                                <h3 style={{ fontWeight: "bold" }}>Risk Profile Check</h3>
                            </div>
                            <p style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "10px" }}>Understand your investment style in 2 mins.</p>
                            <button onClick={() => handleClaim("Starting Quiz...")} className="btn-primary" style={{ width: "100%" }}>Check Now</button>
                        </div>

                        <div className="card">
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                                <Shield color="#FFE66D" />
                                <h3 style={{ fontWeight: "bold" }}>Credit Score Assessment</h3>
                            </div>
                            <p style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "10px" }}>Detailed report + tips to improve your score.</p>
                            <button onClick={() => handleClaim("Fetching Report...")} className="btn-primary" style={{ width: "100%" }}>View Report</button>
                        </div>
                    </>
                )}

            </div>

            {showConfetti && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
                    <h1 style={{ fontSize: "4rem" }}>🎉</h1>
                </div>
            )}
        </div>
    );
}
