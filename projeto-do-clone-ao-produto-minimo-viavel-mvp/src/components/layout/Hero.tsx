import { motion } from "motion/react";
import { useQR } from "../../context/QRContext";

interface HeroProps {
  accentColor?: string;
}

export function Hero({ accentColor = "#4267b2" }: HeroProps) {
  const { t } = useQR();

  return (
    <section 
      className="relative py-20 px-10 text-left overflow-hidden bg-transparent border-b-2 border-ink border-sketch"
    >
      {/* Hand-drawn doodles in background */}
      <div className="absolute top-10 right-20 opacity-20 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 100 Q 50 20, 100 100 T 180 100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="150" cy="50" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
          <path d="M40 150 L 160 150" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="10 10" />
        </svg>
      </div>
      <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none rotate-12">
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="100" height="100" rx="10" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
          <path d="M30 30 L 120 120" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl sm:text-7xl md:text-8xl font-hand font-bold text-ink mb-8 tracking-tight"
        >
          {t('heroTagline')}
        </motion.h1>
      </div>
    </section>
  );
}
