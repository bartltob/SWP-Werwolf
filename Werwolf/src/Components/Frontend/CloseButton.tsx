import { motion } from "framer-motion";
import React from "react";

interface Props {
    onClick?: () => void;
    accentHex?: string;
    ariaLabel?: string;
    className?: string;
}

const CloseButton: React.FC<Props> = ({
                                          onClick,
                                          accentHex = "#9b59f5",
                                          ariaLabel = "Close",
                                          className = "",
                                      }) => {
    return (
        <motion.button
            onClick={onClick}
            aria-label={ariaLabel}
            whileHover={{ scale: 1.15}}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className={`absolute top-2 right-2 z-20 flex items-center justify-center w-7 h-7 rounded-full ${className}`}
            style={{
                background: `rgba(255,255,255,0.04)`,
                border: `1px solid ${accentHex}40`,
                color: `${accentHex}cc`,
                fontSize: 13,
                fontFamily: "Georgia, serif",
                lineHeight: 1,
            }}
        >
            ✕
        </motion.button>
    );
};

export default CloseButton;