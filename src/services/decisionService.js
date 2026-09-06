import { cuisineMatch } from './personalizationService';

const clamp01 = (v) => Math.max(0, Math.min(1, Number(v) || 0));
const rating = (r) => clamp01((Number(r.rating) || 0) / 5);
const reviews = (r) => Math.min(1, Math.log10((Number(r.reviewCount) || 0) + 1) / 4);
const priceFit = (r, budget) => {
  if (!budget || r.priceLevel == null) return 0.5;
  const target = ({ '₺': 1, '₺₺': 2, '₺₺₺': 3, '₺₺₺₺': 4 })[budget] || 2;
  return clamp01(1 - Math.abs(Number(r.priceLevel) - target) / 3);
};
const distanceFit = (km, max) => {
  const d = Number(km);
  const m = parseFloat(String(max || 3));
  if (!Number.isFinite(d) || !Number.isFinite(m) || m <= 0) return 0.5;
  return clamp01(1 - d / m);
};

export function buildDecisionPicks(restaurants, { preferences, signals, getDistance }) {
  if (!restaurants?.length) return [];
  const viewed = signals?.viewed || {};
  const favored = signals?.favored || {};

  const scored = restaurants.map((r) => {
    const km = getDistance ? getDistance(r) : null;
    const cuisine = cuisineMatch(r, preferences?.cuisine || []);
    const pFit = priceFit(r, preferences?.budget);
    const dFit = distanceFit(km, preferences?.distance);
    const familiar = clamp01((Number(viewed[r.id]) || 0) / 6);
    const isFav = favored[r.id] ? 1 : 0;
    const reliability = rating(r) * 0.75 + reviews(r) * 0.25;
    const personal = reliability * 0.43 + cuisine * 0.24 + pFit * 0.10 + dFit * 0.12 + isFav * 0.08 + familiar * 0.03;
    const novelty = reliability * 0.42 + (1 - cuisine) * 0.28 + dFit * 0.15 + (1 - familiar) * 0.15;
    const value = rating(r) * 0.38 + reviews(r) * 0.12 + pFit * 0.25 + dFit * 0.25;
    return { r, km, personal, novelty, value, cuisine, pFit, dFit, familiar };
  });

  const best = (key, used) => scored.filter(x => !used.has(x.r.id)).sort((a,b) => b[key] - a[key])[0];
  const used = new Set();
  const picks = [];
  const specs = [
    { key: 'personal', type: 'Sana en uygun', icon: '✦', reason: (x) => x.cuisine >= 0.5 ? 'Sevdiğin mutfağa ve tercihlerine en yakın seçenek.' : 'Puan, mesafe ve bütçe tercihini en dengeli karşılayan seçenek.' },
    { key: 'novelty', type: 'Yeni bir şey dene', icon: '✦', reason: (x) => x.cuisine < 0.5 ? 'Alışılmış tercihinden biraz farklı; yeni bir deneyim için seçildi.' : 'Yüksek kaliteyi korurken daha farklı bir seçenek sunuyor.' },
    { key: 'value', type: 'Fiyat / performans', icon: '₺', reason: (x) => 'Puan, yorum güvenilirliği, fiyat ve mesafeyi birlikte değerlendiriyor.' },
  ];
  specs.forEach((s) => { const x = best(s.key, used); if (x) { used.add(x.r.id); picks.push({ ...s, ...x }); } });
  return picks;
}
