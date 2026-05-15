import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { motion } from "motion/react";

export function RedirectHandler() {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleRedirect() {
      if (!id) return;

      try {
        const docRef = doc(db, "dynamicLinks", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          let url = data.targetUrl;
          
          // Ensure URL has protocol
          if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
          }
          
          window.location.href = url;
        } else {
          setError("QR Code not found or link expired.");
        }
      } catch (err) {
        console.error("Redirect error:", err);
        setError("An error occurred while redirecting.");
      }
    }

    handleRedirect();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper p-6">
        <div className="max-w-md w-full bg-white border-2 border-ink border-sketch p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-hand font-bold text-ink mb-4">Oops!</h1>
          <p className="text-ink opacity-70 mb-6">{error}</p>
          <a 
            href="/"
            className="inline-block px-6 py-2 bg-ink text-white font-hand text-lg border-2 border-ink border-sketch-sm hover:translate-y-[-2px] transition-transform"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper p-6">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-ink border-t-transparent rounded-full mb-6"
      />
      <p className="text-2xl font-hand font-bold text-ink animate-pulse">
        Redirecting...
      </p>
    </div>
  );
}
