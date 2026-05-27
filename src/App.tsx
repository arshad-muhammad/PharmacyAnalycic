import React, { useState } from 'react';
import { Pill, Home } from 'lucide-react';
import { CameraCapture } from './components/CameraCapture';
import { MedicineDetails } from './components/MedicineDetails';
import { MedicineData } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [medicineData, setMedicineData] = useState<MedicineData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (base64: string, mimeType: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-medicine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64, mimeType }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to analyze medicine');
      }

      const data = await response.json();
      setMedicineData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setMedicineData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f8f4] font-sans text-[#2d332e] selection:bg-[#e9e7df]">
      {/* Header */}
      <header className="bg-[#f9f8f4] sticky top-0 z-50 pt-8 pb-4">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between border-b-2 border-transparent">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
            <div className="w-10 h-10 bg-[#5a6b5d] rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Pill className="w-5 h-5 absolute" />
              <div className="w-4 h-4 bg-white rounded-sm rotate-45 z-10 absolute opacity-0"></div>
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight text-[#3a443c]">PharmaScan <span className="font-sans opacity-70 font-medium">AI</span></span>
          </div>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium opacity-80 text-[#3a443c]">
            <span className="border-b-2 border-[#5a6b5d] pb-1 cursor-pointer">Scanner</span>
            <span className="cursor-pointer hover:opacity-100 transition-opacity">My Cabinet</span>
            <span className="cursor-pointer hover:opacity-100 transition-opacity">Safety Alerts</span>
          </nav>
          
          <div className="flex items-center gap-4">
            {medicineData ? (
              <button 
                onClick={handleReset}
                className="w-10 h-10 flex items-center justify-center bg-white border border-[#e5e2d9] rounded-full shadow-sm hover:bg-[#f5f4ef] transition-colors text-[#5a6b5d]"
                title="Home"
              >
                <Home className="w-4 h-4" />
              </button>
            ) : (
              <button className="bg-[#5a6b5d] hover:bg-[#4a584c] text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-colors hidden sm:block">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 lg:px-8 pt-8 sm:pt-12 w-full">
        <AnimatePresence mode="wait">
          {!medicineData ? (
            <motion.div
              key="capture"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col items-center"
            >
              <div className="text-center max-w-xl mx-auto mb-10">
                <h1 className="text-4xl font-serif font-bold text-[#3a443c] tracking-tight mb-4">
                  Know your medicine instantly.
                </h1>
                <p className="text-[#7e7868] text-lg max-w-md mx-auto leading-relaxed">
                  Scan any medicine packaging or tablet to get detailed composition, safe usage instructions, potential side effects, and more.
                </p>
              </div>

              {error && (
                <div className="w-full max-w-md mb-6 p-4 bg-[#f5f4ef] border border-[#a45c5c] text-[#a45c5c] rounded-[24px] text-sm text-center font-medium shadow-sm">
                  {error}
                </div>
              )}

              <CameraCapture onCapture={handleCapture} isLoading={isAnalyzing} />
              
              <div className="mt-12 text-center">
                <p className="text-xs text-[#8e8a7d] max-w-md mx-auto uppercase tracking-wider font-bold">
                  Disclaimer: This tool uses AI for identification. Always consult a qualified healthcare professional.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MedicineDetails data={medicineData} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-[#e5e2d9] pt-12 pb-12">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#5a6b5d] mb-6 text-center">
            As a part of IDT Project built by Batch 9
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 text-sm text-[#7e7868] font-medium text-center md:gap-x-6">
            <span>G M AYSHATH AFEEZA</span>
            <span className="hidden md:inline text-[#c8c6be]">|</span>
            <span>GAMINI K</span>
            <span className="hidden md:inline text-[#c8c6be]">|</span>
            <span>HAMZATHUL KARRAR S H</span>
            <span className="hidden md:inline text-[#c8c6be]">|</span>
            <span>HANA FATHIMA SUDHARSHANA K</span>
            <span className="hidden md:inline text-[#c8c6be]">|</span>
            <span>SUJAN N</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
