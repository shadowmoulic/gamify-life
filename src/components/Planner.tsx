"use client";

import React, { useState } from "react";
import { Plus, Check, X, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Goal {
    id: number;
    text: string;
    completed: boolean;
    priority: "high" | "med" | "low";
}

interface PlannerProps {
    onGoalComplete: (xpGain: number) => void;
}

export default function Planner({ onGoalComplete }: PlannerProps) {
    const [goals, setGoals] = useState<Goal[]>([
        { id: 1, text: "Synchronize Morning Routine", completed: false, priority: "high" },
        { id: 2, text: "Execute Deep Work Session", completed: false, priority: "med" }
    ]);
    const [newGoal, setNewGoal] = useState("");

    const addGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoal.trim()) {
            setGoals([
                ...goals,
                {
                    id: Date.now(),
                    text: newGoal,
                    completed: false,
                    priority: "med"
                }
            ]);
            setNewGoal("");
        }
    };

    const toggleGoal = (id: number) => {
        setGoals(goals.map(g => {
            if (g.id === id && !g.completed) {
                onGoalComplete(25);
                return { ...g, completed: true };
            }
            return g;
        }));
    };

    const deleteGoal = (id: number) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    return (
        <div className="fade-in">
            <div className="panel panel-violet" style={{ background: "black", color: "white" }}>
                <div className="panel-header" style={{ color: "white" }}>
                    <span>Tactical Quest Log</span>
                    <Target size={14} />
                </div>
                <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>Complete objectives to gain focus experience.</p>
            </div>

            <div className="grid">
                <AnimatePresence>
                    {goals.map(goal => (
                        <motion.div
                            key={goal.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="panel"
                            style={{ padding: "1rem", marginBottom: "0.75rem", background: goal.completed ? "#f8fafc" : "white" }}
                        >
                            <div className="flex-between">
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div
                                        onClick={() => toggleGoal(goal.id)}
                                        style={{
                                            width: "24px",
                                            height: "24px",
                                            border: "2px solid black",
                                            background: goal.completed ? "var(--primary)" : "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {goal.completed && <Check size={16} color="white" />}
                                    </div>
                                    <span style={{
                                        fontWeight: 800,
                                        fontSize: "0.9rem",
                                        textDecoration: goal.completed ? "line-through" : "none",
                                        opacity: goal.completed ? 0.3 : 1
                                    }}>
                                        {goal.text.toUpperCase()}
                                    </span>
                                </div>
                                <X
                                    size={16}
                                    onClick={() => deleteGoal(goal.id)}
                                    className="glitch"
                                    style={{ opacity: 0.3, cursor: "pointer" }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <form onSubmit={addGoal} style={{ marginTop: "1rem", display: "flex", gap: "10px" }}>
                    <input
                        placeholder="DEFINE NEW OBJECTIVE..."
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                    />
                    <button style={{ background: "var(--primary)", color: "white", borderColor: "var(--primary)" }}>
                        <Plus size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
