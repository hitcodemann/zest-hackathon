"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAgent } from "@/context/AgentContext";

type Goal = {
    id: number;
    name: string;
    cost: number;
    dailySave: number;
    saved: number; // Track saved amount
};

export default function GoalAchiever() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: "", cost: "", dailySave: "" });
    const [showSuccess, setShowSuccess] = useState<Goal | null>(null);
    const [currentBalance, setCurrentBalance] = useState(0);
    const router = useRouter();
    const { notifyEvent } = useAgent();

    useEffect(() => {
        const stored = localStorage.getItem("zest_goals");
        if (stored) setGoals(JSON.parse(stored));

        // Get balance from statement analysis
        const profile = JSON.parse(localStorage.getItem("zest_financial_profile") || "{}");
        if (profile && profile.current_balance) {
            setCurrentBalance(profile.current_balance);
        }
    }, []);

    const saveGoals = (updated: Goal[]) => {
        setGoals(updated);
        localStorage.setItem("zest_goals", JSON.stringify(updated));
    };

    const addGoal = () => {
        if (!newGoal.name || !newGoal.cost) return;
        const goal: Goal = {
            id: Date.now(),
            name: newGoal.name,
            cost: Number(newGoal.cost),
            dailySave: 0, // Not needed for tracking anymore, but kept for schema
            saved: 0
        };
        saveGoals([...goals, goal]);
        localStorage.removeItem("zest_daily_quests_v4"); // Force refresh
        notifyEvent("GOAL_ADDED", newGoal.name);
        setShowAdd(false);
        setNewGoal({ name: "", cost: "", dailySave: "" });
    };

    const deleteGoal = (id: number) => {
        saveGoals(goals.filter(g => g.id !== id));
    };

    const markComplete = (goal: Goal) => {
        setShowSuccess(goal);
        notifyEvent("GOAL_COMPLETED");
    };

    return (
        <div style={{ padding: "20px", paddingBottom: "80px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Link href="/dashboard"><ArrowLeft color="white" /></Link>
                <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Goal Achiever 🎯</h1>
            </div>

            <div style={{ marginBottom: "20px", padding: "15px", background: "#333", borderRadius: "12px", border: "1px solid var(--primary)" }}>
                <p style={{ color: "#ccc", fontSize: "0.9rem" }}>Bank Balance (from Statement)</p>
                <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>₹{currentBalance.toLocaleString()}</h2>
            </div>

            {goals.length === 0 && !showAdd ? (
                <div style={{ textAlign: "center", marginTop: "50px", color: "#888" }}>
                    <p>No goals yet. Start dreaming! ✨</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {goals.map(goal => {
                        // Progress is based on Total Bank Balance vs Goal Cost
                        // Logic: Can I afford this goal with my current balance?
                        const progress = Math.min((currentBalance / goal.cost) * 100, 100);
                        const isAffordable = currentBalance >= goal.cost;

                        return (
                            <div key={goal.id} className="card">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                                    <div>
                                        <h3 style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{goal.name}</h3>
                                        <p style={{ color: "var(--primary)", fontWeight: "bold" }}>₹{goal.cost.toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => deleteGoal(goal.id)} style={{ background: "none", border: "none", color: "#666" }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div style={{ marginBottom: "10px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "5px" }}>
                                        <span>Affordability</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div style={{ width: "100%", height: "8px", background: "#333", borderRadius: "4px", overflow: "hidden" }}>
                                        <div style={{ width: `${progress}%`, height: "100%", background: isAffordable ? "#4ECDC4" : "var(--primary)" }}></div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <p style={{ fontSize: "0.9rem", color: "#ccc" }}>
                                        {isAffordable ? "You can buy this! 🎉" : `Need ₹${(goal.cost - currentBalance).toLocaleString()} more`}
                                    </p>
                                    <button
                                        onClick={() => markComplete(goal)}
                                        disabled={!isAffordable}
                                        style={{
                                            background: isAffordable ? "var(--primary)" : "#333",
                                            color: isAffordable ? "black" : "#666",
                                            padding: "8px 12px", borderRadius: "8px", cursor: isAffordable ? "pointer" : "not-allowed",
                                            fontWeight: "bold", border: "none"
                                        }}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showAdd ? (
                <div className="card" style={{ marginTop: "20px", border: "1px solid var(--primary)" }}>
                    <h3 style={{ marginBottom: "15px", fontWeight: "bold" }}>New Goal</h3>
                    <input
                        placeholder="Goal Name (e.g. Laptop)"
                        value={newGoal.name}
                        onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                        style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "none", background: "#222", color: "white" }}
                    />
                    <input
                        placeholder="Total Cost (₹)"
                        type="number"
                        value={newGoal.cost}
                        onChange={e => setNewGoal({ ...newGoal, cost: e.target.value })}
                        style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "none", background: "#222", color: "white" }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "#333", color: "white" }}>Cancel</button>
                        <button onClick={addGoal} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "var(--primary)", color: "black", fontWeight: "bold" }}>Save</button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setShowAdd(true)}
                    style={{
                        position: "fixed", bottom: "20px", right: "20px",
                        width: "60px", height: "60px", borderRadius: "50%",
                        background: "var(--primary)", border: "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.5)", cursor: "pointer"
                    }}
                >
                    <Plus size={30} color="black" />
                </button>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
                    <div style={{ background: "#111", padding: "30px", borderRadius: "20px", textAlign: "center", border: "1px solid var(--primary)", maxWidth: "400px", width: "100%" }}>
                        <CheckCircle size={60} color="var(--primary)" style={{ marginBottom: "20px", margin: "0 auto" }} />
                        <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "10px" }}>Goal Smashed! 🔨</h2>
                        <p style={{ color: "#ccc", marginBottom: "20px" }}>
                            You saved <strong>₹{showSuccess.cost}</strong> for your {showSuccess.name}.
                        </p>

                        <div style={{ background: "#222", padding: "15px", borderRadius: "12px", marginBottom: "20px", textAlign: "left" }}>
                            <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: "5px" }}>💡 Smart Move:</p>
                            <p style={{ fontSize: "0.9rem" }}>Don't spend it all! Put <strong>₹{Math.round(showSuccess.cost * 0.2)}</strong> into a High-Yield FD.</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <button
                                onClick={() => router.push("/products")}
                                className="btn-primary"
                                style={{ width: "100%" }}
                            >
                                Invest Savings 📈
                            </button>
                            <button
                                onClick={() => {
                                    deleteGoal(showSuccess.id);
                                    setShowSuccess(null);
                                }}
                                style={{ background: "none", border: "none", color: "#666", padding: "10px" }}
                            >
                                Close & Archive
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
