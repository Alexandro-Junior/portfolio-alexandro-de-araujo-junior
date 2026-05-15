import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { QRState, DotStyle, CornerSquareStyle, CornerDotStyle, ColorType } from "../types/qr";

interface QRContextType {
  state: QRState;
  updateState: (updates: Partial<QRState>) => void;
  resetState: () => void;
}

const defaultState: QRState = {
  width: 300,
  height: 300,
  data: "https://qr-code-styling.com",
  margin: 0,
  qrOptions: {
    typeNumber: 0,
    mode: "Byte",
    errorCorrectionLevel: "Q"
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0
  },
  dotsOptions: {
    type: "square",
    color: "#4267b2"
  },
  backgroundOptions: {
    color: "#ffffff"
  },
  cornersSquareOptions: {
    type: "square",
    color: "#4267b2"
  },
  cornersDotOptions: {
    type: "square",
    color: "#4267b2"
  },
  colorType: "single",
  gradientColor1: "#4267b2",
  gradientColor2: "#000000",
  gradientType: "linear",
  gradientRotation: 0
};

const QRContext = createContext<QRContextType | undefined>(undefined);

export function QRProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QRState>(defaultState);

  const updateState = (updates: Partial<QRState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(defaultState);
  };

  // Handle color type changes (single vs gradient)
  useEffect(() => {
    const dotsOptions = { ...state.dotsOptions };
    
    if (state.colorType === "single") {
      dotsOptions.gradient = undefined;
      dotsOptions.color = state.gradientColor1 || "#4267b2";
    } else {
      dotsOptions.color = undefined;
      dotsOptions.gradient = {
        type: state.gradientType || "linear",
        rotation: (state.gradientRotation || 0) * (Math.PI / 180),
        colorStops: [
          { offset: 0, color: state.gradientColor1 || "#4267b2" },
          { offset: 1, color: state.gradientColor2 || "#000000" }
        ]
      };
    }

    // Only update if actually different to prevent infinite loops
    const currentDots = JSON.stringify(state.dotsOptions);
    const newDots = JSON.stringify(dotsOptions);
    
    if (currentDots !== newDots) {
      updateState({ dotsOptions });
    }
  }, [state.colorType, state.gradientColor1, state.gradientColor2, state.gradientType, state.gradientRotation]);

  return (
    <QRContext.Provider value={{ state, updateState, resetState }}>
      {children}
    </QRContext.Provider>
  );
}

export function useQR() {
  const context = useContext(QRContext);
  if (context === undefined) {
    throw new Error("useQR must be used within a QRProvider");
  }
  return context;
}
