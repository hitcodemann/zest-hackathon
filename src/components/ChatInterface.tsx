"use client";

import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { generateAIResponse } from "@/lib/ai-service";

type Message = {
    id: number;
    text: string;
    sender: "user" | "ai";
    type?: "text" | "action";
    actionData?: any;
};

const INITIAL_MESSAGES: Message[] = [
    { id: 1, text: "Yooo bestie! 👋", sender: "ai" },
];

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [hasKey, setHasKey] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHasKey(!!localStorage.getItem("zest_api_key"));
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Call AI Service
        const context = {
            name: localStorage.getItem("zest_username") || "Bestie",
            goals: JSON.parse(localStorage.getItem("zest_goals") || "[]"),
            financialProfile: JSON.parse(localStorage.getItem("zest_financial_profile") || "null"),
            statementText: localStorage.getItem("zest_statement_raw") || ""
        };

        setIsTyping(true);

        try {
            const aiText = await generateAIResponse(input, context);
            const aiMsg: Message = { id: Date.now() + 1, text: aiText, sender: "ai" };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "black" }}>
            {/* Header */}
            <div style={{ padding: "20px", borderBottom: "1px solid #333", display: "flex", alignItems: "center", gap: "10px" }}>
                <Link href="/dashboard"><ArrowLeft color="white" /></Link>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "black" }}>Z</div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: "bold" }}>Money Twin 👯‍♀️</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--primary)" }}>Online</p>
                </div>
                <button
                    onClick={() => {
                        const key = prompt("Enter Gemini API Key:");
                        if (key) {
                            localStorage.setItem("zest_api_key", key);
                            setHasKey(true);
                        }
                    }}
                    style={{
                        background: hasKey ? "none" : "var(--primary)",
                        border: hasKey ? "none" : "2px solid var(--primary)",
                        borderRadius: hasKey ? "0" : "99px",
                        padding: hasKey ? "0" : "8px 16px",
                        cursor: "pointer",
                        fontSize: hasKey ? "1.2rem" : "0.9rem",
                        fontWeight: "bold",
                        color: hasKey ? "white" : "black"
                    }}
                >
                    {hasKey ? "⚙️" : "🔑 Set API Key"}
                </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{
                        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                        maxWidth: "80%",
                        padding: "12px 16px",
                        borderRadius: "20px",
                        background: msg.sender === "user" ? "var(--primary)" : "#333",
                        color: msg.sender === "user" ? "black" : "white",
                        borderBottomRightRadius: msg.sender === "user" ? "4px" : "20px",
                        borderBottomLeftRadius: msg.sender === "ai" ? "4px" : "20px",
                    }}>
                        {msg.text}
                    </div>
                ))}
            </div>

            {isTyping && (
                <div style={{ alignSelf: "flex-start", padding: "12px 16px", borderRadius: "20px", background: "#333", color: "#888", fontSize: "0.8rem", marginLeft: "20px", marginBottom: "10px" }}>
                    Typing...
                </div>
            )}

            {/* Input */}
            <div style={{ padding: "20px", borderTop: "1px solid #333", display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask me anything..."
                    style={{ flex: 1, padding: "12px", borderRadius: "999px", border: "none", background: "#333", color: "white", outline: "none" }}
                />
                <button onClick={handleSend} style={{ width: "45px", height: "45px", borderRadius: "50%", background: "var(--primary)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Send size={20} color="black" />
                </button>
            </div>
        </div>
    );
}
