import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, X, Flag, Volume2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SimulationModal({ 
  isOpen, 
  onClose, 
  race 
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [horsePositions, setHorsePositions] = useState({});
  const [commentary, setCommentary] = useState("Koşu başlamak üzere. Safkanlar start kutusunda!");
  const [winner, setWinner] = useState(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isOpen && race && race.horses) {
      resetSimulation();
    }
  }, [isOpen, race]);

  const resetSimulation = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsRunning(false);
    setProgress(0);
    setWinner(null);
    setCommentary("Start hakemi bayrağını kaldırdı. Safkanlar start kutusunda!");

    // Başlangıç pozisyonları (start box)
    const initialPos = {};
    race.horses.forEach((h) => {
      initialPos[h.number] = 0;
    });
    setHorsePositions(initialPos);
  };

  const startSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setWinner(null);
    let currentProgress = 0;

    // Her at için hız ve ivme katsayıları
    const speeds = {};
    race.horses.forEach((h) => {
      // AI kazanma olasılığı yüksek olan atlara hafif avantaj + hafif rassallık
      const baseSpeed = 0.6 + (h.aiWinProbability || 20) * 0.008;
      speeds[h.number] = {
        base: baseSpeed,
        sprint: 0.9 + Math.random() * 0.4,
        runningStyle: h.runningStyle || 'Standart',
        pos: 0
      };
    });

    const runFrame = () => {
      currentProgress += 0.4;
      setProgress(Math.min(100, currentProgress));

      const updatedPos = {};
      let leaderNumber = null;
      let maxPos = -1;

      race.horses.forEach((h) => {
        const s = speeds[h.number];
        let move = s.base + (Math.random() - 0.48) * 0.25;

        // Taktiksel koşma stiline göre hızlanma evreleri
        if (currentProgress < 40) {
          // Erken safha: Kaçak atlar öne fırlar
          if (s.runningStyle === "Kaçak") move *= 1.35;
        } else if (currentProgress >= 65) {
          // Son 400m ve düzlük: Sprinterler atağa kalkar
          if (s.runningStyle === "Sprinter") move *= 1.45;
          else if (s.runningStyle === "Presçi") move *= 1.25;
        }

        s.pos += move;
        updatedPos[h.number] = s.pos;

        if (s.pos > maxPos) {
          maxPos = s.pos;
          leaderNumber = h.number;
        }
      });

      setHorsePositions({ ...updatedPos });

      // Spiker Yorumları (Mesafeye göre canlı heyecan)
      const leaderHorse = race.horses.find(h => h.number === leaderNumber);
      const leaderName = leaderHorse ? `${leaderHorse.number} numaralı ${leaderHorse.name}` : "Lider";

      if (currentProgress < 15) {
        setCommentary("START VERİLDİ VE KOŞU BAŞLADI! Safkanlar ilk yüz metrede liderlik mücadelesinde!");
      } else if (currentProgress < 45) {
        setCommentary(`Viraja doğru gidiliyor! ${leaderName} hafif tempoyla liderliği almış durumda.`);
      } else if (currentProgress < 70) {
        setCommentary(`Son 600 geçildi, son düzlüğe çıkılıyor! ${leaderName} bariyer dibinde avantajını koruyor!`);
      } else if (currentProgress < 90) {
        setCommentary(`SON 200 METRE! Dış kulvardan müthiş sprintler geliyor! Baş başa bir mücadele!`);
      } else if (currentProgress < 100) {
        setCommentary(`POTA GÖRÜNDÜ! ${leaderName} kazanmaya çok yakın!`);
      }

      if (currentProgress < 100) {
        animationRef.current = requestAnimationFrame(runFrame);
      } else {
        // Yarış Bitti!
        setIsRunning(false);
        const sortedHorses = [...race.horses].sort((a, b) => speeds[b.number].pos - speeds[a.number].pos);
        const winHorse = sortedHorses[0];
        setWinner(winHorse);
        setCommentary(`VE POTAYI ${winHorse.number} NUMARALI ${winHorse.name} ÖNDE GEÇİYOR! KAZANAN ${winHorse.name}!`);

        // Konfeti patlat
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    };

    animationRef.current = requestAnimationFrame(runFrame);
  };

  if (!isOpen || !race) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Canlı 2D Yarış Simülatörü</h3>
              <p className="text-xs text-slate-400">{race.raceNumber}. Koşu • {race.distance}m {race.trackType} ({race.group})</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Commentary Box */}
        <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
            <Volume2 className="w-4 h-4 animate-bounce" />
          </div>
          <div className="text-xs font-semibold text-amber-200 leading-snug font-mono">
            {commentary}
          </div>
        </div>

        {/* Racetrack Visual Canvas */}
        <div className="p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-y-auto space-y-3">
          
          {/* Finish Line & Markers Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-2">
            <span>START</span>
            <span>1000m</span>
            <span>600m</span>
            <span>400m</span>
            <span>200m</span>
            <span className="text-amber-400 font-bold flex items-center">
              <Flag className="w-3.5 h-3.5 mr-1" /> FİNİŞ
            </span>
          </div>

          {/* Lanes */}
          <div className="space-y-2 relative border-r-4 border-amber-500/60 pr-2">
            {race.horses.map((horse) => {
              const rawPos = horsePositions[horse.number] || 0;
              // Normalize to percentage of track (0% to 92% to stay in view)
              const maxSim = 120;
              const lanePercent = Math.min(92, (rawPos / maxSim) * 100);

              return (
                <div 
                  key={horse.number}
                  className="h-11 bg-slate-950/80 rounded-xl border border-slate-800/80 relative flex items-center px-2 overflow-hidden shadow-inner"
                >
                  {/* Distance grid lines */}
                  <div className="absolute inset-0 grid grid-cols-5 pointer-events-none opacity-10">
                    <div className="border-r border-white"></div>
                    <div className="border-r border-white"></div>
                    <div className="border-r border-white"></div>
                    <div className="border-r border-white"></div>
                  </div>

                  {/* Horse Avatar Moving */}
                  <div 
                    className="absolute transition-all duration-75 flex items-center space-x-2"
                    style={{ left: `${lanePercent}%` }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shadow-md border ${
                      horse.silkColor || 'bg-amber-500 text-slate-950'
                    }`}>
                      {horse.number}
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-[11px] font-bold text-white whitespace-nowrap drop-shadow">
                        {horse.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Winner Card */}
          {winner && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 border border-amber-500/40 text-center animate-in zoom-in-95">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                🏆 KOŞU KAZANANI
              </span>
              <div className="text-2xl font-black text-white">
                {winner.number} - {winner.name}
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Jokey: <strong>{winner.jockey}</strong> • AI Kazanma Tahmini: %{winner.aiWinProbability}
              </div>
            </div>
          )}

        </div>

        {/* Modal Controls */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={resetSimulation}
            disabled={isRunning}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Sıfırla</span>
          </button>

          <button
            onClick={startSimulation}
            disabled={isRunning}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center space-x-2 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{isRunning ? 'Yarış Sürüyor...' : 'Yarışı Başlat!'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
