import React, { useState, useMemo } from 'react';
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
import { Sparkles, Trophy, Flame, ShieldCheck, Ticket, AlertTriangle } from 'lucide-react';

export default function App() {
  const [selectedTrackId, setSelectedTrackId] = useState('istanbul');
  const [selectedRaceNumber, setSelectedRaceNumber] = useState(1);
  const [selectedHorsesPerLeg, setSelectedHorsesPerLeg] = useState({
    1: [1],
    2: [1],
    3: [1, 2],
    4: [1, 2, 3],
    5: [1],
    6: [1, 2]
  });

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Seçili hipodrom
  const currentTrack = useMemo(() => {
    return tracksData.find(t => t.id === selectedTrackId) || tracksData[0];
  }, [selectedTrackId]);

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

  // Hipodrom değişince 1. koşuya geç
  const handleSelectTrack = (trackId) => {
    setSelectedTrackId(trackId);
    setSelectedRaceNumber(1);
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

  // Koşu tablosundan kupona ekle / çıkar
  const handleToggleHorseFromTable = (horseNumber) => {
    if (currentRace.isSixGanyanLeg) {
      handleToggleHorseInLeg(currentRace.isSixGanyanLeg, horseNumber);
    } else {
      // Altılı ganyan dışı koşu uyarısı veya serbest seçim
      alert(`${currentRace.raceNumber}. Koşu Altılı Ganyan bültenine dahil değildir (Altılı Ganyan ${currentTrack.sixGanyanStartRace}. koşudan başlar).`);
    }
  };

  // Hazır kupon şablonu uygula
  const handleApplyPreset = (mode) => {
    const preset = generateSmartCoupon(currentTrack.races, mode);
    const newSelection = {};
    preset.forEach((picks, idx) => {
      newSelection[idx + 1] = picks;
    });
    setSelectedHorsesPerLeg(newSelection);
  };

  // Kuponu temizle
  const handleClearCoupon = () => {
    setSelectedHorsesPerLeg({
      1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    });
  };

  // Kupon hesaplamaları
  let totalCombinations = 1;
  let hasEmptyLeg = false;
  let totalSelectedHorses = 0;

  for (let i = 1; i <= 6; i++) {
    const count = (selectedHorsesPerLeg[i] || []).length;
    totalSelectedHorses += count;
    if (count === 0) hasEmptyLeg = true;
    else totalCombinations *= count;
  }

  const finalCombinations = hasEmptyLeg || totalSelectedHorses === 0 ? 0 : totalCombinations;
  const couponCost = finalCombinations * (currentTrack.unitPrice || 0.50);

  // Günün Bankosu ve Günün Sürprizi (tüm koşulardan)
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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
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

          {/* Card 3: Kupon Durumu & Hızlı Aç */}
          <div 
            onClick={() => setIsCouponModalOpen(true)}
            className="bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Altılı Ganyan Kuponum
                </div>
                <div className="text-lg font-black text-white font-mono">
                  {couponCost.toFixed(2)} TL
                </div>
                <div className="text-xs text-slate-400">
                  {finalCombinations} Kombinasyon • Düzenlemek İçin Tıkla
                </div>
              </div>
            </div>
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
          <p>© 2026 Ganyan Pro AI. Tüm hakları saklıdır. TJK resmi yarış bülteni ve yapay zeka karar algoritmaları ile hazırlanmıştır.</p>
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
        onApplyPreset={handleApplyPreset}
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
