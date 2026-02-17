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

            {/* Near-black refractive background */}
            <div className="absolute inset-0 -z-10">
                {/* Base black */}
                <div className="absolute inset-0 bg-background" />

                {/* Subtle radial light 1 */}
                <div className="absolute top-[-20%] left-[-10%] w-150 h-150 
      bg-white/3 rounded-full blur-3xl" />

                {/* Subtle radial light 2 */}
                <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 
      bg-white/2 rounded-full blur-3xl" />

                {/* Soft vignette */}
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
