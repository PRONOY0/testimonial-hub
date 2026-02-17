'use client';

import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LottieAnimationProps {
    animationPath: string;
    loop?: boolean;
    autoplay?: boolean;
    className?: string;
}

export default function LottieAnimation({
    animationPath,
    loop = true,
    autoplay = true,
    className = "w-48 h-48"
}: LottieAnimationProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const animation = lottie.loadAnimation({
                container: containerRef.current,
                renderer: 'svg',
                loop,
                autoplay,
                path: animationPath
            });

            return () => animation.destroy();
        }
    }, [animationPath, loop, autoplay]);

    return <div ref={containerRef} className={className} />;
}