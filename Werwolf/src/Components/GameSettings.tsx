import {motion} from "framer-motion";
import {socket} from "../socket.ts";
import {useEffect, useState} from "react";

const purpleHex = "#9b59f5";
const amberHex = "#c8901a";
const redHex = "#e85d20";

type Props = {
    distribution: Record<string, number>;
    playerCount: number;
    isHost: boolean;
};


export default function GameSettings({distribution, playerCount, isHost}: Props){
    const [customDist, setCustomDist] = useState<Record<string, number>>({});
    const [allCards] = useState<string[]>(["Werewolf", "Seer", "Witch", "Hunter", "Cupid", "Villager"]);

    const playerId = sessionStorage.getItem("playerId");
    const roomKey = sessionStorage.getItem("roomKey");

    useEffect(() => {
        setCustomDist(distribution);
    }, [distribution]);

    return (
        <motion.div
            key="settings"
            initial={{opacity: 0, y: 6}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -6}}
            transition={{duration: 0.2}}
            className="flex-1 flex flex-col min-h-0"
            style={{fontFamily: "'Cinzel', Georgia, serif"}}
        >
            {/* Header */}
            <div className="px-5 pt-5 pb-3 shrink-0">
                <p className="text-[10px] tracking-[0.3em] uppercase" style={{color: `${amberHex}88`}}>
                    ✦ Card Distribution
                </p>
                <div className="mt-2 h-px"
                     style={{background: `linear-gradient(90deg, transparent, ${amberHex}33, transparent)`}}/>

                {/* Total counter */}
                <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] tracking-widest uppercase" style={{color: "rgba(200,180,140,0.4)"}}>
                Total cards
            </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md"
                          style={{
                              color: Object.values(customDist).reduce((a, b) => a + b, 0) === playerCount
                                  ? amberHex
                                  : redHex,
                              background: Object.values(customDist).reduce((a, b) => a + b, 0) === playerCount
                                  ? `${amberHex}18`
                                  : `${redHex}18`,
                              border: `1px solid ${Object.values(customDist).reduce((a, b) => a + b, 0) === playerCount ? amberHex : redHex}33`,
                          }}>
                {Object.values(customDist).reduce((a, b) => a + b, 0)} / {playerCount}
            </span>
                </div>
            </div>

            {/* Card list — scrollable */}
            <div className="flex-1 flex flex-col gap-2 px-5 pb-4 overflow-y-auto min-h-0 chat-scroll">
                {allCards.map((role) => {
                    const isWolf = role === "Werewolf";
                    const accent = isWolf ? redHex : purpleHex;
                    const count = customDist[role] ?? 0;
                    const icons: Record<string, string> = {
                        Werewolf: "🐺", Seer: "👁", Witch: "🧙",
                        Hunter: "🏹", Cupid: "💘", Villager: "🌾",
                    };
                    const isActive = count > 0;

                    return (
                        <div
                            key={role}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                            style={{
                                background: isActive ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.15)",
                                border: `1px solid ${isActive ? accent + "33" : "rgba(255,255,255,0.05)"}`,
                                transition: "all 0.2s",
                            }}
                        >
                    <span className="text-base w-6 text-center" style={{opacity: isActive ? 1 : 0.3}}>
                        {icons[role] ?? "❓"}
                    </span>
                            <span className="flex-1 text-xs tracking-[0.1em] uppercase"
                                  style={{color: isActive ? "rgba(235,215,255,0.85)" : "rgba(180,160,200,0.3)"}}>
                        {role}
                    </span>

                            {/* +/- Controls */}
                            {isHost ? (
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileTap={{scale: 0.85}}
                                        onClick={() => {
                                            if (count <= 0) return;
                                            const next = {...customDist, [role]: count - 1};
                                            setCustomDist(next);
                                        }}
                                        className="w-6 h-6 rounded-md flex items-center justify-center text-sm leading-none"
                                        style={{
                                            background: count > 0 ? `${accent}22` : "rgba(255,255,255,0.04)",
                                            border: `1px solid ${count > 0 ? accent + "44" : "rgba(255,255,255,0.06)"}`,
                                            color: count > 0 ? accent : "rgba(180,160,200,0.2)",
                                            cursor: count > 0 ? "pointer" : "not-allowed",
                                        }}
                                    >−
                                    </motion.button>

                                    <span className="text-xs font-mono w-4 text-center"
                                          style={{color: isActive ? accent : "rgba(180,160,200,0.25)"}}>
                                {count}
                            </span>
                                    <motion.button
                                        whileTap={{scale: 0.85}}
                                        onClick={() => {
                                            const next = {...customDist, [role]: count + 1};
                                            setCustomDist(next);
                                        }}
                                        className="w-6 h-6 rounded-md flex items-center justify-center text-sm leading-none"
                                        style={{
                                            background: `${accent}22`,
                                            border: `1px solid ${accent}44`,
                                            color: accent,
                                            cursor: "pointer",
                                        }}
                                    >+
                                    </motion.button>
                                </div>
                            ) : (
                                <span className="text-xs font-mono w-4 text-center"
                                      style={{color: isActive ? accent : "rgba(180,160,200,0.25)"}}>
                            {count}
                        </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Apply button — nur Host, nur wenn total === playerCount */}
            {isHost && (
                <div className="px-5 pb-5 shrink-0">
                    <div className="h-px mb-4"
                         style={{background: `linear-gradient(90deg, transparent, ${amberHex}22, transparent)`}}/>
                    <motion.button
                        whileTap={{scale: 0.97}}
                        disabled={Object.values(customDist).reduce((a, b) => a + b, 0) !== playerCount}
                        onClick={() => {
                            socket.emit("updateDistribution", {
                                roomId: roomKey,
                                distribution: customDist,
                                playerId,
                            });
                        }}
                        className="w-full py-2.5 rounded-xl text-xs tracking-[0.2em] uppercase"
                        style={{
                            fontFamily: "'Cinzel', Georgia, serif",
                            background: Object.values(customDist).reduce((a, b) => a + b, 0) === playerCount
                                ? `linear-gradient(135deg, ${amberHex}44, ${amberHex}22)`
                                : "rgba(255,255,255,0.03)",
                            border: `1px solid ${Object.values(customDist).reduce((a, b) => a + b, 0) === playerCount ? amberHex + "55" : "rgba(255,255,255,0.06)"}`,
                            color: Object.values(customDist).reduce((a, b) => a + b, 0) === playerCount
                                ? amberHex
                                : "rgba(180,160,120,0.2)",
                            cursor: Object.values(customDist).reduce((a, b) => a + b, 0) === playerCount ? "pointer" : "not-allowed",
                            transition: "all 0.25s",
                        }}
                    >
                        Apply Distribution
                    </motion.button>
                </div>
            )}
        </motion.div>
        )
}