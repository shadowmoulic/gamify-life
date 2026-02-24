"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Calendar as CalIcon,
  CheckCircle2,
  BarChart3,
  Settings2,
  MessageSquare,
  Plus,
  X,
  Target,
  Brain,
  Shield,
  Activity,
  Heart,
  Briefcase,
  Users,
  Search,
  ArrowRight
} from "lucide-react";

import XPBar from "@/components/XPBar";
import Planner from "@/components/Planner";
import Motivation from "@/components/Motivation";

type Tab = "Rate" | "Plan" | "Calendar" | "Stats" | "AI" | "Settings";

export default function Home() {
  const { data: session } = useSession();

  // -- STATE --
  const [xp, setXp] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [level, setLevel] = useState(3);
  const [streak, setStreak] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("Rate");
  const [categories, setCategories] = useState<string[]>(["Health", "Work", "Social", "Learning", "Creativity", "Mindset"]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [categoryNotes, setCategoryNotes] = useState<Record<string, string>>({});
  const [sessionNotes, setSessionNotes] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<{ role: string, content: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showXP, setShowXP] = useState<number | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [newCat, setNewCat] = useState("");

  const maxXP = 169;

  // -- PERSISTENCE --
  useEffect(() => {
    const saved = localStorage.getItem("lifequest-data-v3");
    if (saved) {
      const data = JSON.parse(saved);
      setXp(data.xp || 0);
      setTotalXp(data.totalXp || 235);
      setLevel(data.level || 3);
      setStreak(data.streak || 0);
      if (data.categories) setCategories(data.categories);
      if (data.logs) setLogs(data.logs);
    }
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("lifequest-data-v3", JSON.stringify({ xp, totalXp, level, streak, categories, logs }));
    }
  }, [xp, totalXp, level, streak, categories, logs, hasMounted]);

  // -- ACTIONS --
  const addXP = (amount: number) => {
    setTotalXp(prev => prev + amount);
    setShowXP(amount);
    setTimeout(() => setShowXP(null), 1500);
    setXp(prev => {
      const next = prev + amount;
      if (next >= maxXP) {
        setLevel(l => l + 1);
        return next - maxXP;
      }
      return next;
    });
  };

  const recordSession = () => {
    const ratingCount = Object.keys(ratings).length;
    if (ratingCount < categories.length) {
      alert("CRITICAL ERROR: ALL BIOMETRICS MUST BE SYNCED.");
      return;
    }
    const totalRatingPoints = Object.values(ratings).reduce((a, b) => a + b, 0);
    const finalXP = (totalRatingPoints * 5) + 50;

    const newLog = {
      id: Date.now(),
      date: new Date().toISOString(),
      ratings,
      categoryNotes,
      sessionNotes,
      xpGained: finalXP
    };

    setLogs([newLog, ...logs]);
    addXP(finalXP);
    setRatings({});
    setCategoryNotes({});
    setSessionNotes("");

    // Smooth scroll to top to see XP gain
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chatWithAI = async (message: string) => {
    if (!message.trim()) return;
    const newMessages = [...chatMessages, { role: "user", content: message }];
    setChatMessages(newMessages);
    setUserInput("");
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ messages: newMessages, logs: logs.slice(-3) }),
      });
      const data = await res.json();
      setChatMessages([...newMessages, { role: "assistant", content: data.insight }]);
    } catch (e) {
      setChatMessages([...newMessages, { role: "assistant", content: "TEMPORARY LINK SEVERANCE. CHECK CONDUIT." }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchCalendarEvents = async () => {
    if (!session || !(session as any).accessToken) return;
    setIsLoadingEvents(true);
    try {
      const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=5&orderBy=startTime&singleEvents=true", {
        headers: { Authorization: `Bearer ${(session as any).accessToken}` },
      });
      const data = await res.json();
      setCalendarEvents(data.items || []);
    } catch (e) {
      console.error("TEMPORAL SYNC FAILED");
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (session && activeTab === "Calendar") fetchCalendarEvents();
  }, [session, activeTab]);

  if (!hasMounted) return null;

  return (
    <div className="hud-container">
      {/* HEADER HUD */}
      <header className="flex-between" style={{ marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", letterSpacing: "-2px", fontWeight: 900 }}>LifeQuest<span style={{ color: "var(--primary)" }}>✦</span></h1>
          <p className="stat-label">System Active Node 0x72C</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="stat-value glitch" style={{ color: "var(--primary)" }}>{streak}D</div>
          <p className="stat-label">Focus Streak</p>
        </div>
      </header>

      <XPBar level={level} xp={xp} maxXP={maxXP} totalXP={totalXp} streak={streak} rank={level < 10 ? "Apprentice" : "Master"} />

      <div style={{ marginTop: "2.5rem" }}>
        <AnimatePresence mode="wait">
          {/* RATE TAB */}
          {activeTab === "Rate" && (
            <motion.div
              key="rate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="panel panel-violet" style={{ borderStyle: "dashed", marginBottom: "3rem" }}>
                <div className="flex-between">
                  <div style={{ flex: 1 }}>
                    <span className="shimmer-text stat-label">Mission Objective</span>
                    <p style={{ fontWeight: 900, fontSize: "1.2rem" }}>Synchronize Human Attributes</p>

                    <div style={{ marginTop: "1rem", height: "8px", background: "rgba(0,0,0,0.1)", border: "2px solid black", width: "80%", overflow: "hidden" }}>
                      <motion.div
                        animate={{ width: `${(Object.keys(ratings).length / categories.length) * 100}%` }}
                        style={{ height: "100%", background: "var(--primary)" }}
                      />
                    </div>
                    <p className="stat-label" style={{ marginTop: "0.5rem" }}>{Object.keys(ratings).length}/{categories.length} NODES LOGGED</p>
                  </div>
                  <Brain size={48} color="var(--primary)" strokeWidth={2.5} style={{ opacity: 0.8 }} />
                </div>
              </div>

              <div className="grid" style={{ paddingBottom: "150px" }}>
                {categories.map((cat, idx) => (
                  <motion.div
                    key={cat}
                    className="attribute-cell"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="flex-between">
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {cat === "Health" && <Heart size={16} color="#ef4444" />}
                        {cat === "Work" && <Briefcase size={16} color="#3b82f6" />}
                        {cat === "Social" && <Users size={16} color="#10b981" />}
                        <span style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "0.05em" }}>{cat.toUpperCase()}</span>
                      </div>
                      <span className="stat-label" style={{ color: ratings[cat] ? "var(--primary)" : "#ccc", fontSize: "0.6rem" }}>
                        {ratings[cat] ? `0${ratings[cat]}/05 SYNC` : "PENDING"}
                      </span>
                    </div>

                    <div className="power-grid">
                      {[1, 2, 3, 4, 5].map(n => (
                        <div
                          key={n}
                          className={`power-node ${ratings[cat] === n ? "active" : ""}`}
                          onClick={() => setRatings(prev => ({ ...prev, [cat]: n }))}
                        >
                          {n}
                        </div>
                      ))}
                    </div>

                    <input
                      placeholder={`Brief for ${cat}...`}
                      value={categoryNotes[cat] || ""}
                      onChange={(e) => setCategoryNotes(prev => ({ ...prev, [cat]: e.target.value }))}
                      className="note-input"
                      style={{ border: "none", borderLeft: "4px solid #f1f5f9", padding: "0.5rem 1rem", fontSize: "0.85rem", background: "transparent" }}
                    />
                  </motion.div>
                ))}

                <div className="panel" style={{ borderStyle: "dotted", background: "#fafafa" }}>
                  <div className="flex-between" style={{ marginBottom: "0.5rem" }}>
                    <span className="stat-label">Neural Log Summary</span>
                    <Activity size={14} color="#666" />
                  </div>
                  <textarea
                    placeholder="Provide a final state summary for the AI..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    style={{ background: "transparent", border: "none", minHeight: "80px", padding: 0, fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div className="sticky-action">
                <motion.button
                  className="launch-btn"
                  onClick={recordSession}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Finalize Neural Sync (+{(Object.values(ratings).reduce((a, b) => a + b, 0) * 5) + 50} XP)
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* PLAN TAB */}
          {activeTab === "Plan" && (
            <motion.div key="plan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Planner onGoalComplete={addXP} />
            </motion.div>
          )}

          {/* CALENDAR TAB */}
          {activeTab === "Calendar" && (
            <motion.div key="calendar" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
              <div className="panel">
                <div className="panel-title">
                  <span>Temporal Hub</span>
                  <CalIcon size={16} />
                </div>
                {!session ? (
                  <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                    <p className="stat-label" style={{ marginBottom: "1.5rem" }}>System connection to outside calendar: OFFLINE</p>
                    <button onClick={() => signIn("google")} className="launch-btn" style={{ width: "auto" }}>Forge Link</button>
                  </div>
                ) : (
                  <div>
                    <div className="flex-between" style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--accent)", border: "2px solid black" }}>
                      <span style={{ fontWeight: 900, fontSize: "0.8rem" }}>{session.user?.email?.toUpperCase()}</span>
                      <button onClick={() => signOut()} style={{ padding: "0.4rem 0.8rem", fontSize: "0.6rem", background: "black", color: "white" }}>Kill Link</button>
                    </div>
                    {isLoadingEvents ? <div style={{ textAlign: "center", padding: "2rem" }}>SYNCING...</div> : (
                      <div className="grid">
                        {calendarEvents.length > 0 ? calendarEvents.map((ev, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="panel"
                            style={{ padding: "1.25rem", marginBottom: "1rem", boxShadow: "4px 4px 0 black" }}
                          >
                            <div className="flex-between">
                              <span style={{ fontWeight: 900, fontSize: "1rem" }}>{ev.summary}</span>
                              <span className="stat-label" style={{ color: "var(--primary)" }}>{ev.start?.dateTime ? new Date(ev.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "ALL DAY"}</span>
                            </div>
                          </motion.div>
                        )) : <p className="stat-label" style={{ textAlign: "center" }}>No future events detected.</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STATS TAB */}
          {activeTab === "Stats" && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid">
                <div className="panel panel-violet">
                  <div className="panel-title">Resource Accumulation</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                    <div className="stat-value" style={{ fontSize: "3.5rem" }}>{totalXp}</div>
                    <span className="stat-label" style={{ fontSize: "1rem" }}>Focus XP</span>
                  </div>
                </div>

                <h2 style={{ fontSize: "0.9rem", color: "#666", letterSpacing: "0.2em" }}>Temporal Audit Log</h2>
                {logs.map((log, i) => (
                  <div key={log.id} className="panel" style={{ marginBottom: "1rem", borderStyle: "solid" }}>
                    <div className="flex-between">
                      <span style={{ fontWeight: 900, fontSize: "1.1rem" }}>{new Date(log.date).toLocaleDateString()}</span>
                      <span className="shimmer-text" style={{ fontWeight: 900, fontSize: "1.1rem" }}>+{log.xpGained} XP</span>
                    </div>
                    <div style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: 0.7, borderTop: "1px solid #eee", paddingTop: "0.5rem" }}>
                      {log.sessionNotes || "Standard status verification completed."}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI TAB */}
          {activeTab === "AI" && (
            <motion.div key="ai" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
              <div className="panel panel-violet" style={{ height: "550px", display: "flex", flexDirection: "column", background: "black", color: "white", padding: "10px" }}>
                <div className="panel-title" style={{ padding: "1rem", color: "white", marginBottom: 0 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Brain size={16} /> Neural Interface Agent</span>
                  <Shield size={16} color={isAnalyzing ? "var(--primary)" : "white"} />
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", background: "#111", border: "2px solid #222", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {chatMessages.length === 0 && (
                    <div style={{ opacity: 0.3, textAlign: "center", marginTop: "40%", fontSize: "0.8rem" }}>ESTABLISH COMMUNICATION...</div>
                  )}
                  {chatMessages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: m.role === "user" ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{
                        alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                        background: m.role === "user" ? "var(--primary)" : "#222",
                        color: "white",
                        padding: "1rem",
                        maxWidth: "85%",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        border: m.role === "assistant" ? "2px solid var(--primary)" : "none",
                        boxShadow: m.role === "assistant" ? "4px 4px 0 var(--primary)" : "none"
                      }}
                    >
                      {m.content}
                    </motion.div>
                  ))}
                  {isAnalyzing && (
                    <div className="stat-label" style={{ color: "var(--primary)" }}>DECRYPTING INCOMING PACKETS...</div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "1rem", padding: "0.5rem" }}>
                  <input
                    placeholder="TRANSMIT QUERY..."
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && chatWithAI(userInput)}
                    style={{ background: "#222", color: "white", border: "2px solid #444", flex: 1 }}
                  />
                  <button onClick={() => chatWithAI(userInput)} style={{ background: "var(--primary)", borderColor: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", width: "60px" }}>
                    <ArrowRight size={24} />
                  </button>
                </div>
              </div>
              <Motivation />
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "Settings" && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="panel">
                <div className="panel-title">Biometric Config</div>
                <div className="grid">
                  {categories.map(c => (
                    <div key={c} className="flex-between panel" style={{ padding: "0.75rem 1.5rem", marginBottom: 0, background: "white" }}>
                      <span style={{ fontWeight: 900 }}>{c.toUpperCase()}</span>
                      <X size={18} onClick={() => setCategories(categories.filter(x => x !== c))} style={{ cursor: "pointer", color: "red" }} />
                    </div>
                  ))}
                </div>
                <form onSubmit={e => { e.preventDefault(); if (newCat) { setCategories([...categories, newCat]); setNewCat(""); } }} style={{ marginTop: "2rem", display: "flex", gap: "12px" }}>
                  <input placeholder="Add New Neural Node..." value={newCat} onChange={e => setNewCat(e.target.value)} />
                  <button className="launch-btn" style={{ width: "80px", padding: 0, height: "60px" }}>+</button>
                </form>
              </div>
              <button onClick={() => { if (confirm("ABORT SYSTEM: THIS WILL WIPE ALL NEURAL DATA.")) { localStorage.clear(); window.location.reload(); } }} style={{ width: "100%", fontSize: "0.7rem", opacity: 0.3, background: "none", border: "none", boxShadow: "none" }}>EMERGENCY WIPE SYSTEM</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* POPUP XP */}
      <AnimatePresence>
        {showXP && (
          <motion.div key="xp-popup" className="xp-popup">
            +{showXP} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAV HUD */}
      <nav className="nav-hud">
        {(["Rate", "Plan", "Calendar", "Stats", "AI", "Settings"] as Tab[]).map((tab) => (
          <div
            key={tab}
            className={`nav-hud-item ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "Rate" && <CheckCircle2 size={24} color={activeTab === "Rate" ? "white" : "#888"} />}
            {tab === "Plan" && <Target size={24} color={activeTab === "Plan" ? "white" : "#888"} />}
            {tab === "Calendar" && <Zap size={24} color={activeTab === "Calendar" ? "white" : "#888"} />}
            {tab === "Stats" && <BarChart3 size={24} color={activeTab === "Stats" ? "white" : "#888"} />}
            {tab === "AI" && <MessageSquare size={24} color={activeTab === "AI" ? "white" : "#888"} />}
            {tab === "Settings" && <Settings2 size={24} color={activeTab === "Settings" ? "white" : "#888"} />}
            {tab === "Rate" ? "Sync" : tab === "Calendar" ? "Hub" : tab === "Settings" ? "Vital" : tab}
          </div>
        ))}
      </nav>
    </div>
  );
}
