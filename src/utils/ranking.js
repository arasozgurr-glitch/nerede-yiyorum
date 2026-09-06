// Sadece ham puana göre sıralamak yanıltıcıdır: 3 yorumla 5.0 puan alan bir yer,
// 2000 yorumla 4.6 puan alan bir yerden "daha iyi" görünür ama güvenilir değildir.
// Bu yüzden Bayesian ağırlıklı ortalama kullanıyoruz: yorum sayısı arttıkça
// restoranın kendi puanına duyulan güven artar, azken genel ortalamaya yaklaşır.

const MIN_VOTES_THRESHOLD = 30; // bu sayının altındaki yorum sayıları ortalamaya çekilir

export function calculateAverageRating(restaurants) {
  if (restaurants.length === 0) return 0;
  const sum = restaurants.reduce((acc, r) => acc + r.rating, 0);
  return sum / restaurants.length;
}

export function weightedScore(restaurant, averageRating, m = MIN_VOTES_THRESHOLD) {
  const v = restaurant.reviewCount;
  const R = restaurant.rating;
  if (v + m === 0) return averageRating;
  return (v / (v + m)) * R + (m / (v + m)) * averageRating;
}

export function sortByWeightedScore(restaurants) {
  const avg = calculateAverageRating(restaurants);
  return [...restaurants].sort(
    (a, b) => weightedScore(b, avg) - weightedScore(a, avg)
  );
}

// İki koordinat arası mesafeyi kilometre cinsinden döner (haversine formülü)
export function distanceKm(from, to) {
  if (!from || !to || to.latitude == null || to.longitude == null) return null;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(to.latitude - from.latitude);
  const dLng = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function attachWeightedScores(restaurants) {
  const avg = calculateAverageRating(restaurants);
  return restaurants.map((restaurant) => ({
    ...restaurant,
    _weightedScore: weightedScore(restaurant, avg),
  }));
}


export function recommendationReason(restaurant, { preferences, signals, distance }) {
  const reasons = [];
  const cuisineText = (preferences?.cuisine || []).find(c => {
    const hay = [restaurant?.name, restaurant?.address, ...(restaurant?.types || []), restaurant?.categoryKeyword].filter(Boolean).join(" ").toLocaleLowerCase("tr-TR");
    const aliases = { Türk:["turkish","türk","kebab","lokanta","meyhane","ocakbaşı"], İtalyan:["italian","italyan","pizza","pasta"], Burger:["burger","hamburger"], Pizza:["pizza"], Japon:["japanese","japon","sushi","ramen"], Kahvaltı:["breakfast","kahvaltı","brunch"], "Deniz ürünleri":["seafood","fish","balık","deniz"], Steak:["steak","et","grill","ızgara"], Vegan:["vegan","vegetarian","vejetaryen"], Kafe:["cafe","coffee","café","kahve"] };
    return (aliases[c] || [c.toLocaleLowerCase("tr-TR")]).some(a => hay.includes(a));
  });
  if (cuisineText) reasons.push(`${cuisineText} tercihinle uyumlu`);
  if (preferences?.budget && restaurant.priceLevel) reasons.push(`${"₺".repeat(Number(restaurant.priceLevel))} bütçene yakın`);
  if (distance != null && preferences?.distance && distance <= Number(preferences.distance)) reasons.push(`${distance.toFixed(1)} km ile yakınında`);
  if (restaurant.reviewCount >= 100) reasons.push("yüksek yorum güvenilirliği");
  if (signals?.feedback?.[restaurant.id] === "like") reasons.push("daha önce beğendin");
  return reasons.slice(0, 2).join(" · ") || "Puan, mesafe ve genel kalite dengesiyle seçildi";
}
