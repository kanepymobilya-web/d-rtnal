import React from 'react';
import { Clock, Zap } from 'lucide-react';

export default function RaceNavigation({ 
  races, 
  selectedRaceNumber, 
  onSelectRace,
  sixGanyanStartRace 
}) {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 sticky top-20 z-30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 overflow-x-auto py-2.5 scrollbar-none">
          {races.map((race) => {
            const isSelected = race.raceNumber === selectedRaceNumber;
            const isSixGanyan = race.isSixGanyanLeg;

            return (
              <button
                key={race.raceNumber}
                onClick={() => onSelectRace(race.raceNumber)}
                className={`relative px-3.5 py-2 rounded-xl transition-all shrink-0 border text-left ${
                  isSelected
                    ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-extrabold">{race.raceNumber}. Koşu</span>
                  <div className={`flex items-center text-xs font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                    <Clock className="w-3 h-3 mr-0.5" />
                    <span>{race.time}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 mt-0.5 text-[11px]">
                  <span className={`${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                    {race.distance}m {race.trackType}
                  </span>
                  {isSixGanyan && (
                    <span className={`px-1 rounded text-[10px] font-black ${
                      isSelected ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {race.isSixGanyanLeg}. AYAK
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
