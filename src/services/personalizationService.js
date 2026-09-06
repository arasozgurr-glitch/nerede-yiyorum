import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFS_KEY = "ny_preferences_data";
const SIGNALS_KEY = "ny_personalization_signals";
const MAX_SIGNAL_ITEMS = 120;

export async function getUserPreferences() {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function getSignals() {
  try {
    const raw = await AsyncStorage.getItem(SIGNALS_KEY);
    return raw ? JSON.parse(raw) : { viewed: {}, favored: {}, categories: {}, searches: {} };
  } catch {
    return { viewed: {}, favored: {}, categories: {}, searches: {} };
  }
}

async function saveSignals(signals) {
  await AsyncStorage.setItem(SIGNALS_KEY, JSON.stringify(signals));
}

export async function recordRestaurantView(restaurant) {
  if (!restaurant?.id) return;
  const s = await getSignals();
  s.viewed[restaurant.id] = Math.min(12, Number(s.viewed[restaurant.id] || 0) + 1);
  await saveSignals(s);
}

export async function recordFavoriteSignal(restaurant, isFav) {
  if (!restaurant?.id) return;
  const s = await getSignals();
  if (isFav) s.favored[restaurant.id] = 1;
  else delete s.favored[restaurant.id];
  await saveSignals(s);
}

export async function recordCategorySignal(categoryId) {
  if (!categoryId) return;
  const s = await getSignals();
  s.categories[categoryId] = Math.min(20, Number(s.categories[categoryId] || 0) + 1);
  await saveSignals(s);
}

export async function recordSearchSignal(query) {
  const q = String(query || "").trim().toLocaleLowerCase("tr-TR");
  if (!q || q.length < 2) return;
  const s = await getSignals();
  s.searches[q] = Math.min(20, Number(s.searches[q] || 0) + 1);
  const entries = Object.entries(s.searches).sort((a, b) => b[1] - a[1]).slice(0, MAX_SIGNAL_ITEMS);
  s.searches = Object.fromEntries(entries);
  await saveSignals(s);
}

export function cuisineMatch(restaurant, cuisines = []) {
  if (!cuisines.length) return 0;
  const haystack = [restaurant?.name, restaurant?.address, ...(restaurant?.types || []), restaurant?.categoryKeyword]
    .filter(Boolean).join(" ").toLocaleLowerCase("tr-TR");
  const aliases = {
    "Türk": ["turkish", "türk", "kebab", "lokanta", "meyhane", "ocakbaşı"],
    "İtalyan": ["italian", "italyan", "pizza", "pasta"],
    "Burger": ["burger", "hamburger"],
    "Pizza": ["pizza"],
    "Japon": ["japanese", "japon", "sushi", "ramen"],
    "Kahvaltı": ["breakfast", "kahvaltı", "brunch"],
    "Deniz ürünleri": ["seafood", "fish", "balık", "deniz"],
    "Steak": ["steak", "et", "grill", "ızgara"],
    "Vegan": ["vegan", "vegetarian", "vejetaryen"],
    "Kafe": ["cafe", "coffee", "café", "kahve"]
  };
  const matches = cuisines.filter(c => (aliases[c] || [c.toLocaleLowerCase("tr-TR")]).some(a => haystack.includes(a))).length;
  return Math.min(1, matches / Math.max(1, Math.min(2, cuisines.length)));
}

function budgetMatch(restaurant, budget) {
  if (!budget || restaurant?.priceLevel == null) return 0.5;
  const target = ({"₺":1,"₺₺":2,"₺₺₺":3,"₺₺₺₺":4})[budget] || 2;
  return Math.max(0, 1 - Math.abs(Number(restaurant.priceLevel) - target) / 3);
}

function distanceMatch(distance, preference) {
  if (distance == null) return 0.5;
  const max = parseFloat(String(preference || "3"));
  if (!Number.isFinite(max) || max <= 0) return 0.5;
  return Math.max(0, 1 - distance / max);
}

export function personalizedScore(restaurant, { preferences, signals, distance, getDistance }) {
  const effectiveDistance = getDistance ? getDistance(restaurant) : distance;
  const base = Number(restaurant._weightedScore ?? restaurant.rating ?? 0) / 5;
  const cuisine = cuisineMatch(restaurant, preferences?.cuisine || []);
  const budget = budgetMatch(restaurant, preferences?.budget);
  const proximity = distanceMatch(effectiveDistance, preferences?.distance);
  const favorite = signals?.favored?.[restaurant.id] ? 1 : 0;
  const viewed = Math.min(1, Number(signals?.viewed?.[restaurant.id] || 0) / 6);
  const feedback = signals?.feedback?.[restaurant.id];
  const feedbackBoost = feedback === "like" ? 0.08 : feedback === "dislike" ? -0.12 : 0;
  return (base * 0.43) + (cuisine * 0.24) + (budget * 0.10) + (proximity * 0.12) + (favorite * 0.08) + (viewed * 0.03) + feedbackBoost;
}

export function personalizeRestaurants(restaurants, context) {
  return [...restaurants].sort((a, b) => personalizedScore(b, context) - personalizedScore(a, context));
}


export async function recordRestaurantFeedback(restaurant, feedback) {
  if (!restaurant?.id || !["like", "dislike"].includes(feedback)) return;
  const s = await getSignals();
  s.feedback = s.feedback || {};
  s.feedback[restaurant.id] = feedback;
  await saveSignals(s);
}
