
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

type ModernBackgroundProps = {
    interactive?: boolean;
};

export function ModernBackground({ interactive = true }: ModernBackgroundProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring configuration for the following effect
    const springConfig = { damping: 25, stiffness: 150 };
    const blobX = useSpring(mouseX, springConfig);
    const blobY = useSpring(mouseY, springConfig);

    useEffect(() => {
        if (!interactive) return;

        const handleMouseMove = (e: MouseEvent) => {
            // Calculate position relative to viewport
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [interactive, mouseX, mouseY]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Interactive Mouse-Following Blob - Primary Focus */}
            {interactive ? (
                <motion.div
                    style={{
                        x: blobX,
                        y: blobY,
                        translateX: '-50%',
                        translateY: '-50%',
                    }}
                    className="absolute top-0 left-0 w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] rounded-full bg-primary/10 blur-[120px] backdrop-blur-3xl opacity-60 mix-blend-screen"
                />
            ) : (
                <div className="absolute left-1/2 top-1/3 w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] backdrop-blur-3xl opacity-40" />
            )}

            {/* Subtle Grid Pattern for structure */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" />
        </div>
    );
}
