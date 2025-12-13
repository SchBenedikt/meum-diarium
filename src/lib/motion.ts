import { Transition, Variants } from 'framer-motion';

// Shared motion presets to keep easing and timing consistent across the app
export const defaultTransition: Transition = {
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1],
};

export const quickTransition: Transition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1],
};

export const fadeUp = (delay = 0, distance = 16): Variants => ({
  hidden: { opacity: 0, y: distance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...defaultTransition, delay },
  },
});

export const fadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { ...defaultTransition, delay } },
});

export const scaleIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...defaultTransition, delay },
  },
});

export const staggerContainer = (stagger = 0.08): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      when: 'beforeChildren',
    },
  },
});
