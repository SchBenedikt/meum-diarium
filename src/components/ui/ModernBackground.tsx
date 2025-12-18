
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

export function ModernBackground() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring configuration for the following effect
    const springConfig = { damping: 25, stiffness: 150 };
    const blobX = useSpring(mouseX, springConfig);
    const blobY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate position relative to viewport
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Interactive Mouse-Following Blob - Primary Focus */}
            <motion.div
                style={{
                    x: blobX,
                    y: blobY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                className="absolute top-0 left-0 w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] rounded-full bg-primary/15 blur-[120px] opacity-60 mix-blend-screen"
            />

            {/* Subtle Grid Pattern for structure */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" />
        </div>
    );
}
