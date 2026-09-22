import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import TrackSelector from './components/TrackSelector';
import RaceNavigation from './components/RaceNavigation';
import RaceHeader from './components/RaceHeader';
import HorseTable from './components/HorseTable';
import CouponBuilder from './components/CouponBuilder';
import SimulationModal from './components/SimulationModal';
import AIAssistantModal from './components/AIAssistantModal';
import JevDecisionCard from './components/JevDecisionCard';

import { tracksData } from './data/racesData';
import { analyzeRaceWithAI, generateSmartCoupon } from './services/predictionEngine';
import { Sparkles, Trophy, Flame, ShieldCheck, Ticket, AlertTriangle, RotateCcw, CheckCircle, Info } from 'lucide-react';

export default function App() {
  const [selectedTrackId, setSelectedTrackId] = useState('istanbul');
  // Default to Istanbul's Altili start race (2. Kosu)
  const [selectedRaceNumber, setSelectedRaceNumber] = useState(2);
  const [selectedHorsesPerLeg, setSelectedHorsesPerLeg] = useState({});
  const [toast, setToast] = useState(null);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Toast Bildirimi Göster
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Seçili hipodrom
  const currentTrack = useMemo(() => {
    return tracksData.find(t => t.id === selectedTrackId) || tracksData[0];
  }, [selectedTrackId]);

  // Sayfa ilk yüklendiğinde hipodroma uygun ideal kuponu otomatik oluştur
  useEffect(() => {
    handleApplyPreset('ideal', currentTrack);
  }, []);

  // Seçili koşu
  const currentRace = useMemo(() => {
    return currentTrack.races.find(r => r.raceNumber === selectedRaceNumber) || currentTrack.races[0];
  }, [currentTrack, selectedRaceNumber]);

  // Seçili koşu için AI Analizi
  const raceAnalysis = useMemo(() => {
    return analyzeRaceWithAI(currentRace);
  }, [currentRace]);

  // Altılı ganyan koşuları
  const sixGanyanRaces = useMemo(() => {
    return currentTrack.races.filter(r => r.isSixGanyanLeg);
  }, [currentTrack]);

  // Hipodrom değişince: 
  // 1. Koşu numarasını o hipodromun Altılı Ganyan başlangıç koşusuna al
  // 2. Kuponu o hipodromun safkanlarıyla otomatik yenile!
  const handleSelectTrack = (trackId) => {
    const nextTrack = tracksData.find(t => t.id === trackId) || tracksData[0];
    setSelectedTrackId(trackId);
    setSelectedRaceNumber(nextTrack.sixGanyanStartRace || 1);
    handleApplyPreset('ideal', nextTrack);
    showToast(`📍 ${nextTrack.name} bültenine geçildi. Kupon bu hipodrom için AI ile otomatik güncellendi!`, 'success');
  };

  // Ayaktaki atı seç / kaldır
  const handleToggleHorseInLeg = (legNum, horseNumber) => {
    setSelectedHorsesPerLeg(prev => {
      const current = prev[legNum] || [];
      const updated = current.includes(horseNumber)
        ? current.filter(n => n !== horseNumber)
        : [...current, horseNumber];
      return { ...prev, [legNum]: updated };
    });
  };

  // Koşu tablosundan kupona ekle / çıkar (Alert yerine kibar Toast)
  const handleToggleHorseFromTable = (horseNumber) => {
    if (currentRace.isSixGanyanLeg) {
      const isAlreadyIn = (selectedHorsesPerLeg[currentRace.isSixGanyanLeg] || []).includes(horseNumber);
      handleToggleHorseInLeg(currentRace.isSixGanyanLeg, horseNumber);
      showToast(
        !isAlreadyIn 
          ? `✅ ${currentRace.isSixGanyanLeg}. Ayak: ${horseNumber} numaralı at kupona eklendi.`
          : `🗑️ ${currentRace.isSixGanyanLeg}. Ayak: ${horseNumber} numaralı at kupondan çıkarıldı.`,
        'success'
      );
    } else {
      showToast(
        `ℹ️ ${currentRace.raceNumber}. Koşu Altılı Ganyan dışıdır (Altılı Ganyan ${currentTrack.sixGanyanStartRace}. koşudan başlar).`,
        'info'
      );
    }
  };

  // Hazır kupon şablonu uygula (ekonomik, ideal, wide)
  const handleApplyPreset = (mode, targetTrack = currentTrack) => {
    const preset = generateSmartCoupon(targetTrack.races, mode);
    const newSelection = {};
    preset.forEach((picks, idx) => {
      newSelection[idx + 1] = picks;
    });
    setSelectedHorsesPerLeg(newSelection);
  };

  // Kuponu sıfırla ve AI ile anında düzelt
  const handleResetAndFixCoupon = () => {
    handleApplyPreset('ideal', currentTrack);
    showToast("✨ Kupon sıfırlandı ve Yapay Zeka (İdeal Şablon) ile düzeltildi!", 'success');
  };

  // Kuponu tamamen temizle
  const handleClearCoupon = () => {
    setSelectedHorsesPerLeg({
      1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    });
    showToast("Kupon temizlendi. Ayaklara at seçebilirsiniz.", 'info');
  };

  // Kupon hesaplamaları ve boş ayak tespiti
  let totalCombinations = 1;
  const emptyLegs = [];
  let totalSelectedHorses = 0;

  for (let i = 1; i <= 6; i++) {
    const count = (selectedHorsesPerLeg[i] || []).length;
    totalSelectedHorses += count;
    if (count === 0) emptyLegs.push(i);
    else totalCombinations *= count;
  }

  const finalCombinations = emptyLegs.length > 0 || totalSelectedHorses === 0 ? 0 : totalCombinations;
  const couponCost = finalCombinations * (currentTrack.unitPrice || 0.50);

  // Günün Bankosu ve Günün Sürprizi
  const trackHighlights = useMemo(() => {
    const allRaces = currentTrack.races.map(r => analyzeRaceWithAI(r));
    const bankoCandidate = allRaces
      .flatMap(a => a.horses)
      .sort((a, b) => b.aiWinProbability - a.aiWinProbability)[0];

    const bombCandidate = allRaces
      .flatMap(a => a.horses)
      .filter(h => h.tag === "BOMBA / SÜRPRİZ")[0] || null;

    return { banko: bankoCandidate, bomb: bombCandidate };
  }, [currentTrack]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 relative">
      
      {/* Toast Bildirim Kutusu */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center space-x-3 text-xs font-bold ${
            toast.type === 'success' 
              ? 'bg-slate-900 border-emerald-500 text-emerald-300 shadow-emerald-950/50' 
              : 'bg-slate-900 border-amber-500 text-amber-300 shadow-amber-950/50'
          }`}>
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Info className="w-4 h-4 text-amber-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header
        onOpenCoupon={() => setIsCouponModalOpen(true)}
        onOpenSimulation={() => setIsSimulationModalOpen(true)}
        onOpenAI={() => setIsAIModalOpen(true)}
        couponHorseCount={totalSelectedHorses}
        couponCost={couponCost}
      />

      {/* Hipodrom Seçimi */}
      <TrackSelector
        tracks={tracksData}
        selectedTrackId={selectedTrackId}
        onSelectTrack={handleSelectTrack}
      />

      {/* Koşu Numaraları Navigasyonu */}
      <RaceNavigation
        races={currentTrack.races}
        selectedRaceNumber={selectedRaceNumber}
        onSelectRace={(num) => setSelectedRaceNumber(num)}
        sixGanyanStartRace={currentTrack.sixGanyanStartRace}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Günün Yapay Zeka Özet Paneli */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Card 1: Günün Bankosu */}
          <div className="bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Günün En Net Bankosu
              </div>
              <div className="text-base font-black text-white">
                {trackHighlights.banko ? `${trackHighlights.banko.number} - ${trackHighlights.banko.name}` : "Seçiliyor..."}
              </div>
              <div className="text-xs text-slate-400">
                Jokey: {trackHighlights.banko?.jockey} • Kazanma İhtimali: %{trackHighlights.banko?.aiWinProbability}
              </div>
            </div>
          </div>

          {/* Card 2: Günün Bombası */}
          <div className="bg-gradient-to-br from-purple-500/15 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-4 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                Günün Sürpriz / Bombası
              </div>
              <div className="text-base font-black text-white">
                {trackHighlights.bomb ? `${trackHighlights.bomb.number} - ${trackHighlights.bomb.name}` : "Hafif Siklet Adayları"}
              </div>
              <div className="text-xs text-slate-400">
                Düşük AGF, Yüksek Form Endeksi
              </div>
            </div>
          </div>

          {/* Card 3: Kupon Durumu & Hızlı Düzeltici */}
          <div className="bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    Altılı Ganyan Kuponum
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    {couponCost.toFixed(2)} TL
                  </div>
                </div>
              </div>

              <button
                onClick={handleResetAndFixCoupon}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-bold flex items-center space-x-1 transition shadow"
                title="Kuponu sıfırla ve AI önerileriyle düzelt"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Kuponu Düzelt</span>
              </button>
            </div>

            <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
              <span>{finalCombinations} Kombinasyon</span>
              {emptyLegs.length > 0 ? (
                <span className="text-amber-400 font-bold flex items-center text-[11px]">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {emptyLegs.join(', ')}. Ayak Boş
                </span>
              ) : (
                <span className="text-emerald-400 font-bold text-[11px]">Tüm Ayaklar Dolu</span>
              )}
            </div>
          </div>
        </div>

        {/* Canlı 6 Ayak Mini Kupon Şeridi */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-3 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <Ticket className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Aktif Altılı Ganyan Kupon Ayakları:
            </span>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              Kuponu Düzenle →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((leg) => {
              const picks = selectedHorsesPerLeg[leg] || [];
              const isCurrentLeg = currentRace.isSixGanyanLeg === leg;
              return (
                <div
                  key={leg}
                  onClick={() => {
                    const targetRace = sixGanyanRaces[leg - 1];
                    if (targetRace) setSelectedRaceNumber(targetRace.raceNumber);
                  }}
                  className={`p-2.5 rounded-xl border transition cursor-pointer ${
                    isCurrentLeg
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                      : picks.length === 0
                      ? 'bg-red-950/20 border-red-500/40 text-red-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-extrabold">{leg}. AYAK</span>
                    <span className="text-[10px] text-slate-400 font-mono">{picks.length} At</span>
                  </div>
                  <div className="text-xs font-black font-mono tracking-wide text-amber-400 truncate">
                    {picks.length > 0 ? picks.sort((a, b) => a - b).join(', ') : <span className="text-red-400 font-normal italic">Seçilmedi</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seçili Koşu Başlığı & İkramiye / Taktik Bilgisi */}
        <RaceHeader
          race={currentRace}
          analysis={raceAnalysis}
          onSimulateRace={() => setIsSimulationModalOpen(true)}
        />

        {/* Jev (Sistem 1) Refleks Karar Kartı */}
        <JevDecisionCard
          race={currentRace}
          apiKey={import.meta.env.VITE_OPENROUTER_API_KEY || ""}
        />

        {/* Koşan Atlar Tablosu */}
        <HorseTable
          horses={raceAnalysis.horses}
          selectedHorseNumbers={
            currentRace.isSixGanyanLeg
              ? selectedHorsesPerLeg[currentRace.isSixGanyanLeg] || []
              : []
          }
          onToggleHorse={handleToggleHorseFromTable}
        />

      </main>

      {/* Sticky Bottom Bar for Mobile & Quick Access */}
      <div className="sticky bottom-0 z-40 bg-slate-950/90 border-t border-slate-800 backdrop-blur-md py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Kupon Tutarı:</span>
            <span className="text-xl font-black text-amber-400 font-mono">{couponCost.toFixed(2)} TL</span>
            <span className="text-xs text-slate-500">({finalCombinations} Kolon)</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetAndFixCoupon}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition inline-flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Kuponu Düzelt</span>
            </button>

            <button
              onClick={() => handleApplyPreset('ideal')}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition hidden sm:inline-flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>İdeal AI Kuponu</span>
            </button>

            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition flex items-center space-x-1.5"
            >
              <Ticket className="w-4 h-4 text-slate-950" />
              <span>Kuponu İncele / Oyna</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 DÖRTNAL — Ganyan Pro AI. Tüm hakları saklıdır. TJK resmi yarış bülteni ve yapay zeka karar algoritmaları ile hazırlanmıştır.</p>
          <p className="mt-1 text-[11px] text-slate-600">Sistem 1 (Jev) refleks karar mimarisi ve istatistiksel galop form motoru ile güçlendirilmiştir.</p>
        </div>
      </footer>

      {/* Modallar */}
      <CouponBuilder
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        sixGanyanRaces={sixGanyanRaces}
        selectedHorsesPerLeg={selectedHorsesPerLeg}
        onToggleHorseInLeg={handleToggleHorseInLeg}
        onApplyPreset={(mode) => handleApplyPreset(mode)}
        onClearCoupon={handleClearCoupon}
        unitPrice={currentTrack.unitPrice || 0.50}
      />

      <SimulationModal
        isOpen={isSimulationModalOpen}
        onClose={() => setIsSimulationModalOpen(false)}
        race={currentRace}
      />

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentRace={currentRace}
        analysis={raceAnalysis}
      />

    </div>
  );
}
