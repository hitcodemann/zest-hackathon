"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const questions = [
    {
        id: 1,
        text: "What do you spend most on daily? 💸",
        left: "Food 🍔",
        right: "Shopping 🛍️",
        key: "spending_habit",
        leftValue: "Food",
        rightValue: "Shopping",
        color: "#FF6B6B",
    },
    {
        id: 2,
        text: "Where do you want to cut costs? ✂️",
        left: "Subscriptions 📺",
        right: "Transport 🚕",
        key: "cut_cost_area",
        leftValue: "Subscriptions",
        rightValue: "Transport",
        color: "#4ECDC4",
    },
    {
        id: 3,
        text: "Want daily savings challenges? 🏆",
        left: "Nah, I'm good 🙅",
        right: "Heck yeah! 🚀",
        key: "daily_challenges",
        leftValue: "false",
        rightValue: "true",
        color: "#FFE66D",
    },
];

import StatementUploader from "./StatementUploader";

export default function Onboarding() {
    const [index, setIndex] = useState(0);
    const router = useRouter();
    const [direction, setDirection] = useState<"left" | "right" | null>(null);
    const [step, setStep] = useState<"name" | "questions" | "statement">("name");
    const [name, setName] = useState("");
    const [preferences, setPreferences] = useState<any>({});

    const handleNameSubmit = () => {
        if (name.trim()) {
            localStorage.setItem("zest_username", name);
            setStep("questions");
        }
    };

    const handleSwipe = (dir: "left" | "right") => {
        setDirection(dir);

        // Store preference
        const currentQ = questions[index];
        const value = dir === "left" ? currentQ.leftValue : currentQ.rightValue;
        const newPrefs = { ...preferences, [currentQ.key]: value };
        setPreferences(newPrefs);

        setTimeout(() => {
            if (index < questions.length - 1) {
                setIndex(index + 1);
                setDirection(null);
            } else {
                // Save all preferences
                localStorage.setItem("zest_preferences", JSON.stringify(newPrefs));
                // Go to Statement Upload Step
                setStep("statement");
            }
        }, 200);
    };

    if (step === "name") {
        return (
            <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "20px" }}>What's your name?</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={{
                        padding: "15px",
                        borderRadius: "12px",
                        border: "none",
                        background: "#333",
                        color: "white",
                        fontSize: "1.2rem",
                        width: "100%",
                        marginBottom: "20px",
                        textAlign: "center"
                    }}
                />
                <button onClick={handleNameSubmit} className="btn-primary" style={{ width: "100%" }}>Let's Go 🚀</button>
            </div>
        );
    }

    if (step === "statement") {
        return (
            <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                <StatementUploader onComplete={() => router.push("/dashboard")} />
            </div>
        );
    }

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <div style={{ width: "100%", padding: "20px", textAlign: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: "900" }}>Vibe Check</h2>
                <p style={{ color: "var(--text-muted)" }}>Swipe to build your profile</p>
            </div>

            <div style={{ position: "relative", width: "300px", height: "400px" }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={questions[index].id}
                        initial={{ scale: 0.8, opacity: 0, x: 0 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{
                            x: direction === "left" ? -500 : 500,
                            opacity: 0,
                            rotate: direction === "left" ? -20 : 20
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(e, { offset }) => {
                            if (offset.x < -100) {
                                handleSwipe("left");
                            } else if (offset.x > 100) {
                                handleSwipe("right");
                            }
                        }}
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            background: questions[index].color,
                            borderRadius: "20px",
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "black",
                            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                            cursor: "grab",
                            textAlign: "center"
                        }}
                    >
                        <h3 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>{questions[index].text}</h3>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", position: "absolute", bottom: "20px", padding: "0 20px" }}>
                            <span style={{ fontWeight: "bold", opacity: 0.7 }}>← {questions[index].left}</span>
                            <span style={{ fontWeight: "bold", opacity: 0.7 }}>{questions[index].right} →</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div style={{ marginTop: "40px", display: "flex", gap: "20px" }}>
                <button onClick={() => handleSwipe("left")} className="btn-primary" style={{ background: "#333", color: "white" }}>Left</button>
                <button onClick={() => handleSwipe("right")} className="btn-primary">Right</button>
            </div>
        </div>
    );
}
