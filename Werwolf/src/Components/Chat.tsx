import {AnimatePresence, motion} from "framer-motion";
import {Moon, Send, Users} from "lucide-react";
import {useChat} from "../Hooks/useChat.ts";
import {useEffect, useRef, useState} from "react";

type ChatChannel = "village" | "werewolves";
const purpleHex = "#9b59f5";
const purpleGlow = "rgba(155,89,245,0.5)";
const redHex = "#e85d20";

export default function Chat(){
    const CHANNELS: { id: ChatChannel; label: string; icon: React.ReactNode; accent: string; glow: string }[] = [
        {id: "village", label: "Village", icon: <Users size={12}/>, accent: purpleHex, glow: "rgba(155,89,245,0.4)"},
        {id: "werewolves", label: "Werewolves", icon: <Moon size={12}/>, accent: redHex, glow: "rgba(232,93,32,0.4)"},];
    const [input, setInput] = useState("");
    const [limitFlash, setLimitFlash] = useState(false);
    const [activeChannel, setActiveChannel] = useState<ChatChannel>("village");
    const [channelPopover, setChannelPopover] = useState(false);
    const playerId = sessionStorage.getItem("playerId");
    const bottomRef = useRef<HTMLDivElement>(null);
    const roomKey = sessionStorage.getItem("roomKey");
    const {messages, sendMessage, nicknames, connected} = useChat(roomKey, playerId, activeChannel);


    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);


    return(
        <motion.div
            key="chat"
            initial={{opacity: 0, y: 6}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.2}}
            className="flex-1 flex flex-col min-h-0"
        >
            {/* Messages */}
            <div className="flex-1 flex flex-col gap-2 px-4 py-4 overflow-y-auto min-h-0 chat-scroll">
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
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: i === messages.length - 1 ? 0 : 0, duration: 0.25}}
                            className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                        >
                            {!isSelf && (
                                <span
                                    className="text-[10px] mb-0.5 px-1 tracking-wide flex items-center gap-1"
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
                            <div
                                className="px-3 py-2 rounded-xl text-xs leading-relaxed max-w-[90%] break-words"
                                style={isSelf ? {
                                    background: `linear-gradient(135deg, ${ch.accent}33, ${ch.accent}18)`,
                                    border: `1px solid ${ch.accent}44`,
                                    color: "rgba(235,220,255,0.92)",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                    letterSpacing: "0.01em",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                } : {
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    color: "rgba(200,185,220,0.82)",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                    letterSpacing: "0.01em",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                }}>
                                {msg.message}
                            </div>
                        </motion.div>
                    );
                })}
                <div ref={bottomRef}/>
            </div>

            {/* Divider */}
            <div className="mx-4 h-px flex-shrink-0"
                 style={{background: `linear-gradient(90deg, transparent, ${CHANNELS.find(c => c.id === activeChannel)!.accent}33, transparent)`}}/>

            {/* Input */}
            <div className="relative flex items-center gap-2 px-4 py-3 flex-shrink-0">

                {/* ── Channel Popover ── */}
                <div className="relative flex-shrink-0">
                    <motion.button
                        onClick={() => setChannelPopover(v => !v)}
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
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
                                initial={{opacity: 0, y: 6, scale: 0.95}}
                                animate={{opacity: 1, y: 0, scale: 1}}
                                exit={{opacity: 0, y: 6, scale: 0.95}}
                                transition={{duration: 0.18, ease: [0.16, 1, 0.3, 1]}}
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
                                            onClick={() => {
                                                setActiveChannel(ch.id);
                                                setChannelPopover(false);
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] tracking-[0.18em] uppercase text-left transition-all duration-150"
                                            style={{
                                                fontFamily: "'Cinzel', Georgia, serif",
                                                background: active ? `linear-gradient(135deg, ${ch.accent}22, ${ch.accent}0a)` : "transparent",
                                                border: `1px solid ${active ? ch.accent + "44" : "transparent"}`,
                                                color: active ? ch.accent : "rgba(180,160,200,0.45)",
                                                boxShadow: active ? `0 0 10px -4px ${ch.glow}` : "none",
                                            }}
                                        >
                                                            <span
                                                                style={{color: active ? ch.accent : "rgba(180,160,200,0.3)"}}>{ch.icon}</span>
                                            {ch.label}
                                            {active && (
                                                <span className="ml-auto text-[8px]"
                                                      style={{color: ch.accent + "88"}}>✦</span>
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
                    onChange={e => {
                        const val = e.target.value;
                        if (val.length > 250) {
                            setInput(val.slice(0, 250));
                            setLimitFlash(true);
                            setTimeout(() => setLimitFlash(false), 600);
                            return;
                        }
                        setInput(val);
                    }}
                    onKeyDown={e => {
                        if (e.key === "Enter" && input.trim()) {
                            sendMessage(input, activeChannel);
                            setInput("");
                        }
                    }}
                    placeholder={activeChannel === "village" ? "Whisper to the village…" : "Speak to the pack…"}
                    className="flex-1 bg-transparent text-xs outline-none tracking-wide"
                    style={{
                        color: "rgba(220,200,255,0.85)",
                        fontFamily: "Inter, system-ui, sans-serif",
                        caretColor: CHANNELS.find(c => c.id === activeChannel)!.accent,
                    }}
                />

                <motion.span
                    animate={{color: limitFlash ? "#e85d20" : "rgba(160,150,180,0.3)"}}
                    transition={{duration: 0.15}}
                    className="flex-shrink-0 text-[11px] select-none pointer-events-none"
                    style={{fontFamily: "Inter, system-ui, sans-serif"}}
                >
                    {input.length}/250
                </motion.span>

                <motion.button
                    onClick={() => {
                        sendMessage(input, activeChannel);
                        setInput("");
                    }}
                    whileHover={{
                        scale: 1.15,
                        filter: `drop-shadow(0 0 8px ${CHANNELS.find(c => c.id === activeChannel)!.accent})`
                    }}
                    whileTap={{scale: 0.88}}
                    transition={{duration: 0.2}}
                    className="flex items-center justify-center rounded-lg p-2 flex-shrink-0"
                    style={{
                        background: input.trim() ? `linear-gradient(135deg, ${CHANNELS.find(c => c.id === activeChannel)!.accent}55, ${CHANNELS.find(c => c.id === activeChannel)!.accent}33)` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${input.trim() ? CHANNELS.find(c => c.id === activeChannel)!.accent + "66" : "rgba(255,255,255,0.08)"}`,
                        color: input.trim() ? CHANNELS.find(c => c.id === activeChannel)!.accent : "rgba(155,89,245,0.35)",
                        transition: "background 0.25s, border 0.25s, color 0.25s",
                    }}
                >
                    <Send size={13}/>
                </motion.button>
            </div>
        </motion.div>
    )
}