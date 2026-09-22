import React, { useState } from 'react';
import { 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Check, 
  Sparkles, 
  Flame, 
  Zap, 
  Info,
  Compass
} from 'lucide-react';

export default function HorseTable({ 
  horses, 
  selectedHorseNumbers = [], 
  onToggleHorse 
}) {
  const [expandedHorseId, setExpandedHorseId] = useState(null);

  const toggleExpand = (horseNumber) => {
    setExpandedHorseId(expandedHorseId === horseNumber ? null : horseNumber);
  };

  // Son koşu derecesi rozet rengi
  const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'bg-amber-400 text-slate-950 font-black';
    if (rank === 2) return 'bg-slate-300 text-slate-900 font-bold';
    if (rank === 3) return 'bg-amber-700 text-white font-bold';
    if (rank === 4 || rank === 5) return 'bg-slate-700 text-slate-300';
    return 'bg-slate-800 text-slate-400';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mb-8">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Koşan Safkanlar & Yapay Zeka Metrikleri</h3>
        </div>
        <span className="text-xs text-slate-400">
          Toplam <strong>{horses.length}</strong> Safkan
        </span>
      </div>

      {/* Desktop / Responsive Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/80">
              <th className="py-3 px-3 w-14 text-center">No</th>
              <th className="py-3 px-4">Safkan / Orijin</th>
              <th className="py-3 px-3">Kilo / Kulvar</th>
              <th className="py-3 px-4">Jokey / Antrenör</th>
              <th className="py-3 px-4">Son 6 Koşu</th>
              <th className="py-3 px-3 text-center">HP / KGS</th>
              <th className="py-3 px-3 text-center">AGF %</th>
              <th className="py-3 px-4 w-44">AI Kazanma %</th>
              <th className="py-3 px-3 text-center">AI Form</th>
              <th className="py-3 px-3 text-center w-28">Kupon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {horses.map((horse) => {
              const isSelected = selectedHorseNumbers.includes(horse.number);
              const isExpanded = expandedHorseId === horse.number;

              return (
                <React.Fragment key={horse.number}>
                  <tr 
                    className={`transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-amber-500/10 hover:bg-amber-500/15' 
                        : 'hover:bg-slate-800/40'
                    }`}
                    onClick={() => toggleExpand(horse.number)}
                  >
                    {/* No & Silk Badge */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs border ${
                          horse.silkColor || 'bg-slate-700 text-white'
                        }`}>
                          {horse.number}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-0.5 font-mono">K:{horse.barrier}</span>
                      </div>
                    </td>

                    {/* Horse Name & Pedigree */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-white tracking-wide">
                          {horse.name}
                        </span>
                        {horse.tag && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold border ${horse.tagColor}`}>
                            {horse.tag}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        <span className="text-slate-300 font-medium">{horse.age}</span> • {horse.sire} - {horse.dam}
                      </div>
                    </td>

                    {/* Weight & Barrier */}
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-200">{horse.weight} kg</span>
                      <div className="text-[10px] text-slate-400">
                        {horse.runningStyle || 'Standart'}
                      </div>
                    </td>

                    {/* Jockey & Trainer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">
                        {horse.jockey}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Ant: {horse.trainer}
                      </div>
                    </td>

                    {/* Last 6 Races Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1">
                        {horse.lastRaces.map((r, i) => (
                          <span 
                            key={i} 
                            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] ${getRankBadgeClass(r)}`}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Handicap & KGS */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="font-bold text-slate-200">{horse.handicap}</div>
                      <div className="text-[10px] text-slate-400">{horse.kgs} gün</div>
                    </td>

                    {/* AGF % */}
                    <td className="py-3.5 px-3 text-center font-bold text-amber-400 font-mono">
                      %{horse.agf ? horse.agf.toFixed(1) : '-'}
                    </td>

                    {/* AI Win Probability */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-emerald-400 font-mono">%{horse.aiWinProbability}</span>
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(5, horse.aiWinProbability))}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* AI Form Rating */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-black font-mono ${
                        horse.aiFormRating >= 85 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : horse.aiFormRating >= 70
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {horse.aiFormRating}
                      </span>
                    </td>

                    {/* Toggle Button */}
                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleHorse(horse.number)}
                        className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 border ${
                          isSelected
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Kuponda</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Ekle</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Drawer: Gallop, Running Style, AI Narrative */}
                  {isExpanded && (
                    <tr className="bg-slate-950/90 border-b border-slate-800">
                      <td colSpan={10} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          {/* Col 1: Galop */}
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide block mb-1">
                              Son İdman & Galop Derecesi
                            </span>
                            <div className="font-mono text-sm text-white font-bold">{horse.gallop || 'Normal İdman'}</div>
                            <p className="text-slate-400 text-[11px] mt-1">İdman pistindeki canlılık ve kondisyon durumu.</p>
                          </div>

                          {/* Col 2: Stil & Taktik */}
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide block mb-1">
                              Koşma Karakteristiği
                            </span>
                            <div className="text-white font-semibold text-sm flex items-center space-x-1.5">
                              <Compass className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{horse.runningStyle || 'Dengeli Takipçi'}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-1">Kulvar {horse.barrier} avantajı ile yarış içi konumlanma.</p>
                          </div>

                          {/* Col 3: AI Yorumu */}
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide block mb-1">
                              Yapay Zeka Analiz Notu
                            </span>
                            <p className="text-slate-300 text-xs leading-relaxed">
                              {horse.aiAnalysis || "Form durumu stabil, düzlük mücadelesinde etkili olabilir."}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
