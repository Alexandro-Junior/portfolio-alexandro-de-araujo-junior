import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { QRProvider, useQR } from "./context/QRContext";
import { QRControls } from "./components/qr/QRControls";
import { QRPreview } from "./components/qr/QRPreview";
import { RedirectHandler } from "./components/qr/RedirectHandler";

function QRContent() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-12 items-start">
      <div className="w-full order-2 lg:order-1">
        <QRControls />
      </div>
      <div className="w-full order-1 lg:order-2">
        <QRPreview />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QRProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/q/:id" element={<RedirectHandler />} />
          <Route path="/" element={<AppWithContext />} />
        </Routes>
      </BrowserRouter>
    </QRProvider>
  );
}

function AppWithContext() {
  const { state } = useQR();
  const accentColor = state.dotsOptions?.color || state.gradientColor1 || "#4267b2";

  return (
    <MainLayout accentColor={accentColor}>
      <QRContent />
    </MainLayout>
  );
}

