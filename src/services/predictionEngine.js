// Ganyan Pro AI - Yapay Zeka Tahmin & Analiz Motoru

// Elit jokey katsayıları
const JOCKEY_RATINGS = {
  "Gökhan Kocakaya": 96,
  "Vedat Abiş": 95,
  "Halis Karataş": 94,
  "Ahmet Çelik": 92,
  "Özcan Yıldırım": 90,
  "Akın Sözen": 88,
  "Ercan Çankaya": 85,
  "Görkem Özçelik": 83,
};

/**
 * Safkanın son koşularından ağırlıklı form puanı hesaplar (0 - 100)
 */
function calculateRawFormScore(lastRaces) {
  if (!lastRaces || lastRaces.length === 0) return 50;
  
  // Pozisyon puanları
  const positionPoints = { 1: 100, 2: 82, 3: 68, 4: 52, 5: 38, 6: 25, 7: 15, 8: 10, 9: 5, 0: 2 };
  
  let totalWeightedPoints = 0;
  let totalWeights = 0;
  
  // Son koşudan eskiye doğru (en son koşunun ağırlığı en yüksek)
  const weights = [3.0, 2.2, 1.6, 1.2, 0.9, 0.6];
  
  lastRaces.forEach((rank, idx) => {
    const weight = weights[idx] || 0.5;
    const pts = positionPoints[rank] !== undefined ? positionPoints[rank] : 20;
    totalWeightedPoints += pts * weight;
    totalWeights += weight;
  });
  
  return totalWeights > 0 ? totalWeightedPoints / totalWeights : 50;
}

/**
 * Galop metnini puana dönüştürür
 */
function parseGallopScore(gallopText) {
  if (!gallopText) return 70;
  const lower = gallopText.toLowerCase();
  if (lower.includes("çok canlı") || lower.includes("mükemmel")) return 95;
  if (lower.includes("canlı") || lower.includes("iş")) return 88;
  if (lower.includes("rahat")) return 82;
  if (lower.includes("normal")) return 72;
  return 65;
}

/**
 * Bir koşudaki tüm atları analiz eder, olasılıkları dağıtır ve etiketler
 */
export function analyzeRaceWithAI(race) {
  const horses = race.horses;
  if (!horses || horses.length === 0) return { horses: [], summary: {} };
  
  // 1. Her at için ham metrikleri hesapla
  const scoredHorses = horses.map((h) => {
    const formPts = calculateRawFormScore(h.lastRaces);
    const handicapPts = Math.min(100, Math.max(30, (h.handicap || 50) * 0.95));
    const jockeyPts = JOCKEY_RATINGS[h.jockey] || 75;
    const gallopPts = parseGallopScore(h.gallop);
    
    // KGS (Koşmadığı gün sayısı) optimizasyonu (14-30 gün ideal dinlenmişlik)
    let kgsBonus = 0;
    if (h.kgs >= 14 && h.kgs <= 28) kgsBonus = 5;
    else if (h.kgs > 60) kgsBonus = -8; // uzun ara verme dezavantajı
    
    // Sıklet avantajı (54 kg altı hafif kilo avantajı)
    let weightAdvantage = (58 - (h.weight || 58)) * 1.5;
    
    // Bileşik AI Güç Skoru
    const compositeScore = (
      (formPts * 0.35) +
      (handicapPts * 0.25) +
      (jockeyPts * 0.20) +
      (gallopPts * 0.15) +
      kgsBonus +
      weightAdvantage
    );
    
    return {
      ...h,
      rawScore: Math.max(10, compositeScore)
    };
  });
  
  // 2. Softmax / Olasılık Dağılımı (% Kazanma Olasılığı)
  const totalScore = scoredHorses.reduce((acc, h) => acc + h.rawScore, 0);
  
  const analyzedHorses = scoredHorses.map((h) => {
    const winProb = Math.round((h.rawScore / totalScore) * 100);
    const formRating = Math.min(99, Math.max(45, Math.round(h.rawScore)));
    
    return {
      ...h,
      aiWinProbability: winProb,
      aiFormRating: formRating
    };
  });
  
  // Sıralama (en yüksek olasılıktan düşüğe)
  analyzedHorses.sort((a, b) => b.aiWinProbability - a.aiWinProbability);
  
  // Yüzde yuvarlama düzeltmesi (toplam 100 olsun)
  const probSum = analyzedHorses.reduce((sum, h) => sum + h.aiWinProbability, 0);
  if (probSum !== 100 && analyzedHorses.length > 0) {
    analyzedHorses[0].aiWinProbability += (100 - probSum);
  }
  
  // 3. Etiketleme (BANKO, SÜPER BANKO, PLASE, BOMBA)
  const first = analyzedHorses[0];
  const second = analyzedHorses[1] || { aiWinProbability: 0 };
  
  analyzedHorses.forEach((h, index) => {
    let tag = null;
    let tagColor = "";
    
    if (index === 0) {
      if (h.aiWinProbability >= 48) {
        tag = "SÜPER BANKO";
        tagColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
      } else if (h.aiWinProbability >= 36 && (h.aiWinProbability - second.aiWinProbability >= 10)) {
        tag = "BANKO";
        tagColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      } else {
        tag = "İLK ŞANS";
        tagColor = "bg-blue-500/20 text-blue-300 border-blue-500/40";
      }
    } else if (index === 1 || (index === 2 && h.aiWinProbability >= 18)) {
      tag = "CİDDİ RAKİP";
      tagColor = "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
    } else if (h.agf <= 10 && (h.aiFormRating >= 72 || h.weight <= 53)) {
      tag = "BOMBA / SÜRPRİZ";
      tagColor = "bg-purple-500/20 text-purple-300 border-purple-500/40";
    } else if (index === 2 || index === 3) {
      tag = "PLASE";
      tagColor = "bg-slate-700/40 text-slate-300 border-slate-600/40";
    }
    
    h.tag = tag;
    h.tagColor = tagColor;
    
    // Yapay zeka safkan analiz notu
    h.aiAnalysis = generateHorseComment(h, race);
  });
  
  // Koşu geneli özet sıralama
  const topNumbers = analyzedHorses.slice(0, 4).map(h => h.number);
  const aiRankingString = `${topNumbers[0]} // ${topNumbers.slice(1).join(" - ")}`;
  
  return {
    horses: analyzedHorses,
    rankingString: aiRankingString,
    banko: (first.tag === "BANKO" || first.tag === "SÜPER BANKO") ? first : null,
    surprise: analyzedHorses.find(h => h.tag === "BOMBA / SÜRPRİZ") || null,
    paceForecast: race.paceForecast || "Dengeli",
    expertComment: race.paceDescription || "Dengeli bir mücadele bekleniyor."
  };
}

/**
 * Safkan için profesyonel at yarışı yorumu üretir
 */
function generateHorseComment(horse, race) {
  const parts = [];
  
  if (horse.runningStyle === "Kaçak") {
    parts.push("Startla birlikte liderliği alarak virajı önde dönmek isteyecektir.");
  } else if (horse.runningStyle === "Presçi") {
    parts.push("Ön gruba yakın konumlanarak son virajda liderliği devralmaya çalışacak.");
  } else if (horse.runningStyle === "Sprinter") {
    parts.push("Yarışı geride takip edip son 300 metrede bariyer dibi veya dış kulvardan sert sprinte kalkacak.");
  } else {
    parts.push("Koşuyu orta grupta takip ederek düzlükte boşluk kollayacaktır.");
  }
  
  if (horse.gallop && horse.gallop.includes("İş") || horse.gallop.includes("Canlı")) {
    parts.push("İdman pistindeki canlı görüntüsü formunun zirvesinde olduğunu gösteriyor.");
  }
  
  if (horse.jockey === "Gökhan Kocakaya" || horse.jockey === "Vedat Abiş" || horse.jockey === "Halis Karataş") {
    parts.push(`Usta jokeyi ${horse.jockey} idaresinde koşunun en doğal favorisidir.`);
  }
  
  if (horse.weight <= 53) {
    parts.push("Taşıdığı hafif siklet avantajı düzlük sprintinde safkana ciddi avantaj sağlayacaktır.");
  }
  
  return parts.join(" ");
}

/**
 * Altılı Ganyan Kuponu Oluşturucu (Ekonomik, İdeal, Geniş)
 */
export function generateSmartCoupon(races, mode = "ideal") {
  // Altılı ganyan ayaklarını filtrele
  const sixGanyanRaces = races.filter(r => r.isSixGanyanLeg);
  if (sixGanyanRaces.length === 0) return [];
  
  return sixGanyanRaces.map((race) => {
    const analysis = analyzeRaceWithAI(race);
    const sorted = analysis.horses;
    
    if (mode === "economic") {
      // Ekonomik kupon: Banko ayaklarında tek, diğerlerinde en fazla 2-3 at
      if (analysis.banko) {
        return [analysis.banko.number];
      }
      return sorted.slice(0, 2).map(h => h.number);
    } else if (mode === "wide") {
      // Geniş kupon: Sürpriz ve bombaları da ekle
      const picks = sorted.slice(0, 3).map(h => h.number);
      if (analysis.surprise && !picks.includes(analysis.surprise.number)) {
        picks.push(analysis.surprise.number);
      }
      if (sorted.length >= 5 && picks.length < 4) {
        picks.push(sorted[3].number);
      }
      return picks;
    } else {
      // İdeal kupon
      if (analysis.banko && analysis.banko.aiWinProbability >= 45) {
        return [analysis.banko.number];
      }
      return sorted.slice(0, 3).map(h => h.number);
    }
  });
}
