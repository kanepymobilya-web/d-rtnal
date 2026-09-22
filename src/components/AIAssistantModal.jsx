import React, { useState } from 'react';
import { Bot, Send, Sparkles, Key, Check, AlertCircle, X, ShieldCheck } from 'lucide-react';

export default function AIAssistantModal({ 
  isOpen, 
  onClose, 
  currentRace, 
  analysis 
}) {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENROUTER_API_KEY || "");
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "ai",
      text: "Merhaba! Ben Ganyan Pro AI yarış asistanıyım. Jev (Sistem 1) karar modeli ve yerleşik yarış analiz motorumuz ile hizmetinizdeyim. Günün koşuları, bankolar, tempo analizleri ve kupon kurguları hakkında bana dilediğinizi sorabilirsiniz."
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt = null) => {
    const query = customPrompt || inputMessage;
    if (!query.trim() || loading) return;

    // Kullanıcı mesajını ekle
    const newHistory = [...chatHistory, { sender: "user", text: query }];
    setChatHistory(newHistory);
    setInputMessage("");
    setLoading(true);

    try {
      // OpenRouter API çağrısı (veya yerleşik akıllı yanıt)
      const raceContext = currentRace ? `
Koşu: ${currentRace.raceNumber}. Koşu (${currentRace.distance}m ${currentRace.trackType}, ${currentRace.group}, ${currentRace.raceType})
Koşan Atlar: ${currentRace.horses.map(h => `${h.number}-${h.name} (${h.jockey}, AGF: %${h.agf})`).join(", ")}
AI Analizi: Banko: ${analysis.banko ? analysis.banko.name : 'Yok'}, Sıralama: ${analysis.rankingString}, Tempo: ${analysis.paceForecast}
      ` : "Genel yarış bülteni.";

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini", // veya typesafe
          messages: [
            {
              role: "system",
              content: `Sen Türkiye Jokey Kulübü (TJK) yarışları ve Altılı Ganyan konusunda uzmanlaşmış profesyonel bir yapay zeka yarış yazarısın. Kullanıcıya atların form durumu, tempo analizi, orijin yatkınlığı ve kupon bütçesine göre net, somut ve ikna edici tavsiyeler ver. Kısa, vurucu ve profesyonel Türkçe konuş.\n\nBağlam:\n${raceContext}`
            },
            {
              role: "user",
              content: query
            }
          ]
        })
      });

      if (!res.ok) {
        throw new Error(`API hatası: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Cevap üretilemedi.";

      setChatHistory([...newHistory, { sender: "ai", text: reply }]);
    } catch (err) {
      // Yerleşik yedek akıllı yanıt
      let fallback = "Koşu analizine göre: ";
      if (query.toLowerCase().includes("banko")) {
        fallback += analysis.banko 
          ? `Bu koşunun en net bankosu ${analysis.banko.number} numaralı ${analysis.banko.name}. Jokeyi ${analysis.banko.jockey} ile %${analysis.banko.aiWinProbability} kazanma olasılığına sahip.`
          : "Bu ayakta öne çıkan tek bir banko yok, koşu sürprize açık; 2 veya daha fazla at yazmanızı tavsiye ederim.";
      } else if (query.toLowerCase().includes("sürpriz") || query.toLowerCase().includes("bomba")) {
        fallback += analysis.surprise
          ? `Günün bombası ${analysis.surprise.number} numaralı ${analysis.surprise.name}! AGF oranı düşük olsa da hafif siklet ve form puanı ile ters bir yarış koşabilir.`
          : "Mevcut koşuda büyük bir sürpriz adayı yerine ilk 3 at arasında dengeli bir mücadele bekleniyor.";
      } else {
        fallback += `Koşuda öne çıkan sıralama: ${analysis.rankingString}. ${analysis.expertComment}`;
      }

      setChatHistory([...newHistory, { sender: "ai", text: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[650px] max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Ganyan Pro AI Yarış Danışmanı</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  OpenRouter & Jev Aktif
                </span>
              </div>
              <p className="text-xs text-slate-400">Canlı yarış analizi, banko ve tempo soruları</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Questions Chips */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => handleSend("Bu koşuda banko at hangisi?")}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition border border-slate-700"
          >
            🎯 Banko at hangisi?
          </button>
          <button
            onClick={() => handleSend("Bu ayakta sürpriz/bomba kim?")}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition border border-slate-700"
          >
            💣 Sürpriz/Bomba kim?
          </button>
          <button
            onClick={() => handleSend("Koşunun temposu ve taktik senaryosu nasıl olur?")}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition border border-slate-700"
          >
            ⚡ Taktik senaryosu nasıl?
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-amber-500 text-slate-950 font-medium rounded-tr-sm"
                    : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/90 text-slate-300 border border-slate-700/60 p-3 rounded-2xl text-xs flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Yapay zeka analiz ediyor...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Koşu, jokey veya at hakkında bir soru sorun..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition disabled:opacity-50 flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
