import React from 'react';
import { Sparkles, Trophy, Clock, ShieldCheck, Ticket, PlayCircle, Bot } from 'lucide-react';

export default function Header({ 
  onOpenCoupon, 
  onOpenSimulation, 
  onOpenAI, 
  couponHorseCount,
  couponCost 
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white">GANYAN<span className="text-amber-400">PRO</span></span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-400" /> AI v2.6
                </span>
              </div>
              <p className="text-xs text-slate-400">TJK Resmi Programı & Yapay Zeka Tahmin Motoru</p>
            </div>
          </div>

          {/* Quick Stats / Info */}
          <div className="hidden md:flex items-center space-x-6 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-200 font-medium">AGF Oranları Canlı</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sistem 1 Karar Modeli</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenSimulation}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Yarışı 2D Simülatörde Canlı İzle"
            >
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Canlı Simülasyon</span>
            </button>

            <button
              onClick={onOpenAI}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-700/50 transition"
              title="Yapay Zeka Asistanı & Analiz"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">AI Asistanı</span>
            </button>

            <button
              onClick={onOpenCoupon}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition"
            >
              <Ticket className="w-4 h-4 text-slate-950" />
              <span>Kuponum</span>
              {couponHorseCount > 0 && (
                <span className="bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded text-[11px] font-black">
                  {couponCost.toFixed(2)} TL
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
