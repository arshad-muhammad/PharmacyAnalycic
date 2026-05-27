import React from 'react';
import { MedicineData } from '../types';
import { Pill, Activity, AlertTriangle, ShieldCheck, Search, ShoppingCart, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface MedicineDetailsProps {
  data: MedicineData;
  onReset: () => void;
}

export function MedicineDetails({ data, onReset }: MedicineDetailsProps) {
  if (!data.identified) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mx-auto bg-white rounded-[32px] shadow-sm border border-[#e5e2d9] overflow-hidden p-8 text-center"
      >
        <div className="w-16 h-16 bg-[#f5f4ef] text-[#a45c5c] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e5e2d9]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif font-bold text-[#3a443c] mb-2">Medicine Not Identified</h3>
        <p className="text-[#7e7868] text-sm mb-6">
          We couldn't clearly identify a medicine from the provided image. Please try again with a clearer photo of the packaging, label, or tablet.
        </p>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-full bg-white border border-[#e5e2d9] hover:bg-[#f5f4ef] text-[#2d332e] py-3 px-4 rounded-full font-semibold text-sm shadow-sm transition-colors"
        >
          <RefreshCcw className="w-5 h-5" />
          Try Again
        </button>
      </motion.div>
    );
  }

  // Fallback map query for pharmacies
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(data.purchaseQuery || 'buy ' + data.name)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      <div className="bg-white rounded-[32px] shadow-sm border border-[#e5e2d9] overflow-hidden">
        {/* Header */}
        <div className="bg-[#e9e7df] border-b border-[#e5e2d9] p-6 sm:p-8 relative overflow-hidden text-[#2d332e]">
          <div className="absolute -top-12 -right-12 opacity-5 text-[#5a6b5d]">
            <Pill className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/60 shadow-sm border border-white rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-3 text-[#8e8a7d]">
              Current Identification
            </span>
            <h2 className="text-3xl font-serif font-bold italic mb-3 text-[#2d332e]">{data.name}</h2>
            <div className="flex flex-wrap gap-2 text-[#5a6b5d]">
              {data.composition?.map((comp, idx) => (
                <span key={idx} className="flex items-center gap-2 text-sm font-medium">
                  <span className="w-1 h-1 rounded-full bg-[#5a6b5d]/50"></span>
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 bg-[#fcfbf9]">
          
          <section>
            <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#8e8a7d] border-b border-[#e5e2d9] pb-3 mb-4">
              <Activity className="w-4 h-4 text-[#5a6b5d]" />
              Indications & Usage
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#f5f4ef] p-5 rounded-[24px]">
                <div className="text-[10px] font-bold text-[#8e8a7d] uppercase tracking-wider mb-2">Primary Use</div>
                <p className="text-[#4a4f4b] text-sm leading-relaxed font-semibold">{data.usage}</p>
              </div>
              <div className="bg-[#f5f4ef] p-5 rounded-[24px]">
                <div className="text-[10px] font-bold text-[#8e8a7d] uppercase tracking-wider mb-2">General Dosage</div>
                <p className="text-[#4a4f4b] text-sm leading-relaxed font-semibold">{data.dosage}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#8e8a7d] border-b border-[#e5e2d9] pb-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-[#a45c5c]" />
              Safety Warnings
            </h3>
            <div className="space-y-4">
              {data.precautions && data.precautions.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-[#4a4f4b] mb-3 uppercase tracking-wider">Precautions</p>
                  <ul className="space-y-2">
                    {data.precautions.map((p, i) => (
                      <li key={i} className="flex gap-2 text-sm text-[#4a4f4b] leading-relaxed">
                        <span className="text-[#a45c5c] font-bold">•</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {data.sideEffects && data.sideEffects.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-[#4a4f4b] mb-3 uppercase tracking-wider mt-5">Potential Side Effects</p>
                  <div className="flex flex-wrap gap-2">
                    {data.sideEffects.map((effect, i) => (
                      <span key={i} className="px-3 py-1 bg-[#f5f4ef] text-[#7e7868] rounded-md text-xs font-medium border border-[#e5e2d9]">
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#8e8a7d] border-b border-[#e5e2d9] pb-3 mb-6">
              <ShieldCheck className="w-4 h-4 text-[#5a6b5d]" />
              Safety Profile & Verified Alternatives
            </div>
            
            <div className="bg-[#5a6b5d]/10 p-5 rounded-[24px] mb-6 border border-[#5a6b5d]/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#5a6b5d] rounded-full"></div>
                <p className="text-[#3a443c] font-semibold text-sm">
                  System Rating: <span className="font-normal opacity-90 italic">{data.safetyRating}</span>
                </p>
              </div>
            </div>
            
            {data.alternatives && data.alternatives.length > 0 && (
              <div className="bg-[#5a6b5d] rounded-[24px] p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
                <h3 className="text-lg font-serif italic mb-5 relative z-10">Verified Alternatives</h3>
                <div className="space-y-3 relative z-10">
                  {data.alternatives.map((alt, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/10 p-4 rounded-[16px] border border-white/10">
                      <div className="text-sm font-medium">{alt}</div>
                      <div className="text-[10px] bg-white/20 px-2 py-1 rounded">Alternative</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

        </div>
        
        {/* Actions Footer */}
        <div className="bg-white border-t border-[#e5e2d9] p-6 lg:p-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-white border border-[#e5e2d9] hover:bg-[#f5f4ef] text-[#2d332e] rounded-full text-sm font-semibold shadow-sm transition-colors"
          >
            <Search className="w-4 h-4" />
            Scan Another
          </button>
          
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-[#5a6b5d] hover:bg-[#4a584c] text-white rounded-full text-sm font-bold shadow-lg shadow-[#5a6b5d]/30 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Order Delivery
          </a>
        </div>
      </div>
    </motion.div>
  );
}
