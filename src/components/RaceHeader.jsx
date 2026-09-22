import React from 'react';
import { Award, Compass, DollarSign, Flag, Play, Sparkles, TrendingUp } from 'lucide-react';

export default function RaceHeader({ race, analysis, onSimulateRace }) {
  if (!race) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-5 mb-6 shadow-xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Left: Race Information */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
              {race.raceNumber}. KOŞU
            </span>
            {race.isSixGanyanLeg && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Altılı Ganyan {race.isSixGanyanLeg}. Ayak
              </span>
            )}
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {race.group}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-emerald-400 border border-slate-700">
              {race.raceType}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{race.distance} Metre {race.trackType} Pist</span>
            <span className="text-sm font-normal text-slate-400">({race.condition})</span>
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>İkramiye: <strong className="text-slate-200">{race.prize}</strong></span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Koşu Temposu: <strong className="text-cyan-300">{analysis.paceForecast}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: AI Quick Ranking Box & Simulation trigger */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <div className="pr-3 sm:border-r border-slate-800">
            <div className="flex items-center space-x-1 text-xs text-amber-400 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yapay Zeka Sıralaması</span>
            </div>
            <div className="text-lg font-black tracking-wide text-white font-mono">
              {analysis.rankingString || "Analiz Ediliyor..."}
            </div>
            <div className="text-[11px] text-slate-400">
              {analysis.banko ? `Banko: ${analysis.banko.number} ${analysis.banko.name}` : "Günün dengeli ayağı"}
            </div>
          </div>

          <button
            onClick={onSimulateRace}
            className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Yarışı Canlı Simüle Et</span>
          </button>
        </div>

      </div>

      {/* Pace / Scenario note */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 flex items-start space-x-2 bg-slate-950/40 p-2.5 rounded-lg">
        <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold">Taktik ve Senaryo Analizi: </strong>
          <span>{analysis.expertComment}</span>
        </div>
      </div>
    </div>
  );
}
