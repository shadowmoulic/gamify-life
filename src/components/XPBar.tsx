"use client";

import React from "react";
import { motion } from "framer-motion";

interface XPBarProps {
    level: number;
    xp: number;
    maxXP: number;
    totalXP: number;
    streak: number;
    rank: string;
}

export default function XPBar({ level, xp, maxXP, totalXP, streak, rank }: XPBarProps) {
    const progress = (xp / maxXP) * 100;

    return (
        <div className="panel panel-violet" style={{ padding: "1.25rem", background: "white" }}>
            <div className="flex-between" style={{ marginBottom: "1rem" }}>
                <div>
                    <span className="stat-label">System Core Status</span>
                    <div className="stat-value glitch" style={{ color: "var(--primary)", fontSize: "2rem" }}>LVL 0{level}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <span className="stat-label">Neural Class</span>
                    <div className="stat-value" style={{ fontSize: "0.9rem", color: "black", letterSpacing: "0.1em" }}>{rank.toUpperCase()}</div>
                </div>
            </div>

            <div style={{
                width: "100%",
                height: "20px",
                border: "4px solid black",
                background: "#eee",
                overflow: "hidden",
                position: "relative"
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    style={{
                        height: "100%",
                        background: "var(--primary)",
                        boxShadow: "0 0 20px var(--primary)",
                        position: "relative"
                    }}
                >
                    {/* Scanline effect on bar */}
                    <div style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)",
                        opacity: 0.5
                    }} />
                </motion.div>
            </div>

            <div className="flex-between" style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", gap: "20px" }}>
                    <div>
                        <span className="stat-label">Capacity:</span>
                        <span style={{ fontWeight: 900, marginLeft: "6px", fontSize: "0.9rem" }}>{Math.round(progress)}%</span>
                    </div>
                    <div>
                        <span className="stat-label">Flux:</span>
                        <span style={{ fontWeight: 900, marginLeft: "6px", fontSize: "0.9rem" }}>{xp}/{maxXP}</span>
                    </div>
                </div>
                <div>
                    <span className="stat-label">Total Gained:</span>
                    <span style={{ fontWeight: 900, marginLeft: "6px", fontSize: "0.9rem" }}>{totalXP} XP</span>
                </div>
            </div>
        </div>
    );
}
