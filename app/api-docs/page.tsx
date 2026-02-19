'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Copy, Check, Zap, Shield, Globe,
    ArrowRight, Play, Server, Braces
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const CodeWindow = ({
    title,
    tabs,
    activeTab,
    onTabChange,
    children,
    actionButton
}: {
    title: string;
    tabs?: string[];
    activeTab?: string;
    onTabChange?: (t: string) => void;
    children?: React.ReactNode;
    actionButton?: React.ReactNode;
}) => {
    return (
        <div className="rounded-xl overflow-hidden bg-zinc-900/30 backdrop-blur-xl border border-white/10 shadow-2xl ring-1 ring-white/5 font-mono text-sm relative group">
            {/* Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <span className="ml-3 text-xs text-zinc-500 font-medium">{title}</span>
                </div>

                {tabs && (
                    <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-lg border border-white/5">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => onTabChange?.(tab)}
                                className={cn(
                                    "px-3 py-1 rounded-md text-[10px] uppercase tracking-wider font-medium transition-all",
                                    activeTab === tab
                                        ? "bg-white/10 text-white shadow-sm border border-white/5 backdrop-blur-md"
                                        : "text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-0 relative">
                {children}
                {actionButton && (
                    <div className="absolute top-4 right-4 z-10">
                        {actionButton}
                    </div>
                )}
            </div>
        </div>
    );
};

const MethodBadge = ({ method }: { method: string }) => (
    <span className={cn(
        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
        method === 'GET' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
            method === 'POST' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                "bg-zinc-800 text-zinc-400 border-zinc-700"
    )}>
        {method}
    </span>
);

export default function ApiDocs() {
    const [activeTab, setActiveTab] = useState("cURL");
    const [isRunning, setIsRunning] = useState(false);
    const [showOutput, setShowOutput] = useState(false);
    const [copied, setCopied] = useState(false);

    const exampleUrl = "https://testimonialhub.io/api/public/testimonials/alex";

    const handleRun = () => {
        setIsRunning(true);
        setShowOutput(false);
        setTimeout(() => {
            setIsRunning(false);
            setShowOutput(true);
        }, 1200);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const MOCK_RESPONSE = JSON.stringify({
        user: {
            name: "Alex Design",
            username: "alex",
            avatarUrl: "https://picsum.photos/...",
            tagLine: "Senior Product Designer",
            customUrl: "https://alex.design"
        },
        stats: {
            totalTestimonials: 24,
            averageRating: 4.9,
            verifiedCount: 24
        },
        testimonials: [
            {
                id: "t_123",
                name: "Sarah Jenkins",
                company: "Stripe",
                feedback: "The level of polish in Alex's work is unmatched...",
                stars: 5,
                isVerified: true,
                createdAt: "2023-10-24T10:00:00Z"
            }
        ]
    }, null, 2);

    const SNIPPETS = {
        cURL: `curl -X GET "${exampleUrl}" \\
  -H "Accept: application/json"`,

        JS: `fetch("${exampleUrl}")
  .then(response => response.json())
  .then(data => console.log(data));`,

        React: `import { useTestimonials } from './hooks';

const MyComponent = () => {
  const { data, loading } = useTestimonials('alex');
  
  if (loading) return <Skeleton />;
  
  return (
    <div>
      {data.testimonials.map(t => (
        <Card key={t.id} {...t} />
      ))}
    </div>
  );
}`
    };

    return (
        <div className="min-h-screen text-white selection:bg-neon-blue/20 relative overflow-hidden font-sans">

            {/* Glow Orbs */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 w-200 h-150 bg-neon-blue/5 blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">

                {/* HERO */}
                <div className="flex flex-col items-center text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 text-xs font-mono text-neon-blue mb-8 backdrop-blur-md"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
                        </span>
                        API Public Beta
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6"
                    >
                        Headless <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Reputation.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10"
                    >
                        Fetch verified client testimonials directly into your app.
                        No hardcoded reviews. No manual updates.
                        Clients submit feedback without accounts, with optional social and audio verification.
                        Serve real testimonials dynamically through a clean API.
                    </motion.p>

                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-4"
                    >
                        <Button className="px-6 py-2 rounded-full h-12">
                            Get API Key
                        </Button>
                        <Button className="px-6 py-2 rounded-full h-12 gap-2">
                            <Globe className="w-4 h-4" /> View Examples
                        </Button>
                    </motion.div> */}
                </div>

                {/* INTERACTIVE TERMINAL */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-32">

                    {/* Left: Context */}
                    <div className="lg:pt-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6 text-neon-blue" />
                            </div>
                            <h3 className="text-3xl font-display font-bold mb-4">Instant Integration</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                No OAuth dancing. No complex signatures. Just a simple GET request to access your entire reputation database.
                            </p>
                        </motion.div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-mono text-neon-blue">01</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Public Access</h4>
                                    <p className="text-sm text-zinc-500">Read-only endpoints are open by default. CORS is enabled for all origins.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-mono text-neon-blue">02</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">High Performance</h4>
                                    <p className="text-sm text-zinc-500">Responses are cached on the edge. Typical latency &lt;50ms.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-mono text-neon-blue">03</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-1">Rate Limits</h4>
                                    <p className="text-sm text-zinc-500">100 requests / minute per IP. Contact us for enterprise limits.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Terminal */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <CodeWindow
                            title="Live Playground"
                            tabs={['cURL', 'JS', 'React']}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            actionButton={
                                <button
                                    onClick={handleRun}
                                    disabled={isRunning}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-bold uppercase tracking-wider hover:bg-neon-blue/20 transition-all disabled:opacity-50 backdrop-blur-md cursor-pointer"
                                >
                                    {isRunning ? <span className="animate-spin">⟳</span> : <Play className="w-3 h-3 fill-current" />}
                                    {isRunning ? 'Running...' : 'Run Request'}
                                </button>
                            }
                        >
                            <div className="p-6 bg-transparent min-h-100 flex flex-col font-mono text-sm">
                                {/* Request Section */}
                                <div className="mb-6">
                                    <div className="text-zinc-500 mb-2 flex items-center gap-2">
                                        <ArrowRight className="w-3 h-3" /> Request
                                    </div>
                                    <div className="bg-black/40 rounded-lg p-4 border border-white/5 group relative backdrop-blur-sm shadow-inner">
                                        <code className="text-green-400 break-all">
                                            {SNIPPETS[activeTab as keyof typeof SNIPPETS]}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(SNIPPETS[activeTab as keyof typeof SNIPPETS])}
                                            className="absolute top-2 right-2 p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Response Section */}
                                <div className="flex-1 flex flex-col">
                                    <div className="text-zinc-500 mb-2 flex items-center gap-2">
                                        <Server className="w-3 h-3" /> Response
                                    </div>
                                    <div className="flex-1 bg-black/40 rounded-lg border border-white/5 p-4 relative overflow-hidden backdrop-blur-sm shadow-inner">
                                        <AnimatePresence mode="wait">
                                            {showOutput ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-xs leading-relaxed"
                                                >
                                                    <pre className="text-zinc-300 overflow-x-auto">
                                                        <code>{MOCK_RESPONSE}</code>
                                                    </pre>
                                                </motion.div>
                                            ) : isRunning ? (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="flex gap-1">
                                                        <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                        <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <div className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-zinc-600 italic">
                                                    Click &quot;Run Request&quot; to see output
                                                </div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </CodeWindow>
                    </motion.div>
                </div>

                {/* ENDPOINTS SECTION */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px bg-zinc-800 flex-1" />
                        <h2 className="text-xl font-display font-bold text-zinc-400 uppercase tracking-widest">Endpoints</h2>
                        <div className="h-px bg-zinc-800 flex-1" />
                    </div>

                    <div className="space-y-6">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="group bg-zinc-900/30 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <MethodBadge method="GET" />
                                    <code className="text-lg font-mono text-zinc-200">/api/public/testimonials/<span className="text-neon-purple">{'{username}'}</span></code>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Shield className="w-3 h-3" /> No Auth Required
                                </div>
                            </div>
                            <p className="text-zinc-400 mb-6 max-w-2xl">
                                Returns the public profile information, aggregated stats, and list of verified testimonials for the specified user.
                            </p>

                            {/* Collapsible Schema Preview */}
                            <div className="bg-black/40 rounded-lg p-4 font-mono text-xs border border-white/5">
                                <div className="text-zinc-500 mb-2 flex items-center gap-2">
                                    <Braces className="w-3 h-3" /> Schema Preview
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 text-zinc-400">
                                    <div>
                                        <span className="text-neon-blue">user</span>: Object
                                        <ul className="pl-4 border-l border-zinc-800 ml-1 mt-1 space-y-1">
                                            <li>name: String</li>
                                            <li>tagLine: String</li>
                                            <li>avatarUrl: String</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="text-neon-blue">testimonials</span>: Array&lt;Object&gt;
                                        <ul className="pl-4 border-l border-zinc-800 ml-1 mt-1 space-y-1">
                                            <li>id: String</li>
                                            <li>rating: Number (1-5)</li>
                                            <li>verified: Boolean</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* FOOTER CTA */}
                <div className="text-center mt-32 border-t border-white/5 pt-20">
                    <h2 className="text-3xl font-display font-bold mb-6">Ready to build?</h2>
                    <Link href="/dashboard">
                        <Button className="rounded-full px-8 h-12 py-2 opacity-70">
                            Start Collecting Data
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
};