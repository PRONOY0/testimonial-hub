"use client";

import Cursor from "@/components/Cursor";
import { Navbar } from "@/components/layout/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import { AnimatePresence } from "framer-motion";
// import Footer from "@/components/Footer";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen text-foreground antialiased selection:bg-neon-blue/30 selection:text-white overflow-hidden">

            {/* Background layers */}
            <div className="fixed inset-0 -z-10">
                {/* Pure black */}
                <div className="absolute inset-0 bg-black" />

                {/* Noise texture */}
                <div className="noise-bg" />
                
                {/* Animated aurora strips */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-0 right-0 h-[300px] bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 blur-3xl animate-aurora" />
                    <div className="absolute bottom-1/4 left-0 right-0 h-[250px] bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30 blur-3xl animate-aurora-reverse" />
                </div>

                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6))]" />
            </div>

            <SmoothScroll>
                <Cursor />
                <Navbar />
                <AnimatePresence mode="wait">
                    {children}
                </AnimatePresence>
            </SmoothScroll>
        </div>
    );
}