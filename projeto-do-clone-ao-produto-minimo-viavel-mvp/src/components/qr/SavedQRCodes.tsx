import { useQR } from "../../context/QRContext";
import { motion } from "motion/react";
import { Trash2, Download, Play, Link as LinkIcon, Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React from "react";

export function SavedQRCodes() {
  const { savedQRCodes, loadQRCode, deleteQRCode, updateDynamicLink, t, user, setEditingId, editingId } = useQR();
  const [editingUrlId, setEditingUrlId] = React.useState<string | null>(null);
  const [newUrl, setNewUrl] = React.useState("");

  if (!user) return null;

  const handleEditLink = (qr: any) => {
    setEditingUrlId(qr.id);
    setNewUrl(qr.config.dynamicTargetUrl || "");
  };

  const handleSaveLink = async (qr: any) => {
    if (!newUrl.trim()) return;
    try {
      await updateDynamicLink(qr.config.dynamicLinkId, newUrl);
      setEditingUrlId(null);
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const handleLoadForEdit = (qr: any) => {
    loadQRCode(qr.config);
    setEditingId(qr.id);
    // Scroll to top to see the controls
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mt-12 pt-8 border-t-2 border-ink border-sketch-sm">
      <h3 className="text-2xl font-hand font-bold text-ink mb-6 flex items-center gap-2">
        <Download className="w-6 h-6" />
        {t('savedQRCodes')}
      </h3>

      {savedQRCodes.length === 0 ? (
        <p className="text-ink opacity-60 font-hand italic">{t('noSavedQRs')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedQRCodes.map((qr) => (
            <motion.div
              key={qr.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-paper p-4 border-2 border-ink border-sketch-sm flex items-center justify-between group hover:bg-watercolor-blue/10 transition-colors"
            >
              <div className="flex flex-col flex-1">
                <span className="font-hand font-bold text-lg text-ink">{qr.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink opacity-50">
                    {qr.createdAt?.toDate ? qr.createdAt.toDate().toLocaleDateString() : ""}
                  </span>
                  {qr.config.isDynamic && (
                    <span className="text-[10px] bg-watercolor-blue/20 text-watercolor-blue px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {t('dynamicLink')}
                    </span>
                  )}
                </div>
                
                {editingUrlId === qr.id ? (
                  <div className="mt-2 flex gap-2 items-center">
                    <Input 
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="h-8 text-xs font-mono"
                      placeholder={t('targetUrl')}
                    />
                    <Button size="icon" className="h-8 w-8 bg-green-600 hover:bg-green-700" onClick={() => handleSaveLink(qr)}>
                      <Check className="w-4 h-4 text-white" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingUrlId(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : qr.config.isDynamic && (
                  <div className="mt-1 text-[10px] font-mono text-ink opacity-40 truncate max-w-[200px]">
                    {qr.config.dynamicTargetUrl}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {qr.config.isDynamic && editingUrlId !== qr.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditLink(qr)}
                    className="hover:bg-watercolor-blue/20 text-ink"
                    title={t('updateLink')}
                  >
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLoadForEdit(qr)}
                  className={`hover:bg-watercolor-blue/20 ${editingId === qr.id ? 'bg-watercolor-blue/30 text-ink' : 'text-ink'}`}
                  title={t('load')}
                >
                  <Play className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteQRCode(qr.id)}
                  className="hover:bg-red-100 text-red-600"
                  title={t('delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
