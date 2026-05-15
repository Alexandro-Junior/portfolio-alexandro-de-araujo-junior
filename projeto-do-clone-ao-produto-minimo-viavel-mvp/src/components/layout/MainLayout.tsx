import { ReactNode } from "react";
import { Github } from "lucide-react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { useQR } from "../../context/QRContext";

interface MainLayoutProps {
  children: ReactNode;
  accentColor?: string;
}

export function MainLayout({ children, accentColor }: MainLayoutProps) {
  const { t } = useQR();

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar />
      <Hero accentColor={accentColor} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:px-6 lg:px-8 relative">
        <div className="relative z-10">
          {children}
        </div>
      </main>
      <footer className="py-12 px-6 text-center text-sm text-ink/60 border-t-2 border-ink border-sketch-sm bg-paper/40 backdrop-blur-md">
        <p className="font-hand text-lg">© {new Date().getFullYear()} {t('appName')}. {t('builtWith')}</p>
        <p className="mt-2 opacity-60">React • Tailwind • Hand-drawn • Watercolor</p>
        <div className="mt-6 flex justify-center">
          <a 
            href="https://github.com/kozakdenys/qr-code-styling" 
            target="_blank" 
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>
      </footer>

      {/* SVG Filters for hand-drawn effects */}
      <svg className="svg-filters" xmlns="http://www.w3.org/2000/svg">
        <filter id="sketch-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ink-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </svg>
    </div>
  );
}
