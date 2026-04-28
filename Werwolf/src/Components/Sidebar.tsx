import {useEffect, useRef, useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {MessageCircle,Settings} from "lucide-react";
import {useChatStore, CHAT_WIDTH} from "../store/chatStore.ts";
import GameSettings from "./GameSettings.tsx";
import Chat from "./Chat.tsx";

const purpleHex = "#9b59f5";
const purpleGlow = "rgba(155,89,245,0.5)";
const amberHex = "#c8901a";

type Tab = "chat" | "settings";

type Props = {
    distribution: Record<string, number>;
    playerCount: number;
    isHost: boolean;
    openSettingsTrigger: number;
};

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {id: "chat", label: "Sidebar", icon: <MessageCircle size={13}/>},
    {id: "settings", label: "Settings", icon: <Settings size={13}/>},
];

export default function Sidebar({distribution, playerCount, isHost, openSettingsTrigger}: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("chat");
    const {collapsed, setCollapsed} = useChatStore();
    const bottomRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (!collapsed && activeTab === "chat")
            bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [collapsed, activeTab]);

    useEffect(() => {
        if (openSettingsTrigger === 0) return; // ignore initial load
            setActiveTab("settings");
            setCollapsed(false); // also open the sidebar if it's collapsed

    }, [openSettingsTrigger]);


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
                        <Chat/>
                    ) : (
                        <GameSettings distribution={distribution} playerCount={playerCount} isHost={isHost}/>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}