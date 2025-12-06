"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ARMirror() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mode, setMode] = useState<"rich" | "broke">("rich");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function setupCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                setError("Camera access denied or not available.");
            }
        }
        setupCamera();
    }, []);

    return (
        <div style={{ position: "relative", height: "100vh", background: "black", overflow: "hidden" }}>
            <Link href="/dashboard" style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
                <ArrowLeft color="white" size={30} />
            </Link>

            {error ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "white" }}>
                    {error}
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            )}

            {/* Overlays */}
            <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", pointerEvents: "none" }}>
                {mode === "rich" ? (
                    <>
                        <div style={{ position: "absolute", top: "10%", right: "10%", fontSize: "4rem" }}>💰</div>
                        <div style={{ position: "absolute", bottom: "20%", left: "10%", fontSize: "5rem" }}>🏎️</div>
                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", border: "5px solid gold", padding: "20px", borderRadius: "20px", color: "gold", fontWeight: "bold", fontSize: "2rem", textShadow: "0 0 10px black" }}>
                            FUTURE MILLIONAIRE
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ position: "absolute", top: "10%", right: "10%", fontSize: "4rem" }}>💸</div>
                        <div style={{ position: "absolute", bottom: "20%", left: "10%", fontSize: "5rem" }}>🍜</div>
                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", border: "5px solid red", padding: "20px", borderRadius: "20px", color: "red", fontWeight: "bold", fontSize: "2rem", textShadow: "0 0 10px black" }}>
                            BROKE BOI
                        </div>
                    </>
                )}
            </div>

            {/* Controls */}
            <div style={{ position: "absolute", bottom: "40px", width: "100%", display: "flex", justifyContent: "center", gap: "20px", zIndex: 10 }}>
                <button
                    onClick={() => setMode("rich")}
                    style={{
                        background: mode === "rich" ? "gold" : "rgba(255,255,255,0.2)",
                        color: mode === "rich" ? "black" : "white",
                        border: "none", padding: "15px 30px", borderRadius: "99px", fontWeight: "bold", fontSize: "1.2rem", cursor: "pointer"
                    }}
                >
                    Rich You
                </button>
                <button
                    onClick={() => setMode("broke")}
                    style={{
                        background: mode === "broke" ? "red" : "rgba(255,255,255,0.2)",
                        color: "white",
                        border: "none", padding: "15px 30px", borderRadius: "99px", fontWeight: "bold", fontSize: "1.2rem", cursor: "pointer"
                    }}
                >
                    Broke You
                </button>
            </div>
        </div>
    );
}
