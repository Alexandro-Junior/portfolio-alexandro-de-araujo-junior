import { QrCode, LogIn, LogOut, User as UserIcon, Languages } from "lucide-react";
import { useQR } from "../../context/QRContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Language } from "../../lib/translations";

export function Navbar() {
  const { user, login, logout, loading, language, setLanguage, t } = useQR();

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "Mandarim" },
    { code: "hi", name: "Hindi" },
    { code: "es", name: "Espanhol" },
    { code: "fr", name: "Francês" },
    { code: "ar", name: "Árabe" },
    { code: "bn", name: "Bengali" },
    { code: "ru", name: "Russo" },
    { code: "pt", name: "Português" },
    { code: "ur", name: "Urdu" },
    { code: "id", name: "Indonésio" }
  ];

  return (
    <nav className="bg-paper/40 backdrop-blur-md text-ink py-3 md:py-4 px-4 md:px-6 flex items-center justify-between border-b-2 border-ink border-sketch-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="flex flex-col leading-none">
          <span className="text-2xl md:text-3xl font-hand font-bold tracking-tight">
            {t('appName')}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm font-medium">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 opacity-70" />
          <Select value={language} onValueChange={(val: Language) => setLanguage(val)}>
            <SelectTrigger className="w-[120px] h-8 bg-transparent border-none focus:ring-0 font-hand text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="font-hand">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || "User"} 
                    className="w-8 h-8 rounded-full border border-gray-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <span className="hidden md:block opacity-80">{user.displayName}</span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">{t('logout')}</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-sm font-bold hover:bg-gray-200 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('login')}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
