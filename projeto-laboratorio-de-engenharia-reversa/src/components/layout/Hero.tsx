import { motion } from "motion/react";

interface HeroProps {
  accentColor?: string;
}

export function Hero({ accentColor = "#4267b2" }: HeroProps) {
  return (
    <section 
      className="relative py-20 px-10 text-left overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #000000 0%, ${accentColor} 60%, #ffffff 150%)`
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-6xl md:text-7xl font-bold text-white mb-8 tracking-tight"
        >
          QR Code Styling
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <p className="text-2xl text-white font-light">
            An open source JS library
          </p>
          <p className="text-2xl text-white font-light">
            For generating styled QR codes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
