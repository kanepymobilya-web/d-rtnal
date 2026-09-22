import React from 'react';
import { MapPin, Sun, CloudRain, CheckCircle2 } from 'lucide-react';

export default function TrackSelector({ tracks, selectedTrackId, onSelectTrack }) {
  return (
    <div className="bg-slate-900/50 border-b border-slate-800 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-2 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400" /> Hipodrom:
          </span>
          
          {tracks.map((track) => {
            const isSelected = track.id === selectedTrackId;
            return (
              <button
                key={track.id}
                onClick={() => onSelectTrack(track.id)}
                className={`relative px-4 py-2 rounded-xl text-left transition-all flex items-center space-x-3 shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/15 via-slate-800 to-slate-800 border-amber-500/50 text-white shadow-lg shadow-amber-500/5'
                    : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/50 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold tracking-tight">{track.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      track.badge === 'Gece' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {track.badge}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{track.totalRaces} Koşu</span>
                    <span>•</span>
                    <span className="truncate max-w-[120px]">{track.weather}</span>
                  </div>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
