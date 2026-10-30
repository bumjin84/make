import React from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import PocGrid from './components/sections/PocGrid';
import ArchiveSection from './components/sections/ArchiveSection';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        <HeroSection />
        <PocGrid />
        <ArchiveSection />
      </main>
      <Footer />
    </div>
  );
}
