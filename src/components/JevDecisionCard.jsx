import React, { useState } from 'react';
import { Zap, Sparkles, CheckCircle2, ShieldAlert, DollarSign, Activity } from 'lucide-react';

export default function JevDecisionCard({ race, apiKey }) {
  const [loading, setLoading] = useState(false);
  const [jevResult, setJevResult] = useState(null);
  const [error, setError] = useState(null);

  const runJevAnalysis = async () => {
    if (!race || !race.horses) return;
    setLoading(true);
    setError(null);

    // Format race state for Jev System One model
    const horsesSummary = race.horses.map(h => 
      `${h.number}. ${h.name} (${h.weight}kg, Jokey: ${h.jockey}, Son: ${h.lastRaces.join('-')}, HP: ${h.handicap}, AGF: %${h.agf})`
    ).join("\n");

    const stateText = `
Koşu Bilgisi: ${race.raceNumber}. Koşu (${race.distance}m ${race.trackType} Pist, ${race.group}, ${race.raceType})
Katılan Safkanlar:
${horsesSummary}
    `.trim();

    // Soru kriterleri (en fazla 4 ana aday)
    const topHorses = race.horses.slice(0, 4);
    const choiceCriteria = {};
    topHorses.forEach(h => {
      choiceCriteria[h.name.replace(/\s+/g, '_')] = `${h.number} numaralı ${h.name} (${h.jockey})`;
    });
    choiceCriteria["DIGER_SURPRIZ"] = "Diğer sürpriz safkanlar";

    const payload = {
      model: "jev-1.13",
      state: stateText,
      questions: {
        kazanma_adayi: {
          type: "choice",
          instructions: "Bu koşuda galibiyete en yakın safkan hangisidir?",
          criteria: choiceCriteria
        },
        tek_yazilir_mi: {
          type: "noul",
          instructions: "Bu koşuda en öne çıkan favori safkan kupona tek (banko) yazılacak kadar sağlam mı?"
        },
        guven_endeksi: {
          type: "score",
          instructions: "Koşunun öngörülebilirlik ve güvenilirlik derecesini puanla.",
          criteria: ["Kaotik / Sürpriz", "Riskli", "Dengeli", "Banko / Sağlam"]
        }
      }
    };

    try {
      const res = await fetch("https://openrouter.ai/api/v1/systemone", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Jev API Hatası (${res.status}): ${errText}`);
      }

      const data = await res.json();
      setJevResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Jev çıkarımı yapılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-4 mb-6 shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-indigo-900/40">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Zap className="w-5 h-5 fill-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-white">Jev (Sistem 1) Refleks Karar Motoru</span>
              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                TypeSafe AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Düşünmeyen, metin üretmeyen mikro saniyelik olasılık çıkarımı</p>
          </div>
        </div>

        <button
          onClick={runJevAnalysis}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-md shadow-indigo-900/40 transition flex items-center space-x-1.5 disabled:opacity-50 shrink-0"
        >
          {loading ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Jev Çıkarım Yapıyor...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Jev Kararını Al (Canlı)</span>
            </>
          )}
        </button>
      </div>

      {/* Results View */}
      {jevResult && (
        <div className="mt-3 pt-1 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            
            {/* Box 1: Winner Choice */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Jev Seçimi (Olasılık Dağılımı)
              </span>
              <div className="text-base font-black text-amber-400">
                {jevResult.answers?.kazanma_adayi?.choice?.replace(/_/g, ' ')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Karar Güveni: <strong>%{(jevResult.answers?.kazanma_adayi?.confidence * 100).toFixed(0)}</strong>
              </div>
            </div>

            {/* Box 2: Banko Meter */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Tek / Banko Olasılığı (Noul)
              </span>
              <div className="text-base font-black text-emerald-400">
                %{(jevResult.answers?.tek_yazilir_mi?.noul * 100).toFixed(1)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {jevResult.answers?.tek_yazilir_mi?.noul >= 0.5 ? "Kupona tek yazılabilir." : "Çok at yazılması önerilir."}
              </div>
            </div>

            {/* Box 3: Safety Score */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Koşu Güven Puanı (Score)
              </span>
              <div className="text-base font-black text-cyan-400">
                {jevResult.answers?.guven_endeksi?.score?.toFixed(2)} / 3.0
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Model Maliyeti: <span className="font-mono text-slate-300">${jevResult.usage?.cost?.toFixed(6) || "0.00003"}</span>
              </div>
            </div>

          </div>

          <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Model: <code className="text-slate-400">{jevResult.model}</code> (Sağlayıcı: {jevResult.provider})</span>
            <span>Girdi: {jevResult.usage?.input_tokens} token • Çıktı: 0 token (Ücretsiz)</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
