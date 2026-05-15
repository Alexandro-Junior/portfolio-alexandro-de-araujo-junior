import { Github, QrCode } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-[#000000] text-white py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex flex-col leading-none">
          <span className="text-3xl font-bold tracking-tighter flex items-baseline gap-1">
            QR <span className="text-sm font-normal tracking-normal uppercase opacity-70">Code Styling</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-8 text-sm font-medium">
        <div className="opacity-70 hover:opacity-100 transition-opacity cursor-default">
          <span>npm v1.8.3</span>
        </div>
        <a 
          href="https://github.com/kozakdenys/qr-code-styling" 
          target="_blank" 
          rel="noopener noreferrer"
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
          <span>GitHub</span>
        </a>
      </div>
    </nav>
  );
}
