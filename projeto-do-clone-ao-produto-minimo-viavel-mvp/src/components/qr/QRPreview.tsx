import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { useQR } from "../../context/QRContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function QRPreview() {
  const { state, t } = useQR();
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [format, setFormat] = useState<"png" | "svg" | "jpeg" | "webp">("png");

  useEffect(() => {
    if (!containerRef.current) return;
    
    containerRef.current.innerHTML = "";
    
    const { 
      colorType, 
      gradientColor1, 
      gradientColor2, 
      gradientType, 
      gradientRotation, 
      ...initialOptions 
    } = state;
    
    qrCodeRef.current = new QRCodeStyling(initialOptions);
    qrCodeRef.current.append(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (qrCodeRef.current) {
        const { 
          colorType, 
          gradientColor1, 
          gradientColor2, 
          gradientType, 
          gradientRotation, 
          theme,
          isDynamic,
          dynamicLinkId,
          dynamicTargetUrl,
          ...validOptions 
        } = state;
        
        qrCodeRef.current.update(validOptions);
      }
    }, 100); // 100ms debounce

    return () => clearTimeout(timer);
  }, [state]);

  const download = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({ extension: format });
    }
  };

  const getFilterClass = () => {
    if (state.theme === "sketch") return "filter-sketch";
    if (state.theme === "ink") return "filter-ink";
    if (state.theme === "marker") return "filter-sketch opacity-90";
    return "";
  };

  return (
    <div className="flex flex-col items-center lg:sticky lg:top-8">
      <div className="relative w-full aspect-square mb-8 group">
        {/* Watercolor splashes behind the QR */}
        <div className="absolute inset-0 opacity-40 blur-3xl pointer-events-none transition-opacity group-hover:opacity-60">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-watercolor-pink rounded-full mix-blend-multiply animate-pulse" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-watercolor-blue rounded-full mix-blend-multiply animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-watercolor-green rounded-full mix-blend-multiply animate-pulse [animation-delay:2s]" />
        </div>
        
        <div 
          ref={containerRef} 
          className={`relative z-10 w-full h-full bg-white/80 backdrop-blur-sm border-2 border-ink border-sketch flex items-center justify-center overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${getFilterClass()}`}
        />
      </div>
      
      <div className="flex items-stretch h-12 w-fit shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-ink border-sketch-sm overflow-hidden bg-white">
        <button 
          onClick={download}
          className="px-6 bg-paper text-ink text-lg font-hand font-bold border-r-2 border-ink hover:bg-sketch-blue hover:text-white transition-colors"
        >
          {t('download')}
        </button>
        <div className="w-24">
          <Select value={format} onValueChange={(val: any) => setFormat(val)}>
            <SelectTrigger className="h-full rounded-none border-none bg-paper focus:ring-0 text-lg font-hand font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="font-hand">
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="svg">SVG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="webp">WEBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-8 opacity-40 pointer-events-none">
        <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20 Q 30 10, 50 20 T 90 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
