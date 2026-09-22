import React, { useState } from 'react';
import { 
  Ticket, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  Zap, 
  Flame, 
  Share2, 
  Calculator,
  X
} from 'lucide-react';

export default function CouponBuilder({
  isOpen,
  onClose,
  sixGanyanRaces = [],
  selectedHorsesPerLeg = {}, // { 1: [1, 2], 2: [3], ... }
  onToggleHorseInLeg,
  onApplyPreset,
  onClearCoupon,
  unitPrice = 0.50
}) {
  const [copied, setCopied] = useState(false);

  // Kombinasyon ve Tutar Hesaplama
  let totalCombinations = 1;
  let hasEmptyLeg = false;
  let totalSelectedHorses = 0;

  for (let i = 1; i <= 6; i++) {
    const count = (selectedHorsesPerLeg[i] || []).length;
    totalSelectedHorses += count;
    if (count === 0) {
      hasEmptyLeg = true;
    } else {
      totalCombinations *= count;
    }
  }

  const finalCombinations = hasEmptyLeg || totalSelectedHorses === 0 ? 0 : totalCombinations;
  const totalCost = finalCombinations * unitPrice;

  // Kuponu metin olarak kopyalama
  const handleCopyCoupon = () => {
    let lines = ["=== GANYAN PRO AI - ALTILI GANYAN KUPONU ==="];
    for (let i = 1; i <= 6; i++) {
      const picks = selectedHorsesPerLeg[i] || [];
      lines.push(`${i}. AYAK: ${picks.length > 0 ? picks.sort((a, b) => a - b).join(', ') : 'Boş'}`);
    }
    lines.push(`Kombinasyon: ${finalCombinations}`);
    lines.push(`Birim Fiyat: ${unitPrice.toFixed(2)} TL`);
    lines.push(`Toplam Tutar: ${totalCost.toFixed(2)} TL`);
    lines.push("Bol şanslar!");

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Altılı Ganyan Kupon Editörü</h3>
              <p className="text-xs text-slate-400">Ayaklara at ekleyin veya tek tıkla AI hazır kupon oluşturun</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Preset Buttons (Yapay Zeka Hazır Kuponları) */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-amber-400" />
              Yapay Zeka Hazır Kupon Şablonları
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => onApplyPreset('economic')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 text-left transition flex items-start space-x-3 group"
              >
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-105 transition">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Ekonomik Kupon</div>
                  <div className="text-[11px] text-slate-400">Banko ve tekli ayaklar, min bütçe</div>
                </div>
              </button>

              <button
                onClick={() => onApplyPreset('ideal')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-left transition flex items-start space-x-3 group"
              >
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 group-hover:scale-105 transition">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">İdeal Kupon</div>
                  <div className="text-[11px] text-slate-400">Standart dengeli AI şablonu</div>
                </div>
              </button>

              <button
                onClick={() => onApplyPreset('wide')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/50 text-left transition flex items-start space-x-3 group"
              >
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 shrink-0 group-hover:scale-105 transition">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Sürpriz & Geniş</div>
                  <div className="text-[11px] text-slate-400">Yüksek ikramiye hedefli bombalar</div>
                </div>
              </button>
            </div>
          </div>

          {/* 6 Legs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((legNum) => {
              const picks = selectedHorsesPerLeg[legNum] || [];
              const race = sixGanyanRaces[legNum - 1];

              return (
                <div 
                  key={legNum}
                  className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                        {legNum}. AYAK
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {race ? `${race.distance}m ${race.trackType}` : ''}
                      </span>
                    </div>

                    {/* Selected Numbers Badges */}
                    <div className="min-h-[44px] flex flex-wrap gap-1.5 items-center p-2 rounded-xl bg-slate-900 border border-slate-800/80 mb-3">
                      {picks.length === 0 ? (
                        <span className="text-xs text-slate-500 italic">At seçilmedi</span>
                      ) : (
                        picks.sort((a, b) => a - b).map((num) => (
                          <button
                            key={num}
                            onClick={() => onToggleHorseInLeg(legNum, num)}
                            className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-red-500 text-slate-950 hover:text-white font-black text-xs flex items-center justify-center transition group relative"
                            title="Çıkarmak için tıkla"
                          >
                            <span>{num}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Available Horse Quick Clickers */}
                  {race && race.horses && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-800/80">
                      {race.horses.map((h) => {
                        const isPicked = picks.includes(h.number);
                        return (
                          <button
                            key={h.number}
                            onClick={() => onToggleHorseInLeg(legNum, h.number)}
                            className={`w-6 h-6 rounded text-[11px] font-bold transition flex items-center justify-center ${
                              isPicked
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                            title={`${h.number} - ${h.name}`}
                          >
                            {h.number}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Calculator Summary */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Toplam Kombinasyon Sayısı</div>
                <div className="text-xl font-black text-white font-mono">
                  {finalCombinations.toLocaleString('tr-TR')} Adet
                </div>
                <div className="text-[11px] text-slate-400">Birim Fiyat: {unitPrice.toFixed(2)} TL</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Toplam Kupon Tutarı</div>
              <div className="text-3xl font-black text-amber-400 font-mono">
                {totalCost.toFixed(2)} TL
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClearCoupon}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/40 font-semibold text-xs transition flex items-center space-x-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Kuponu Temizle</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCoupon}
              disabled={finalCombinations === 0}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Kopyalandı!' : 'Kuponu Kopyala'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20"
            >
              Tamam
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
