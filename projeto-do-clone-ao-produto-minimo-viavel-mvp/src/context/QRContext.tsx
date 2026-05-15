import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { QRState, DotStyle, CornerSquareStyle, CornerDotStyle, ColorType } from "../types/qr";
import { auth, googleProvider, db } from "../lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc, onSnapshot, query, orderBy, deleteDoc } from "firebase/firestore";
import { Language, translations } from "../lib/translations";

interface QRContextType {
  state: QRState;
  updateState: (updates: Partial<QRState>) => void;
  resetState: () => void;
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  saveQRCode: (name: string, config?: QRState) => Promise<void>;
  savedQRCodes: any[];
  loadQRCode: (config: QRState) => void;
  deleteQRCode: (id: string) => Promise<void>;
  createDynamicLink: (targetUrl: string) => Promise<string>;
  updateDynamicLink: (id: string, targetUrl: string) => Promise<void>;
  applyTheme: (theme: any) => void;
  applyTemplate: (template: any) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
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
    type: "rounded",
    color: "#2d3436"
  },
  backgroundOptions: {
    color: "#fdfcf8"
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#2d3436"
  },
  cornersDotOptions: {
    type: "dot",
    color: "#2d3436"
  },
  colorType: "single",
  gradientColor1: "#2d3436",
  gradientColor2: "#000000",
  gradientType: "linear",
  gradientRotation: 0,
  template: "url"
};

const QRContext = createContext<QRContextType | undefined>(undefined);

export function QRProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QRState>(defaultState);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("en");
  const [savedQRCodes, setSavedQRCodes] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Sync user to Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            createdAt: serverTimestamp(),
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen for saved QR codes
  useEffect(() => {
    if (!user) {
      setSavedQRCodes([]);
      return;
    }

    const q = query(
      collection(db, "users", user.uid, "qrCodes"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const qrs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSavedQRCodes(qrs);
    });

    return () => unsubscribe();
  }, [user]);

  const saveQRCode = async (name: string, config?: QRState) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "users", user.uid, "qrCodes"), {
        uid: user.uid,
        name,
        config: config || state,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving QR code:", error);
      throw error;
    }
  };

  const loadQRCode = (config: QRState) => {
    setState(config);
  };

  const deleteQRCode = async (id: string) => {
    if (!user) return;
    try {
      const qrDoc = savedQRCodes.find(q => q.id === id);
      if (qrDoc?.config?.isDynamic && qrDoc?.config?.dynamicLinkId) {
        await deleteDoc(doc(db, "dynamicLinks", qrDoc.config.dynamicLinkId));
      }
      await deleteDoc(doc(db, "users", user.uid, "qrCodes", id));
    } catch (error) {
      console.error("Error deleting QR code:", error);
      throw error;
    }
  };

  const createDynamicLink = async (targetUrl: string) => {
    if (!user) throw new Error("User must be logged in");
    const docRef = await addDoc(collection(db, "dynamicLinks"), {
      targetUrl,
      ownerUid: user.uid,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const updateDynamicLink = async (id: string, targetUrl: string) => {
    if (!user) throw new Error("User must be logged in");
    await setDoc(doc(db, "dynamicLinks", id), {
      targetUrl,
      ownerUid: user.uid,
      createdAt: serverTimestamp(),
    }, { merge: true });
  };

  const applyTheme = (themeName: string) => {
    const themes: Record<string, Partial<QRState>> = {
      sketch: {
        theme: "sketch",
        dotsOptions: { type: "rounded", color: "#2d3436" },
        cornersSquareOptions: { type: "extra-rounded", color: "#2d3436" },
        cornersDotOptions: { type: "dot", color: "#2d3436" },
        backgroundOptions: { color: "#fdfcf8" },
        colorType: "single",
        gradientColor1: "#2d3436"
      },
      ink: {
        theme: "ink",
        dotsOptions: { type: "classy-rounded", color: "#1a1a1a" },
        cornersSquareOptions: { type: "dot", color: "#1a1a1a" },
        cornersDotOptions: { type: "dot", color: "#1a1a1a" },
        backgroundOptions: { color: "#ffffff" },
        colorType: "single",
        gradientColor1: "#1a1a1a"
      },
      marker: {
        theme: "marker",
        dotsOptions: { type: "extra-rounded", color: "#0984e3" },
        cornersSquareOptions: { type: "extra-rounded", color: "#0984e3" },
        cornersDotOptions: { type: "dot", color: "#0984e3" },
        backgroundOptions: { color: "#ffffff" },
        colorType: "single",
        gradientColor1: "#0984e3"
      },
      minimalist: {
        theme: "minimalist",
        dotsOptions: { type: "dots", color: "#636e72" },
        cornersSquareOptions: { type: "square", color: "#2d3436" },
        cornersDotOptions: { type: "square", color: "#2d3436" },
        backgroundOptions: { color: "#ffffff" },
        colorType: "single",
        gradientColor1: "#636e72"
      },
      tech: {
        theme: "tech",
        dotsOptions: { type: "square", color: "#00b894" },
        cornersSquareOptions: { type: "square", color: "#00b894" },
        cornersDotOptions: { type: "square", color: "#00b894" },
        backgroundOptions: { color: "#1a1a1a" },
        colorType: "gradient",
        gradientColor1: "#00b894",
        gradientColor2: "#00cec9",
        gradientType: "linear",
        gradientRotation: 45
      }
    };

    if (themes[themeName]) {
      updateState(themes[themeName]);
    } else {
      updateState({ theme: "default" });
    }
  };

  const applyTemplate = (templateName: string) => {
    const templates: Record<string, Partial<QRState>> = {
      url: {
        template: "url",
        dotsOptions: { type: "rounded", color: "#2d3436" },
        cornersSquareOptions: { type: "extra-rounded", color: "#2d3436" },
        cornersDotOptions: { type: "dot", color: "#2d3436" },
        image: undefined,
        imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 }
      },
      wifi: {
        template: "wifi",
        dotsOptions: { type: "extra-rounded", color: "#3b5998" },
        cornersSquareOptions: { type: "extra-rounded", color: "#3b5998" },
        cornersDotOptions: { type: "dot", color: "#3b5998" },
        backgroundOptions: { color: "#ffffff" },
        image: "https://www.svgrepo.com/show/475700/wifi.svg",
        imageOptions: { hideBackgroundDots: true, imageSize: 0.3, margin: 5 },
        colorType: "single",
        gradientColor1: "#3b5998"
      },
      whatsapp: {
        template: "whatsapp",
        dotsOptions: { type: "rounded", color: "#25D366" },
        cornersSquareOptions: { type: "extra-rounded", color: "#25D366" },
        cornersDotOptions: { type: "dot", color: "#25D366" },
        backgroundOptions: { color: "#ffffff" },
        image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
        imageOptions: { hideBackgroundDots: true, imageSize: 0.3, margin: 5 },
        colorType: "single",
        gradientColor1: "#25D366"
      }
    };

    if (templates[templateName]) {
      updateState(templates[templateName]);
    }
  };

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateState = (updates: Partial<QRState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      
      // Sync dotsOptions with gradient/color settings if they changed
      if (
        updates.colorType !== undefined || 
        updates.gradientColor1 !== undefined || 
        updates.gradientColor2 !== undefined || 
        updates.gradientType !== undefined || 
        updates.gradientRotation !== undefined
      ) {
        const dotsOptions = { ...newState.dotsOptions };
        
        if (newState.colorType === "single") {
          dotsOptions.gradient = undefined;
          dotsOptions.color = newState.gradientColor1 || "#4267b2";
        } else {
          dotsOptions.color = undefined;
          dotsOptions.gradient = {
            type: newState.gradientType || "linear",
            rotation: (newState.gradientRotation || 0) * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: newState.gradientColor1 || "#4267b2" },
              { offset: 1, color: newState.gradientColor2 || "#000000" }
            ]
          };
        }
        newState.dotsOptions = dotsOptions;
      }
      
      return newState;
    });
  };

  const resetState = () => {
    setState(defaultState);
  };

  return (
    <QRContext.Provider value={{ 
      state, 
      updateState, 
      resetState, 
      user, 
      loading, 
      login, 
      logout, 
      language, 
      setLanguage, 
      t,
      saveQRCode,
      savedQRCodes,
      loadQRCode,
      deleteQRCode,
      createDynamicLink,
      updateDynamicLink,
      applyTheme,
      applyTemplate,
      editingId,
      setEditingId
    }}>
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
