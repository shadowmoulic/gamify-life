"use client";

import React, { useState, useEffect } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval,
    isToday
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarViewProps {
    session: any;
    events: any[];
    isLoading: boolean;
    onRefresh: () => void;
}

export default function CalendarView({ session, events, isLoading, onRefresh }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState<"month" | "week" | "day">("month");

    const renderHeader = () => {
        return (
            <div className="flex-between" style={{ marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={{ padding: "5px" }}><ChevronLeft size={16} /></button>
                    <h2 style={{ fontSize: "1rem", minWidth: "120px", textAlign: "center" }}>{format(currentMonth, "MMMM yyyy").toUpperCase()}</h2>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={{ padding: "5px" }}><ChevronRight size={16} /></button>
                </div>
                <div className="calendar-header-actions" style={{ marginBottom: 0 }}>
                    {(["month", "week", "day"] as const).map(v => (
                        <div key={v} className={`view-pill ${view === v ? "active" : ""}`} onClick={() => setView(v)}>
                            {v.toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return (
            <div className="calendar-grid" style={{ borderBottom: "1px solid #eee", paddingBottom: "5px", marginBottom: "5px" }}>
                {days.map(d => <div key={d} style={{ color: "#aaa", fontSize: "0.6rem", textAlign: "center", fontWeight: 900 }}>{d.toUpperCase()}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);

        let startDate, endDate;

        if (view === "month") {
            startDate = startOfWeek(monthStart);
            endDate = endOfWeek(monthEnd);
        } else if (view === "week") {
            startDate = startOfWeek(selectedDate);
            endDate = endOfWeek(selectedDate);
        } else {
            startDate = selectedDate;
            endDate = selectedDate;
        }

        const allDays = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="calendar-grid">
                {allDays.map((d, i) => {
                    const hasEvent = events.some(e => e.start?.dateTime && isSameDay(new Date(e.start.dateTime), d));
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`calendar-day ${!isSameMonth(d, monthStart) && view === "month" ? "disabled" : ""} ${isSameDay(d, selectedDate) ? "active" : ""} ${isToday(d) ? "today" : ""}`}
                            onClick={() => setSelectedDate(d)}
                            style={{
                                opacity: isSameMonth(d, monthStart) || view !== "month" ? 1 : 0.2,
                                height: view === "day" ? "120px" : "auto"
                            }}
                        >
                            <span style={{ fontSize: view === "day" ? "2rem" : "0.7rem" }}>{format(d, "d")}</span>
                            {hasEvent && <div className="event-dot" style={{ width: view === "day" ? "10px" : "4px", height: view === "day" ? "10px" : "4px" }} />}
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    const renderSelectedEvents = () => {
        const dayEvents = events.filter(e => e.start?.dateTime && isSameDay(new Date(e.start.dateTime), selectedDate));
        return (
            <div style={{ marginTop: "1.5rem" }}>
                <div className="flex-between">
                    <h3 className="stat-label">Events for {format(selectedDate, "MMM do")}</h3>
                    <button style={{ padding: "0.2rem 0.6rem", fontSize: "0.6rem" }} onClick={() => alert("Redirecting to Google Calendar to add event...")}>+ ADD TASK</button>
                </div>
                <div className="grid" style={{ marginTop: "10px" }}>
                    {dayEvents.length > 0 ? dayEvents.map((e, i) => (
                        <div key={i} className="panel" style={{ padding: "0.75rem", marginBottom: "0.5rem", boxShadow: "4px 4px 0 var(--primary)" }}>
                            <div className="flex-between">
                                <span style={{ fontWeight: 900 }}>{e.summary}</span>
                                <span className="stat-label">{format(new Date(e.start.dateTime), "p")}</span>
                            </div>
                        </div>
                    )) : <div style={{ opacity: 0.3, fontSize: "0.8rem", padding: "1rem", border: "1px dashed #ccc", textAlign: "center" }}>No entries for this temporal node.</div>}
                </div>
            </div>
        )
    }

    return (
        <div className="panel animate-in">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            {renderSelectedEvents()}
            <button onClick={onRefresh} style={{ width: "100%", marginTop: "1rem", fontSize: "0.7rem", opacity: 0.5 }}>FORCE RE-SYNC</button>
        </div>
    );
}
