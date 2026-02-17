import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(
        "relative px-10 py-4 rounded-full",
        "text-white font-semibold text-lg",
        "bg-transparent",
        "backdrop-blur-3xl",
        "border border-white/25",
        "shadow-[0_8px_32px_rgba(0,0,0,0.25)] cursor-none",
        className
      )}
      {...props}
    >
      {/* subtle top edge highlight */}
      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-40" />

      {/* inner stroke for depth */}
      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/20" />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
