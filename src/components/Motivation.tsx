"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const quotes = [
    "PROTOCOL 01: EMOTION IS DATA. USE IT.",
    "SYSTEM OPTIMIZATION IN PROGRESS. DO NOT HALT.",
    "BIOMETRICS STABLE. VELOCITY INCREASING.",
    "THE WEAKNESS IS NOT IN THE SYSTEM, BUT IN THE EXECUTION.",
    "CORE ARCHITECTURE REQUIRES CONSISTENT INPUT.",
    "NEURAL SYNC COMPLETE. PROCEED TO NEXT OBJECTIVE."
];

export default function Motivation() {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                padding: "1.5rem",
                border: "3px dashed var(--primary)",
                marginTop: "2.5rem",
                textAlign: "center",
                fontSize: "0.8rem",
                letterSpacing: "0.2em",
                fontWeight: 900,
                color: "var(--primary)",
                background: "var(--primary-glow)",
                textTransform: "uppercase"
            }}
        >
            <div className="stat-label" style={{ marginBottom: "0.5rem", color: "black" }}>INC_SYSTEM_MSG</div>
            "{quote}"
        </motion.div>
    );
}
