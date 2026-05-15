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
import { Copy, Check, Plus, Minus } from "lucide-react";

interface ControlRowProps {
  label: string;
  children: React.ReactNode;
}

const ControlRow = ({ label, children }: ControlRowProps) => (
  <div className="grid grid-cols-[150px_1fr] items-center gap-4 py-2">
    <Label className="text-sm font-medium text-gray-700">{label}</Label>
    <div className="flex items-center gap-2">
      {children}
    </div>
  </div>
);

const SectionHeader = ({ title, isOpen }: { title: string, isOpen?: boolean }) => (
  <div className="bg-[#e0e0e0] px-4 py-2 flex justify-between items-center border-b border-gray-300 w-full">
    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-tight">{title}</h2>
    <div className="text-gray-600">
      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
    </div>
  </div>
);

export function QRControls() {
  const { state, updateState, resetState } = useQR();
  const [copied, setCopied] = React.useState(false);
  const [openItems, setOpenItems] = React.useState<string[]>(["dots"]);

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

  return (
    <div className="space-y-4 bg-[#f0f0f0] p-0 border border-gray-300">
      {/* Main Options */}
      <section className="bg-white border-b border-gray-300">
        <SectionHeader title="Main Options" />
        <div className="p-6 space-y-2">
          <ControlRow label="Data">
            <textarea 
              className="flex-1 min-h-[80px] p-2 border border-gray-300 rounded-sm text-sm font-mono"
              value={state.data} 
              onChange={(e) => updateState({ data: e.target.value })}
              placeholder="https://example.com"
            />
            <button 
              onClick={copyToClipboard}
              className="p-2 bg-gray-100 border border-gray-300 rounded-sm hover:bg-gray-200"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
            </button>
          </ControlRow>

          <ControlRow label="Image File">
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
                Cancel
              </button>
            )}
          </ControlRow>

          <ControlRow label="Width">
            <input 
              type="number"
              className="w-24 p-1.5 border border-gray-300 rounded-sm text-sm"
              value={state.width}
              onChange={(e) => updateState({ width: Number(e.target.value), height: Number(e.target.value) })}
            />
          </ControlRow>

          <ControlRow label="Height">
            <input 
              type="number"
              className="w-24 p-1.5 border border-gray-300 rounded-sm text-sm"
              value={state.height}
              onChange={(e) => updateState({ height: Number(e.target.value), width: Number(e.target.value) })}
            />
          </ControlRow>

          <ControlRow label="Margin">
            <input 
              type="number"
              className="w-24 p-1.5 border border-gray-300 rounded-sm text-sm"
              value={state.margin}
              onChange={(e) => updateState({ margin: Number(e.target.value) })}
            />
          </ControlRow>
        </div>
      </section>

      <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-4">
        {/* Dots Options */}
        <AccordionItem value="dots" className="bg-white border-b border-gray-300 border-t border-gray-300">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden">
            <SectionHeader title="Dots Options" isOpen={isItemOpen("dots")} />
          </AccordionTrigger>
          <AccordionContent className="p-6 space-y-4">
            <ControlRow label="Dots Style">
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

            <ControlRow label="Color Type">
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="radio" 
                    name="colorType" 
                    checked={state.colorType === "single"}
                    onChange={() => updateState({ colorType: "single" })}
                  />
                  Single color
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="radio" 
                    name="colorType" 
                    checked={state.colorType === "gradient"}
                    onChange={() => updateState({ colorType: "gradient" })}
                  />
                  Color gradient
                </label>
              </div>
            </ControlRow>

            {state.colorType === "single" ? (
              <ControlRow label="Dots Color">
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
                <ControlRow label="Color 1">
                  <input 
                    type="color" 
                    className="w-10 h-8 p-0 border border-gray-300 rounded-sm cursor-pointer"
                    value={state.gradientColor1} 
                    onChange={(e) => updateState({ gradientColor1: e.target.value })}
                  />
                </ControlRow>
                <ControlRow label="Color 2">
                  <input 
                    type="color" 
                    className="w-10 h-8 p-0 border border-gray-300 rounded-sm cursor-pointer"
                    value={state.gradientColor2} 
                    onChange={(e) => updateState({ gradientColor2: e.target.value })}
                  />
                </ControlRow>
                <ControlRow label="Rotation">
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
        <AccordionItem value="cornersSquare" className="bg-white border-b border-gray-300 border-t border-gray-300">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden">
            <SectionHeader title="Corners Square Options" isOpen={isItemOpen("cornersSquare")} />
          </AccordionTrigger>
          <AccordionContent className="p-6 space-y-4">
            <ControlRow label="Corners Square Style">
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
            
            <ControlRow label="Color Type">
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" checked={true} readOnly />
                  Single color
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm opacity-50">
                  <input type="radio" disabled />
                  Color gradient
                </label>
              </div>
            </ControlRow>

            <ControlRow label="Corners Square Color">
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
                  Clear
                </button>
              </div>
            </ControlRow>
          </AccordionContent>
        </AccordionItem>

        {/* Corners Dot Options */}
        <AccordionItem value="cornersDot" className="bg-white border-b border-gray-300 border-t border-gray-300">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden">
            <SectionHeader title="Corners Dot Options" isOpen={isItemOpen("cornersDot")} />
          </AccordionTrigger>
          <AccordionContent className="p-6 space-y-4">
            <ControlRow label="Corners Dot Style">
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

            <ControlRow label="Color Type">
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" checked={true} readOnly />
                  Single color
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm opacity-50">
                  <input type="radio" disabled />
                  Color gradient
                </label>
              </div>
            </ControlRow>

            <ControlRow label="Corners Dot Color">
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
                  Clear
                </button>
              </div>
            </ControlRow>
          </AccordionContent>
        </AccordionItem>

        {/* Background Options */}
        <AccordionItem value="background" className="bg-white border-b border-gray-300 border-t border-gray-300">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden">
            <SectionHeader title="Background Options" isOpen={isItemOpen("background")} />
          </AccordionTrigger>
          <AccordionContent className="p-6 space-y-4">
            <ControlRow label="Color Type">
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" checked={true} readOnly />
                  Single color
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm opacity-50">
                  <input type="radio" disabled />
                  Color gradient
                </label>
              </div>
            </ControlRow>

            <ControlRow label="Background Color">
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
        <AccordionItem value="image" className="bg-white border-b border-gray-300 border-t border-gray-300">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden">
            <SectionHeader title="Image Options" isOpen={isItemOpen("image")} />
          </AccordionTrigger>
          <AccordionContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 py-2">
              <Checkbox 
                id="hideDots" 
                checked={state.imageOptions?.hideBackgroundDots}
                onCheckedChange={(checked) => updateState({
                  imageOptions: { ...state.imageOptions, hideBackgroundDots: !!checked }
                })}
              />
              <Label htmlFor="hideDots" className="text-sm cursor-pointer font-medium text-gray-700">Hide Background Dots</Label>
            </div>
            <ControlRow label="Image Size">
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
            <ControlRow label="Margin">
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
        <AccordionItem value="qr" className="bg-white border-b border-gray-300 border-t border-gray-300">
          <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden">
            <SectionHeader title="QR Options" isOpen={isItemOpen("qr")} />
          </AccordionTrigger>
          <AccordionContent className="p-6 space-y-4">
            <ControlRow label="Type Number">
              <input 
                type="number"
                className="w-24 p-1.5 border border-gray-300 rounded-sm text-sm"
                value={state.qrOptions?.typeNumber}
                onChange={(e) => updateState({ 
                  qrOptions: { ...state.qrOptions, typeNumber: Number(e.target.value) } 
                })}
              />
            </ControlRow>
            <ControlRow label="Mode">
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
            <ControlRow label="Error Correction Level">
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

      <div className="p-4 space-y-8">
        <button 
          onClick={exportAsJson}
          className="px-4 py-2 bg-[#e0e0e0] border border-gray-300 text-gray-700 font-medium text-sm rounded-sm hover:bg-gray-300 transition-colors"
        >
          Export Options as JSON
        </button>

        <p className="text-sm text-gray-600">
          If you have any questions or issues please contact me via email or GitHub Issues.
        </p>
      </div>
    </div>
  );
}
