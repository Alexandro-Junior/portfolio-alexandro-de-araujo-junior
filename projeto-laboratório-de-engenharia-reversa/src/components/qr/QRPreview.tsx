import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { useQR } from "../../context/QRContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function QRPreview() {
  const { state } = useQR();
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
    if (qrCodeRef.current) {
      const { 
        colorType, 
        gradientColor1, 
        gradientColor2, 
        gradientType, 
        gradientRotation, 
        ...validOptions 
      } = state;
      
      qrCodeRef.current.update(validOptions);
    }
  }, [state]);

  const download = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({ extension: format });
    }
  };

  return (
    <div className="flex flex-col items-center sticky top-8">
      <div 
        ref={containerRef} 
        className="w-full aspect-square bg-white rounded-sm flex items-center justify-center border border-gray-200 mb-8 overflow-hidden shadow-sm"
      />
      
      <div className="flex items-stretch h-10 w-fit shadow-sm">
        <button 
          onClick={download}
          className="px-6 bg-[#e0e0e0] text-gray-800 text-sm font-medium border border-gray-300 border-r-0 hover:bg-gray-300 transition-colors"
        >
          Download
        </button>
        <div className="w-20 border-l border-gray-400">
          <Select value={format} onValueChange={(val: any) => setFormat(val)}>
            <SelectTrigger className="h-full rounded-none border-gray-300 bg-[#e0e0e0] focus:ring-0 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="svg">SVG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="webp">WEBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
