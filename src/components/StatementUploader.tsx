"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { analyzeStatement } from "@/lib/ai-service";

export default function StatementUploader({ onComplete }: { onComplete: () => void }) {
    const [text, setText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleAnalyze = async () => {
        if (!text.trim()) return;

        setIsAnalyzing(true);
        const result = await analyzeStatement(text);

        if (result) {
            localStorage.setItem("zest_financial_profile", JSON.stringify(result));
            localStorage.setItem("zest_statement_raw", text); // Store raw text for Chat AI
            setIsDone(true);
            setTimeout(onComplete, 1500); // Wait 1.5s then proceed
        } else {
            alert("Analysis failed. Please check your API Key or try again.");
            setIsAnalyzing(false);
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center", maxWidth: "400px", width: "100%" }}>
            <div style={{ marginBottom: "20px" }}>
                <div style={{ width: "80px", height: "80px", background: "rgba(78, 205, 196, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    {isDone ? <CheckCircle size={40} color="#4ECDC4" /> : <FileText size={40} color="#4ECDC4" />}
                </div>
                <h2 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{isDone ? "Analysis Complete!" : "Upload Statement"}</h2>
                <p style={{ color: "#888", marginTop: "10px" }}>
                    {isDone ? "We've built your financial profile." : "Paste your last 3 months' summary or transaction list to personalize your AI."}
                </p>
            </div>

            {!isDone && (
                <>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste transaction text here... (e.g., 'Starbucks ₹300, Netflix ₹199, Uber ₹450...')"
                        style={{
                            width: "100%",
                            height: "150px",
                            background: "#333",
                            border: "1px solid #444",
                            borderRadius: "12px",
                            padding: "15px",
                            color: "white",
                            fontSize: "0.9rem",
                            marginBottom: "20px",
                            resize: "none"
                        }}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !text.trim()}
                        className="btn-primary"
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                    >
                        {isAnalyzing ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                        {isAnalyzing ? "Analyzing with Gemini..." : "Analyze Spending"}
                    </button>
                    <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "15px" }}>
                        🔒 Data is processed by Gemini and stored locally on your device.
                    </p>
                </>
            )}
        </div>
    );
}
