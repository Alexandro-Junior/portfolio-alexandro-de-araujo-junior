import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";

interface MainLayoutProps {
  children: ReactNode;
  accentColor?: string;
}

export function MainLayout({ children, accentColor }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Hero accentColor={accentColor} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:px-6 lg:px-8">
        {children}
      </main>
      <footer className="py-8 px-6 text-center text-sm text-gray-500 border-t border-gray-200 bg-white">
        <p>© {new Date().getFullYear()} QR Code Styling. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
}
