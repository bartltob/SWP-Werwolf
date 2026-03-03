import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Settings } from "lucide-react";
import { useChatStore, CHAT_WIDTH } from "../../store/chatStore";

const purpleHex = "#9b59f5";
const purpleGlow = "rgba(155,89,245,0.5)";
const amberHex = "#c8901a";

const MOCK_MESSAGES = [
    { id: 1, author: "Aldric", text: "The moon is watching us…", self: false },
    { id: 2, author: "You", text: "I don't trust the quiet ones.", self: true },
    { id: 3, author: "Mira", text: "Someone among us is not who they claim to be.", self: false },
    { id: 4, author: "You", text: "Could be anyone at this point.", self: true },
    { id: 5, author: "Dorian", text: "We vote at dawn.", self: false },
];

type Tab = "chat" | "settings";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "chat",     label: "Chat",     icon: <MessageCircle size={13} /> },
    { id: "settings", label: "Settings", icon: <Settings size={13} /> },
];

export default function Chat() {
    const [input, setInput] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>("chat");
    const { collapsed, setCollapsed } = useChatStore();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!collapsed && activeTab === "chat")
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [collapsed, activeTab]);

    return (
        <motion.div
            animate={{ x: collapsed ? CHAT_WIDTH : 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 z-50 flex h-screen"
            style={{ width: CHAT_WIDTH }}
        >
            {/* ── Toggle Tab ── */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -left-8 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-l-xl"
                style={{
                    width: 32, height: 64,
                    background: "linear-gradient(160deg, rgba(10,6,20,0.97), rgba(18,10,32,0.96))",
                    border: `1px solid ${purpleHex}44`,
                    borderRight: "none",
                    boxShadow: `-4px 0 20px -4px ${purpleGlow}`,
                }}
            >
                <motion.div
                    animate={{ rotate: collapsed ? 0 : 180 }}
                    transition={{ duration: 0.4 }}
                    style={{ color: purpleHex }}
                >
                    <MessageCircle size={14} />
                </motion.div>
            </button>

            {/* ── Panel ── */}
            <div
                className="relative flex flex-col w-full h-full"
                style={{
                    background: "linear-gradient(160deg, rgba(10,6,20,0.98), rgba(18,10,32,0.97))",
                    borderLeft: `1px solid ${purpleHex}44`,
                    boxShadow: `-6px 0 50px -10px ${purpleGlow}, inset 1px 0 0 rgba(255,255,255,0.04)`,
                }}
            >
                {/* Left edge glow */}
                <div className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
                     style={{ background: `linear-gradient(180deg, transparent, ${purpleHex}55, transparent)` }} />

                {/* Corner ornaments */}
                {["top-2 left-2 border-t border-l","top-2 right-2 border-t border-r","bottom-2 left-2 border-b border-l","bottom-2 right-2 border-b border-r"].map((cls, i) => (
                    <div key={i} className={`absolute ${cls} w-4 h-4 pointer-events-none`}
                         style={{ borderColor: `${purpleHex}55` }} />
                ))}

                {/* ── Browser Tabs ── */}
                <div className="flex flex-shrink-0" style={{ borderBottom: `1px solid ${purpleHex}33` }}>
                    {TABS.map((tab) => {
                        const active = activeTab === tab.id;
                        const accent = tab.id === "settings" ? amberHex : purpleHex;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="relative flex items-center gap-2 px-5 py-3 text-xs tracking-[0.2em] uppercase flex-1 justify-center transition-colors duration-200"
                                style={{
                                    fontFamily: "'Cinzel', Georgia, serif",
                                    color: active ? accent : "rgba(180,160,220,0.35)",
                                    background: active
                                        ? `linear-gradient(180deg, ${accent}0a, transparent)`
                                        : "transparent",
                                }}
                            >
                                <span style={{ color: active ? accent : "rgba(180,160,220,0.3)" }}>{tab.icon}</span>
                                {tab.label}
                                {/* active underline indicator */}
                                {active && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-px"
                                        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── Tab Content ── */}
                <AnimatePresence mode="wait">
                    {activeTab === "chat" ? (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 flex flex-col min-h-0"
                        >
                            {/* Messages */}
                            <div className="flex-1 flex flex-col gap-2 px-4 py-4 overflow-y-auto min-h-0">
                                {MOCK_MESSAGES.map((msg, i) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.06, duration: 0.35 }}
                                        className={`flex flex-col ${msg.self ? "items-end" : "items-start"}`}
                                    >
                                        {!msg.self && (
                                            <span className="text-[10px] tracking-[0.2em] uppercase mb-0.5 px-1"
                                                  style={{ color: `${purpleHex}99`, fontFamily: "'Cinzel', Georgia, serif" }}>
                                                {msg.author}
                                            </span>
                                        )}
                                        <div className="px-3 py-2 rounded-xl text-xs leading-relaxed max-w-[90%]"
                                             style={msg.self ? {
                                                 background: `linear-gradient(135deg, ${purpleHex}44, ${purpleHex}22)`,
                                                 border: `1px solid ${purpleHex}55`,
                                                 color: "rgba(230,215,255,0.9)",
                                                 fontFamily: "'Cinzel', Georgia, serif",
                                                 letterSpacing: "0.02em",
                                             } : {
                                                 background: "rgba(255,255,255,0.04)",
                                                 border: "1px solid rgba(255,255,255,0.08)",
                                                 color: "rgba(200,185,220,0.8)",
                                                 fontFamily: "'Cinzel', Georgia, serif",
                                                 letterSpacing: "0.02em",
                                             }}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                                <div ref={bottomRef} />
                            </div>

                            {/* Divider */}
                            <div className="mx-4 h-px flex-shrink-0"
                                 style={{ background: `linear-gradient(90deg, transparent, ${purpleHex}33, transparent)` }} />

                            {/* Input */}
                            <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Whisper to the village…"
                                    className="flex-1 bg-transparent text-xs outline-none tracking-wide"
                                    style={{
                                        color: "rgba(220,200,255,0.85)",
                                        fontFamily: "'Cinzel', Georgia, serif",
                                        caretColor: purpleHex,
                                    }}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.15, filter: `drop-shadow(0 0 8px ${purpleHex})` }}
                                    whileTap={{ scale: 0.88 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center justify-center rounded-lg p-2 flex-shrink-0"
                                    style={{
                                        background: input.trim() ? `linear-gradient(135deg, ${purpleHex}55, ${purpleHex}33)` : "rgba(255,255,255,0.04)",
                                        border: `1px solid ${input.trim() ? purpleHex + "66" : "rgba(255,255,255,0.08)"}`,
                                        color: input.trim() ? purpleHex : "rgba(155,89,245,0.35)",
                                        transition: "background 0.25s, border 0.25s, color 0.25s",
                                    }}
                                >
                                    <Send size={13} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 flex flex-col gap-5 px-5 py-6 overflow-y-auto min-h-0"
                            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                        >
                            <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: `${amberHex}88` }}>
                                ✦ Game Settings
                            </p>

                            {/* Divider */}
                            <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${amberHex}33, transparent)` }} />

                            <p className="text-xs text-center" style={{ color: "rgba(180,160,120,0.35)", fontStyle: "italic" }}>
                                — coming soon —
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
