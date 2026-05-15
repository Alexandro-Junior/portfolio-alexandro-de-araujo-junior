import { MainLayout } from "./components/layout/MainLayout";
import { QRProvider, useQR } from "./context/QRContext";
import { QRControls } from "./components/qr/QRControls";
import { QRPreview } from "./components/qr/QRPreview";

function QRContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
      <div className="w-full">
        <QRControls />
      </div>
      <div className="w-full">
        <QRPreview />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QRProvider>
      <AppWithContext />
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

