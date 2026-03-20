import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  endValue: string;
  label: string;
  duration?: number;
  delay?: number;
}

export default function AnimatedCounter({ endValue, label, duration = 2, delay = 0 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const isKValue = endValue.includes('K');
    const isPlusValue = endValue.includes('+');
    
    let numericValue = parseInt(endValue.replace(/\D/g, ''));
    let suffix = '';
    
    if (isKValue) {
      suffix = 'K';
    } else if (isPlusValue) {
      suffix = '+';
    }

    const steps = 20;
    const increment = numericValue / steps;
    let currentStep = 0;

    const counter = setInterval(() => {
      currentStep++;
      const currentValue = Math.floor(increment * currentStep);
      
      if (currentStep >= steps) {
        setDisplayValue(endValue);
        clearInterval(counter);
      } else {
        setDisplayValue(currentValue + suffix);
      }
    }, duration * 1000 / steps);

    return () => clearInterval(counter);
  }, [isVisible, endValue, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-4xl sm:text-5xl font-bricolage font-bold text-primary mb-2">
        {displayValue}
      </div>
      <div className="text-sm text-muted-foreground font-medium">
        {label}
      </div>
    </motion.div>
  );
}
