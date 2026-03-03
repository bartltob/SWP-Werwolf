import { useRef, useEffect, useState } from "react";
import {motion, AnimatePresence} from "framer-motion";
import {Send, MessageCircle, Settings, Users, Moon} from "lucide-react";
import {useChatStore, CHAT_WIDTH} from "../../store/chatStore";
import {useChat} from "../../Hooks/useChat";

const purpleHex = "#9b59f5";
const purpleGlow = "rgba(155,89,245,0.5)";
const amberHex = "#c8901a";
const redHex = "#e85d20";

type Tab = "chat" | "settings";
type ChatChannel = "village" | "werewolves";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {id: "chat", label: "Chat", icon: <MessageCircle size={13}/>},
    {id: "settings", label: "Settings", icon: <Settings size={13}/>},
];

const CHANNELS: { id: ChatChannel; label: string; icon: React.ReactNode; accent: string; glow: string }[] = [
    { id: "village",    label: "Village",    icon: <Users size={12} />,  accent: purpleHex, glow: "rgba(155,89,245,0.4)" },
    { id: "werewolves", label: "Werewolves", icon: <Moon  size={12} />,  accent: redHex,    glow: "rgba(232,93,32,0.4)"  },
];

export default function Chat() {
    const [input, setInput] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>("chat");
    const [activeChannel, setActiveChannel] = useState<ChatChannel>("village");
    const [channelPopover, setChannelPopover] = useState(false);
    const {collapsed, setCollapsed} = useChatStore();
    const bottomRef = useRef<HTMLDivElement>(null);

    const playerId = sessionStorage.getItem("playerId");
    const roomKey = sessionStorage.getItem("roomKey");
    const {messages, sendMessage, nicknames, connected} = useChat(roomKey, playerId, activeChannel);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!collapsed && activeTab === "chat")
            bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [collapsed, activeTab]);

    return (
        <motion.div
            animate={{x: collapsed ? CHAT_WIDTH : 0}}
            transition={{duration: 0.45, ease: [0.16, 1, 0.3, 1]}}
            className="fixed top-0 right-0 z-50 flex h-screen"
            style={{width: CHAT_WIDTH}}
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
                    animate={{rotate: collapsed ? 0 : 180}}
                    transition={{duration: 0.4}}
                    style={{color: purpleHex}}
                >
                    <MessageCircle size={14}/>
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
                     style={{background: `linear-gradient(180deg, transparent, ${purpleHex}55, transparent)`}}/>

                {/* Corner ornaments */}
                {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((cls, i) => (
                    <div key={i} className={`absolute ${cls} w-4 h-4 pointer-events-none`}
                         style={{borderColor: `${purpleHex}55`}}/>
                ))}

                {/* ── Browser Tabs ── */}
                <div className="flex flex-shrink-0" style={{borderBottom: `1px solid ${purpleHex}33`}}>
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
                                <span style={{color: active ? accent : "rgba(180,160,220,0.3)"}}>{tab.icon}</span>
                                {tab.label}
                                {/* active underline indicator */}
                                {active && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-px"
                                        style={{background: `linear-gradient(90deg, transparent, ${accent}, transparent)`}}
                                        transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
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
                            initial={{opacity: 0, y: 6}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -6}}
                            transition={{duration: 0.2}}
                            className="flex-1 flex flex-col min-h-0"
                        >
                            {/* Messages */}
                            <div className="flex-1 flex flex-col gap-2 px-4 py-4 overflow-y-auto min-h-0">
                                {messages.length === 0 && (
                                    <p className="text-center text-xs mt-4" style={{
                                        color: "rgba(180,160,200,0.25)",
                                        fontFamily: "'Cinzel', Georgia, serif",
                                        letterSpacing: "0.15em",
                                    }}>
                                        — silence —
                                    </p>
                                )}
                                {messages.map((msg, i) => {
                                    const isSelf = msg.sender === playerId;
                                    const ch = CHANNELS.find(c => c.id === activeChannel)!;
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i === messages.length - 1 ? 0 : 0, duration: 0.25 }}
                                            className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                                        >
                                            {!isSelf && (
                                                <span className="text-[10px] mb-0.5 px-1 tracking-wide flex items-center gap-1"
                                                      style={{
                                                          color: !connected[msg.sender]
                                                              ? "rgba(160,160,160,0.4)"
                                                              : `${ch.accent}99`,
                                                          fontFamily: "Inter, system-ui, sans-serif",
                                                          fontWeight: 600,
                                                          fontStyle: !connected[msg.sender] ? "italic" : "normal",
                                                      }}>
                                                    {!connected[msg.sender]
                                                        ? "Disconnected"
                                                        : (nicknames[msg.sender] ?? msg.sender)}
                                                </span>
                                            )}
                                            <div className="px-3 py-2 rounded-xl text-xs leading-relaxed max-w-[90%]"
                                                 style={isSelf ? {
                                                     background: `linear-gradient(135deg, ${ch.accent}33, ${ch.accent}18)`,
                                                     border: `1px solid ${ch.accent}44`,
                                                     color: "rgba(235,220,255,0.92)",
                                                     fontFamily: "Inter, system-ui, sans-serif",
                                                     letterSpacing: "0.01em",
                                                 } : {
                                                     background: "rgba(255,255,255,0.04)",
                                                     border: "1px solid rgba(255,255,255,0.07)",
                                                     color: "rgba(200,185,220,0.82)",
                                                     fontFamily: "Inter, system-ui, sans-serif",
                                                     letterSpacing: "0.01em",
                                                 }}>
                                                {msg.message}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </div>

                            {/* Divider */}
                            <div className="mx-4 h-px flex-shrink-0"
                                 style={{ background: `linear-gradient(90deg, transparent, ${CHANNELS.find(c => c.id === activeChannel)!.accent}33, transparent)` }} />

                            {/* Input */}
                            <div className="relative flex items-center gap-2 px-4 py-3 flex-shrink-0">

                                {/* ── Channel Popover ── */}
                                <div className="relative flex-shrink-0">
                                    <motion.button
                                        onClick={() => setChannelPopover(v => !v)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="flex items-center justify-center rounded-lg p-2"
                                        style={{
                                            background: channelPopover
                                                ? `linear-gradient(135deg, ${CHANNELS.find(c => c.id === activeChannel)!.accent}33, ${CHANNELS.find(c => c.id === activeChannel)!.accent}11)`
                                                : "rgba(255,255,255,0.04)",
                                            border: `1px solid ${channelPopover ? CHANNELS.find(c => c.id === activeChannel)!.accent + "66" : "rgba(255,255,255,0.08)"}`,
                                            color: CHANNELS.find(c => c.id === activeChannel)!.accent,
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {CHANNELS.find(c => c.id === activeChannel)!.icon}
                                    </motion.button>

                                    <AnimatePresence>
                                        {channelPopover && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                                                className="absolute bottom-full left-0 mb-2 flex flex-col gap-1 p-1.5 rounded-xl min-w-[140px]"
                                                style={{
                                                    background: "linear-gradient(160deg, rgba(12,7,24,0.99), rgba(20,12,35,0.98))",
                                                    border: `1px solid ${purpleHex}33`,
                                                    boxShadow: `0 -8px 32px -8px ${purpleGlow}`,
                                                }}
                                            >
                                                {/* "werewolves"-Channel nur anzeigen wenn
                                                     er eigene Spieler role === "werewolf" hat.
                                                     Rolle aus Firebase lesen: rooms/${roomKey}/players/${playerId}/role
                                                     oder aus einem globalen Player-State */}
                                                {CHANNELS.map((ch) => {
                                                    const active = activeChannel === ch.id;
                                                    return (
                                                        <button
                                                            key={ch.id}
                                                            onClick={() => { setActiveChannel(ch.id); setChannelPopover(false); }}
                                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] tracking-[0.18em] uppercase text-left transition-all duration-150"
                                                            style={{
                                                                fontFamily: "'Cinzel', Georgia, serif",
                                                                background: active ? `linear-gradient(135deg, ${ch.accent}22, ${ch.accent}0a)` : "transparent",
                                                                border: `1px solid ${active ? ch.accent + "44" : "transparent"}`,
                                                                color: active ? ch.accent : "rgba(180,160,200,0.45)",
                                                                boxShadow: active ? `0 0 10px -4px ${ch.glow}` : "none",
                                                            }}
                                                        >
                                                            <span style={{ color: active ? ch.accent : "rgba(180,160,200,0.3)" }}>{ch.icon}</span>
                                                            {ch.label}
                                                            {active && (
                                                                <span className="ml-auto text-[8px]" style={{ color: ch.accent + "88" }}>✦</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter" && input.trim()) { sendMessage(input, activeChannel); setInput(""); } }}
                                    placeholder={activeChannel === "village" ? "Whisper to the village…" : "Speak to the pack…"}
                                    className="flex-1 bg-transparent text-xs outline-none tracking-wide"
                                    style={{
                                        color: "rgba(220,200,255,0.85)",
                                        fontFamily: "Inter, system-ui, sans-serif",
                                        caretColor: CHANNELS.find(c => c.id === activeChannel)!.accent,
                                    }}
                                />
                                <motion.button
                                    onClick={() => { sendMessage(input, activeChannel); setInput(""); }}
                                    whileHover={{ scale: 1.15, filter: `drop-shadow(0 0 8px ${CHANNELS.find(c => c.id === activeChannel)!.accent})` }}
                                    whileTap={{ scale: 0.88 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center justify-center rounded-lg p-2 flex-shrink-0"
                                    style={{
                                        background: input.trim() ? `linear-gradient(135deg, ${CHANNELS.find(c => c.id === activeChannel)!.accent}55, ${CHANNELS.find(c => c.id === activeChannel)!.accent}33)` : "rgba(255,255,255,0.04)",
                                        border: `1px solid ${input.trim() ? CHANNELS.find(c => c.id === activeChannel)!.accent + "66" : "rgba(255,255,255,0.08)"}`,
                                        color: input.trim() ? CHANNELS.find(c => c.id === activeChannel)!.accent : "rgba(155,89,245,0.35)",
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