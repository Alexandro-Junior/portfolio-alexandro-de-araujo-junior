import React from "react";
import { useQR } from "../../context/QRContext";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { DotStyle, ColorType, CornerSquareStyle, CornerDotStyle } from "../../types/qr";
import { Copy, Check, Plus, Minus, Save, Play, Wifi, MessageSquare, Globe } from "lucide-react";
import { SavedQRCodes } from "./SavedQRCodes";
import { Button } from "../ui/button";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

interface ControlRowProps {
  label: string;
  children: React.ReactNode;
}

const ControlRow = ({ label, children }: ControlRowProps) => (
  <div className="flex flex-col sm:grid sm:grid-cols-[150px_1fr] items-start sm:items-center gap-2 sm:gap-4 py-2">
    <Label className="text-sm font-medium text-gray-700">{label}</Label>
    <div className="flex items-center gap-2 w-full">
      {children}
    </div>
  </div>
);

const SectionHeader = ({ title, isOpen }: { title: string, isOpen?: boolean }) => (
  <div className="bg-paper px-4 py-3 flex justify-between items-center border-b-2 border-ink w-full cursor-pointer">
    <h2 className="text-xl font-hand font-bold text-ink tracking-wide">{title}</h2>
    {isOpen !== undefined && (
      <div className="text-ink">
        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </div>
    )}
  </div>
);

export function QRControls() {
  const { state, updateState, resetState, t, saveQRCode, user, createDynamicLink, updateDynamicLink, applyTheme, applyTemplate, editingId, setEditingId, savedQRCodes } = useQR();
  const [copied, setCopied] = React.useState(false);
  const [openItems, setOpenItems] = React.useState<string[]>(["themes"]);
  const [qrName, setQrName] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDynamic, setIsDynamic] = React.useState(false);
  const [targetUrl, setTargetUrl] = React.useState("");

  // Template specific states
  const [wifiSsid, setWifiSsid] = React.useState("");
  const [wifiPass, setWifiPass] = React.useState("");
  const [wifiEnc, setWifiEnc] = React.useState("WPA");
  const [waPhone, setWaPhone] = React.useState("");
  const [waMsg, setWaMsg] = React.useState("");

  const editingQR = React.useMemo(() => 
    editingId ? savedQRCodes.find(q => q.id === editingId) : null
  , [editingId, savedQRCodes]);

  React.useEffect(() => {
    if (editingQR) {
      setQrName(editingQR.name || "");
      setIsDynamic(!!editingQR.config.isDynamic);
      setTargetUrl(editingQR.config.dynamicTargetUrl || "");
      
      // Parse data if it's a template
      if (editingQR.config.template === "wifi") {
        const data = editingQR.config.data || "";
        const ssidMatch = data.match(/S:(.*?);/);
        const passMatch = data.match(/P:(.*?);/);
        const encMatch = data.match(/T:(.*?);/);
        if (ssidMatch) setWifiSsid(ssidMatch[1]);
        if (passMatch) setWifiPass(passMatch[1]);
        if (encMatch) setWifiEnc(encMatch[1]);
      } else if (editingQR.config.template === "whatsapp") {
        const data = editingQR.config.data || "";
        const phoneMatch = data.match(/wa\.me\/(.*?)\?/);
        const msgMatch = data.match(/\?text=(.*)/);
        if (phoneMatch) setWaPhone(phoneMatch[1]);
        if (msgMatch) setWaMsg(decodeURIComponent(msgMatch[1]));
      }
    }
  }, [editingQR]);

  // Sync template data to state.data
  React.useEffect(() => {
    if (state.template === "wifi") {
      updateState({ data: `WIFI:S:${wifiSsid};T:${wifiEnc};P:${wifiPass};;` });
    } else if (state.template === "whatsapp") {
      const cleanPhone = waPhone.replace(/\D/g, '');
      updateState({ data: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}` });
    }
  }, [wifiSsid, wifiPass, wifiEnc, waPhone, waMsg, state.template]);

  const handleExitEditing = () => {
    setEditingId(null);
    resetState();
    setQrName("");
    setIsDynamic(false);
    setTargetUrl("");
  };

  const isItemOpen = (value: string) => openItems.includes(value);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(state.data || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateState({ image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const exportAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "qr-config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleSave = async () => {
    if (!qrName.trim()) return;
    setIsSaving(true);
    try {
      let finalConfig = { ...state };
      
      if (editingId && editingQR) {
        // Update existing
        if (editingQR.config.isDynamic && targetUrl) {
          await updateDynamicLink(editingQR.config.dynamicLinkId, targetUrl);
          finalConfig.dynamicTargetUrl = targetUrl;
        }
        
        await setDoc(doc(db, "users", user.uid, "qrCodes", editingId), {
          name: qrName,
          config: finalConfig,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        
        handleExitEditing();
      } else {
        // Create new
        if (isDynamic && targetUrl) {
          const linkId = await createDynamicLink(targetUrl);
          const redirectUrl = `${window.location.origin}/q/${linkId}`;
          finalConfig = {
            ...state,
            data: redirectUrl,
            isDynamic: true,
            dynamicLinkId: linkId,
            dynamicTargetUrl: targetUrl
          };
          updateState(finalConfig);
        }

        await saveQRCode(qrName, finalConfig);
        setQrName("");
        setIsDynamic(false);
        setTargetUrl("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 bg-transparent p-0">
      {editingId && (
        <div className="bg-watercolor-blue/20 border-2 border-ink border-sketch p-4 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col">
            <span className="text-lg font-hand font-bold text-ink">{t('editingMode')}</span>
            <span className="text-xs opacity-60">{qrName}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExitEditing}
            className="font-hand border-ink hover:bg-white"
          >
            <Play className="w-4 h-4 mr-2 rotate-180" />
            {t('createNew')}
          </Button>
        </div>
      )}

      {/* Templates Section */}
      <section className="bg-white border-2 border-ink border-sketch overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <SectionHeader title={t('templates')} />
        <div className="p-4 sm:p-6 grid grid-cols-3 gap-4">
          <button 
            onClick={() => applyTemplate("url")}
            className={`flex flex-col items-center gap-2 p-3 border-2 border-sketch-sm transition-all ${state.template === "url" ? 'bg-watercolor-blue/20 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent hover:bg-gray-50'}`}
          >
            <Globe className="w-6 h-6" />
            <span className="text-xs font-hand font-bold">{t('templateUrl')}</span>
          </button>
          <button 
            onClick={() => applyTemplate("wifi")}
            className={`flex flex-col items-center gap-2 p-3 border-2 border-sketch-sm transition-all ${state.template === "wifi" ? 'bg-watercolor-blue/20 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent hover:bg-gray-50'}`}
          >
            <Wifi className="w-6 h-6" />
            <span className="text-xs font-hand font-bold">{t('templateWifi')}</span>
          </button>
          <button 
            onClick={() => applyTemplate("whatsapp")}
            className={`flex flex-col items-center gap-2 p-3 border-2 border-sketch-sm transition-all ${state.template === "whatsapp" ? 'bg-watercolor-blue/20 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'border-transparent hover:bg-gray-50'}`}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs font-hand font-bold">{t('templateWhatsapp')}</span>
          </button>
        </div>
      </section>

      {/* Main Options */}
      <section className="bg-white border-2 border-ink border-sketch overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <SectionHeader title={editingId ? t('editingMode') : t('mainOptions')} />
        <div className="p-4 sm:p-6 space-y-2">
          {state.template === "url" ? (
            !editingQR?.config?.isDynamic ? (
              <ControlRow label={t('data')}>
                <div className="flex-1 flex gap-2">
                  <textarea 
                    className="flex-1 min-h-[80px] p-2 border border-gray-300 rounded-sm text-sm font-mono"
                    value={state.data} 
                    onChange={(e) => updateState({ data: e.target.value })}
                    placeholder="https://example.com"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 bg-gray-100 border border-gray-300 rounded-sm hover:bg-gray-200 h-fit"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                  </button>
                </div>
              </ControlRow>
            ) : (
              <div className="bg-gray-50 p-3 rounded-sm border border-dashed border-gray-300 mb-4">
                <p className="text-xs text-ink opacity-60 italic">
                  {t('dataDisabled')}
                </p>
                <div className="mt-2 text-xs font-mono break-all opacity-40">
                  {state.data}
                </div>
              </div>
            )
          ) : state.template === "wifi" ? (
            <div className="space-y-4">
              <ControlRow label={t('ssid')}>
                <Input 
                  value={wifiSsid} 
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="My Network"
                />
              </ControlRow>
              <ControlRow label={t('password')}>
                <Input 
                  type="password"
                  value={wifiPass} 
                  onChange={(e) => setWifiPass(e.target.value)}
                  placeholder="********"
                />
              </ControlRow>
              <ControlRow label={t('encryption')}>
                <Select value={wifiEnc} onValueChange={setWifiEnc}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">None</SelectItem>
                  </SelectContent>
                </Select>
              </ControlRow>
            </div>
          ) : (
            <div className="space-y-4">
              <ControlRow label={t('phoneNumber')}>
                <Input 
                  value={waPhone} 
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="+55 11 99999-9999"
                />
              </ControlRow>
              <ControlRow label={t('message')}>
                <textarea 
                  className="flex-1 min-h-[80px] p-2 border border-gray-300 rounded-sm text-sm"
                  value={waMsg} 
                  onChange={(e) => setWaMsg(e.target.value)}
                  placeholder="Hello! I'm interested in..."
                />
              </ControlRow>
            </div>
          )}

          <ControlRow label={t('imageFile')}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="text-xs"
            />
            {state.image && (
              <button 
                onClick={() => updateState({ image: undefined })}
                className="px-4 py-1.5 bg-[#e0e0e0] border border-gray-300 text-sm font-medium hover:bg-gray-300"
              >
                {t('cancel')}
              </button>
            )}
          </ControlRow>

          <ControlRow label={t('width')}>
            <input 
              type="number"
              className="w-24 p-1.5 border border-gray-300 rounded-sm text-sm"
              value={state.width}
              onChange={(e) => updateState({ width: Number(e.target.value), height: Number(e.target.value) })}
            />
          </ControlRow>

          <ControlRow label={t('height')}>
            <input 
              type="number"
              className="w-24 p-1.5 border border-gray-300 rounded-sm text-sm"
              value={state.height}
              onChange={(e) => updateState({ height: Number(e.target.value), width: Number(e.target.value) })}
            />
          </ControlRow>

          <ControlRow label={t('margin')}>
            <input 
              type="number"
              className="w-24 p-1.5 border border-gray-300 rounded-sm text-sm"
              value={state.margin}
              onChange={(e) => updateState({ margin: Number(e.target.value) })}
            />
          </ControlRow>
        </div>
      </section>

      <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-6">
        {/* Themes */}
        <AccordionItem value="themes" className="bg-white border-2 border-ink border-sketch overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden border-none">
            <SectionHeader title={t('themes')} isOpen={isItemOpen("themes")} />
          </AccordionTrigger>
          <AccordionContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: "default", label: t('themeDefault'), color: "bg-gray-200" },
                { id: "sketch", label: t('themeSketch'), color: "bg-watercolor-pink" },
                { id: "ink", label: t('themeInk'), color: "bg-ink text-white" },
                { id: "marker", label: t('themeMarker'), color: "bg-sketch-blue text-white" },
                { id: "minimalist", label: t('themeMinimalist'), color: "bg-white border border-gray-200" },
                { id: "tech", label: t('themeTech'), color: "bg-watercolor-green" },
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => applyTheme(theme.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-sm border-2 transition-all ${
                    state.theme === theme.id ? "border-ink scale-105 shadow-md" : "border-transparent hover:border-gray-300"
                  } ${theme.color}`}
                >
                  <span className="text-xs font-hand font-bold">{theme.label}</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Dots Options */}
        <AccordionItem value="dots" className="bg-white border-2 border-ink border-sketch overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden border-none">
            <SectionHeader title={t('dotsOptions')} isOpen={isItemOpen("dots")} />
          </AccordionTrigger>
          <AccordionContent className="p-4 sm:p-6 space-y-4">
            <ControlRow label={t('dotsStyle')}>
              <Select 
                value={state.dotsOptions?.type} 
                onValueChange={(val: DotStyle) => updateState({ 
                  dotsOptions: { ...state.dotsOptions, type: val } 
                })}
              >
                <SelectTrigger className="w-48 h-9 rounded-sm border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                  <SelectItem value="classy">Classy</SelectItem>
                  <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                </SelectContent>
              </Select>
            </ControlRow>

            <ControlRow label={t('colorType')}>
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="radio" 
                    name="colorType" 
                    checked={state.colorType === "single"}
                    onChange={() => updateState({ colorType: "single" })}
                  />
                  {t('singleColor')}
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="radio" 
                    name="colorType" 
                    checked={state.colorType === "gradient"}
                    onChange={() => updateState({ colorType: "gradient" })}
                  />
                  {t('colorGradient')}
                </label>
              </div>
            </ControlRow>

            {state.colorType === "single" ? (
              <ControlRow label={t('dotsColor')}>
                <div className="flex gap-2 items-center">
                  <input 
                    type="color" 
                    className="w-10 h-8 p-0 border border-gray-300 rounded-sm cursor-pointer"
                    value={state.gradientColor1} 
                    onChange={(e) => updateState({ gradientColor1: e.target.value })}
                  />
                </div>
              </ControlRow>
            ) : (
              <div className="space-y-2">
                <ControlRow label={t('color1')}>
                  <input 
                    type="color" 
                    className="w-10 h-8 p-0 border border-gray-300 rounded-sm cursor-pointer"
                    value={state.gradientColor1} 
                    onChange={(e) => updateState({ gradientColor1: e.target.value })}
                  />
                </ControlRow>
                <ControlRow label={t('color2')}>
                  <input 
                    type="color" 
                    className="w-10 h-8 p-0 border border-gray-300 rounded-sm cursor-pointer"
                    value={state.gradientColor2} 
                    onChange={(e) => updateState({ gradientColor2: e.target.value })}
                  />
                </ControlRow>
                <ControlRow label={t('rotation')}>
                  <Slider 
                    value={[state.gradientRotation || 0]} 
                    min={0} max={360} step={1}
                    onValueChange={(val) => updateState({ gradientRotation: val[0] })}
                    className="w-48"
                  />
                </ControlRow>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Corners Square Options */}
        <AccordionItem value="cornersSquare" className="bg-white border-2 border-ink border-sketch overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden border-none">
            <SectionHeader title={t('cornersSquareOptions')} isOpen={isItemOpen("cornersSquare")} />
          </AccordionTrigger>
          <AccordionContent className="p-4 sm:p-6 space-y-4">
            <ControlRow label={t('cornersSquareStyle')}>
              <Select 
                value={state.cornersSquareOptions?.type} 
                onValueChange={(val: CornerSquareStyle) => updateState({ 
                  cornersSquareOptions: { ...state.cornersSquareOptions, type: val } 
                })}
              >
                <SelectTrigger className="w-48 h-9 rounded-sm border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="dot">Dot</SelectItem>
                  <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                </SelectContent>
              </Select>
            </ControlRow>
            
            <ControlRow label={t('colorType')}>
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" checked={true} readOnly />
                  {t('singleColor')}
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm opacity-50">
                  <input type="radio" disabled />
                  {t('colorGradient')}
                </label>
              </div>
            </ControlRow>

            <ControlRow label={t('cornersSquareColor')}>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  className="w-10 h-8 p-0 border border-gray-300 rounded-sm cursor-pointer"
                  value={state.cornersSquareOptions?.color || "#000000"} 
                  onChange={(e) => updateState({ 
                    cornersSquareOptions: { ...state.cornersSquareOptions, color: e.target.value } 
                  })}
                />
                <button 
                  onClick={() => updateState({ cornersSquareOptions: { ...state.cornersSquareOptions, color: undefined } })}
                  className="px-3 py-1 bg-[#e0e0e0] border border-gray-300 text-xs font-medium hover:bg-gray-300"
                >
                  {t('clear')}
                </button>
              </div>
            </ControlRow>
          </AccordionContent>
        </AccordionItem>

        {/* Corners Dot Options */}
        <AccordionItem value="cornersDot" className="bg-white border-2 border-ink border-sketch overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden border-none">
            <SectionHeader title={t('cornersDotOptions')} isOpen={isItemOpen("cornersDot")} />
          </AccordionTrigger>
          <AccordionContent className="p-4 sm:p-6 space-y-4">
            <ControlRow label={t('cornersDotStyle')}>
              <Select 
                value={state.cornersDotOptions?.type || "none"} 
                onValueChange={(val: any) => updateState({ 
                  cornersDotOptions: { ...state.cornersDotOptions, type: val === "none" ? undefined : val } 
                })}
              >
                <SelectTrigger className="w-48 h-9 rounded-sm border-gray-300">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="dot">Dot</SelectItem>
                </SelectContent>
              </Select>
            </ControlRow>

            <ControlRow label={t('colorType')}>
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" checked={true} readOnly />
                  {t('singleColor')}
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm opacity-50">
                  <input type="radio" disabled />
                  {t('colorGradient')}
                </label>
              </div>
            </ControlRow>

            <ControlRow label={t('cornersDotColor')}>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  className="w-10 h-8 p-0 border border-gray-300 rounded-sm cursor-pointer"
                  value={state.cornersDotOptions?.color || "#000000"} 
                  onChange={(e) => updateState({ 
                    cornersDotOptions: { ...state.cornersDotOptions, color: e.target.value } 
                  })}
                />
                <button 
                  onClick={() => updateState({ cornersDotOptions: { ...state.cornersDotOptions, color: undefined } })}
                  className="px-3 py-1 bg-[#e0e0e0] border border-gray-300 text-xs font-medium hover:bg-gray-300"
                >
                  {t('clear')}
                </button>
              </div>
            </ControlRow>
          </AccordionContent>
        </AccordionItem>

        {/* Background Options */}
        <AccordionItem value="background" className="bg-white border-2 border-ink border-sketch overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden border-none">
            <SectionHeader title={t('backgroundOptions')} isOpen={isItemOpen("background")} />
          </AccordionTrigger>
          <AccordionContent className="p-4 sm:p-6 space-y-4">
            <ControlRow label={t('colorType')}>
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" checked={true} readOnly />
                  {t('singleColor')}
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm opacity-50">
                  <input type="radio" disabled />
                  {t('colorGradient')}
                </label>
              </div>
            </ControlRow>

            <ControlRow label={t('backgroundColor')}>
              <input 
                type="color" 
                className="w-10 h-8 p-0 border border-gray-300 rounded-sm cursor-pointer"
                value={state.backgroundOptions?.color || "#ffffff"} 
                onChange={(e) => updateState({ 
                  backgroundOptions: { ...state.backgroundOptions, color: e.target.value } 
                })}
              />
            </ControlRow>
          </AccordionContent>
        </AccordionItem>

        {/* Image Options */}
        <AccordionItem value="image" className="bg-white border-2 border-ink border-sketch overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden border-none">
            <SectionHeader title={t('imageOptions')} isOpen={isItemOpen("image")} />
          </AccordionTrigger>
          <AccordionContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 py-2">
              <Checkbox 
                id="hideDots" 
                checked={state.imageOptions?.hideBackgroundDots}
                onCheckedChange={(checked) => updateState({
                  imageOptions: { ...state.imageOptions, hideBackgroundDots: !!checked }
                })}
              />
              <Label htmlFor="hideDots" className="text-sm cursor-pointer font-medium text-gray-700">{t('hideDots')}</Label>
            </div>
            <ControlRow label={t('imageSize')}>
              <input 
                type="number"
                step="0.1"
                className="w-24 p-1.5 border border-gray-300 rounded-sm text-sm"
                value={state.imageOptions?.imageSize}
                onChange={(e) => updateState({ 
                  imageOptions: { ...state.imageOptions, imageSize: Number(e.target.value) } 
                })}
              />
            </ControlRow>
            <ControlRow label={t('margin')}>
              <input 
                type="number"
                className="w-24 p-1.5 border border-gray-300 rounded-sm text-sm"
                value={state.imageOptions?.margin}
                onChange={(e) => updateState({ 
                  imageOptions: { ...state.imageOptions, margin: Number(e.target.value) } 
                })}
              />
            </ControlRow>
          </AccordionContent>
        </AccordionItem>

        {/* QR Options */}
        <AccordionItem value="qr" className="bg-white border-2 border-ink border-sketch overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden border-none">
            <SectionHeader title={t('qrOptions')} isOpen={isItemOpen("qr")} />
          </AccordionTrigger>
          <AccordionContent className="p-4 sm:p-6 space-y-4">
            <ControlRow label={t('typeNumber')}>
              <input 
                type="number"
                className="w-24 p-1.5 border border-gray-300 rounded-sm text-sm"
                value={state.qrOptions?.typeNumber}
                onChange={(e) => updateState({ 
                  qrOptions: { ...state.qrOptions, typeNumber: Number(e.target.value) } 
                })}
              />
            </ControlRow>
            <ControlRow label={t('mode')}>
              <Select 
                value={state.qrOptions?.mode} 
                onValueChange={(val: any) => updateState({ 
                  qrOptions: { ...state.qrOptions, mode: val } 
                })}
              >
                <SelectTrigger className="w-48 h-9 rounded-sm border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Numeric">Numeric</SelectItem>
                  <SelectItem value="Alphanumeric">Alphanumeric</SelectItem>
                  <SelectItem value="Byte">Byte</SelectItem>
                  <SelectItem value="Kanji">Kanji</SelectItem>
                </SelectContent>
              </Select>
            </ControlRow>
            <ControlRow label={t('errorCorrection')}>
              <Select 
                value={state.qrOptions?.errorCorrectionLevel} 
                onValueChange={(val: any) => updateState({ 
                  qrOptions: { ...state.qrOptions, errorCorrectionLevel: val } 
                })}
              >
                <SelectTrigger className="w-24 h-9 rounded-sm border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="Q">Q</SelectItem>
                  <SelectItem value="H">H</SelectItem>
                </SelectContent>
              </Select>
            </ControlRow>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {user && (
        <section className="bg-white border-2 border-ink border-sketch overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 space-y-4">
          <h3 className="text-xl font-hand font-bold text-ink flex items-center gap-2">
            <Save className="w-5 h-5" />
            {editingId ? t('saveChanges') : t('save')}
          </h3>

          <div className="space-y-4 border-b border-gray-100 pb-4 mb-4">
            {!editingId && (
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="isDynamic" 
                  checked={isDynamic}
                  onCheckedChange={(checked) => setIsDynamic(!!checked)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor="isDynamic" className="text-lg font-hand font-bold cursor-pointer">{t('dynamicQR')}</Label>
                  <p className="text-xs text-ink opacity-60 leading-tight">
                    {t('dynamicQRDesc')}
                  </p>
                </div>
              </div>
            )}

            {(isDynamic || editingQR?.config?.isDynamic) && (
              <div className="space-y-2 pl-7">
                <Label className="text-sm font-medium">{t('targetUrl')}</Label>
                <Input 
                  placeholder="https://mysite.com/promo"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input 
              placeholder={t('qrName')}
              value={qrName}
              onChange={(e) => setQrName(e.target.value)}
              className="font-hand text-lg"
            />
            <Button 
              onClick={handleSave}
              disabled={isSaving || !qrName.trim()}
              className="bg-ink text-white font-hand text-lg border-2 border-ink border-sketch-sm hover:translate-y-[-2px] transition-transform"
            >
              {isSaving ? "..." : (editingId ? t('saveChanges') : t('save'))}
            </Button>
          </div>
          
          {editingId && (
            <Button 
              variant="ghost" 
              onClick={handleExitEditing}
              className="w-full font-hand text-ink opacity-60 hover:opacity-100"
            >
              {t('exitEditing')}
            </Button>
          )}
        </section>
      )}

      <div className="p-4 space-y-8">
        <button 
          onClick={exportAsJson}
          className="px-4 py-2 bg-[#e0e0e0] border border-gray-300 text-gray-700 font-medium text-sm rounded-sm hover:bg-gray-300 transition-colors"
        >
          {t('exportJson')}
        </button>

        <p className="text-sm text-gray-600">
          {t('footerText')}
        </p>

        <SavedQRCodes />
      </div>
    </div>
  );
}
