"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Share2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyLinkProps {
  submissionLink: string;
  publicLink: string;
}

export const CopyLink = ({ submissionLink, publicLink }: CopyLinkProps) => {
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(false); // false = submission, true = public

  const currentLink = isPublic ? publicLink : submissionLink;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    window.open(currentLink, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Toggle Switch */}
      <div className="flex justify-center mb-4">
        <div className="relative inline-flex items-center bg-zinc-900 rounded-full p-1 border border-white/10">
          {/* Sliding background */}
          <motion.div
            className="absolute inset-y-1 w-[calc(50%-4px)] bg-cyan-500 rounded-full"
            animate={{
              x: isPublic ? '100%' : '0%',
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          />

          {/* Collect Feedback button */}
          <button
            onClick={() => setIsPublic(false)}
            className={cn(
              "relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer",
              !isPublic ? 'text-black' : 'text-zinc-400'
            )}
          >
            Collect
          </button>

          {/* Show Credibility button */}
          <button
            onClick={() => setIsPublic(true)}
            className={cn(
              "relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer",
              isPublic ? 'text-black' : 'text-zinc-400'
            )}
          >
            Show
          </button>
        </div>
      </div>

      {/* Link Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isPublic ? 'public' : 'submission'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="relative group"
          data-hover="true"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-linear-to-r from-neon-blue to-neon-purple opacity-20 blur group-hover:opacity-40 transition duration-500 rounded-xl" />

          <div className="relative flex items-center justify-between p-1 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-xl">
            <div className="flex items-center gap-3 px-4 py-3 flex-1 min-w-0">
              <div className={cn(
                "p-2 rounded-lg transition-colors duration-300 shrink-0",
                copied ? "bg-green-500/10 text-green-400" : "bg-white/5 text-zinc-400 group-hover:text-white"
              )}>
                <Share2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">
                  {isPublic ? 'Your Public Profile' : 'Send to Clients'}
                </span>
                <span className="text-sm font-mono text-zinc-200 group-hover:text-white transition-colors truncate">
                  {currentLink}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mr-1 shrink-0">
              {/* Open Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </motion.button>

              {/* Copy Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                  copied
                    ? "bg-green-500 text-zinc-950 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    : "bg-white text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                )}
              >
                <AnimatePresence mode='wait'>
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Copied</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};