import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

function assertBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error(
      "Sunucu adresi bulunamadı. app.json içindeki 'extra.apiBaseUrl' alanını backend'inizin adresiyle doldurun (bkz. server/README.md)."
    );
  }
}

/**
 * Verilen konuma, kategoriye ve filtrelere göre kendi backend'imiz üzerinden
 * (Google'a değil!) yakındaki restoranları çeker. API anahtarı sunucuda kalır.
 *
 * @param {{latitude:number, longitude:number}} location
 * @param {object} options
 * @param {string} [options.keyword] - kategori anahtar kelimesi
 * @param {number} [options.radiusMeters] - arama yarıçapı (metre)
 * @param {boolean} [options.openNow] - sadece şu an açık olanlar
 * @param {number} [options.minPrice] - 0-4 arası Google fiyat seviyesi
 * @param {number} [options.maxPrice] - 0-4 arası Google fiyat seviyesi
 */
export async function fetchNearbyRestaurants(location, options = {}) {
  assertBaseUrl();
  const { keyword = "", radiusMeters = 3000, openNow, minPrice, maxPrice } = options;

  const params = new URLSearchParams({
    lat: String(location.latitude),
    lng: String(location.longitude),
    radius: String(radiusMeters),
  });
  if (keyword) params.append("keyword", keyword);
  if (openNow) params.append("opennow", "true");
  if (minPrice != null) params.append("minprice", String(minPrice));
  if (maxPrice != null) params.append("maxprice", String(maxPrice));

  const response = await fetch(`${API_BASE_URL}/api/nearby?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Sunucudan yanıt alınamadı");
  }

  return (data.results || []).map((place) => normalizePlace({ ...place, _categoryKeyword: keyword }));
}

/**
 * Tek bir restoranın detayını getirir: telefon, çalışma saatleri, fotoğraflar,
 * tam adres, website. Detay ekranı için kullanılır.
 */
export async function fetchPlaceDetails(placeId) {
  assertBaseUrl();
  const params = new URLSearchParams({ placeId });
  const response = await fetch(`${API_BASE_URL}/api/details?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Detay alınamadı");
  }

  const r = data.result;
  return {
    name: r.name,
    phone: r.phone || null,
    address: r.address || null,
    rating: r.rating ?? 0,
    reviewCount: r.reviewCount ?? 0,
    priceLevel: r.priceLevel ?? null,
    website: r.website || null,
    googleUrl: r.googleUrl || null,
    isOpenNow: r.isOpenNow ?? null,
    weekdayText: r.weekdayText || [],
    photoReferences: (r.photoReferences || []).slice(0, 8),
    reviews: (r.reviews || []).map((review) => ({
      authorName: review.authorName || "Google kullanıcısı",
      rating: review.rating ?? 0,
      text: review.text || "",
      relativeTime: review.relativeTime || "",
      authorUrl: review.authorUrl || null,
      profilePhotoUrl: review.profilePhotoUrl || null,
    })),
  };
}

/**
 * Backend üzerinden akan (proxy) bir fotoğrafın gösterilebilir URL'sini üretir.
 * Google anahtarı bu URL'de hiç görünmez.
 */
export function getPhotoUrl(photoReference, maxWidth = 800) {
  assertBaseUrl();
  const params = new URLSearchParams({
    photoReference,
    maxWidth: String(maxWidth),
  });
  return `${API_BASE_URL}/api/photo?${params.toString()}`;
}

function normalizePlace(place) {
  return {
    id: place.id,
    name: place.name,
    rating: place.rating ?? 0,
    reviewCount: place.reviewCount ?? 0,
    address: place.address,
    isOpenNow: place.isOpenNow ?? null,
    priceLevel: place.priceLevel ?? null,
    location: {
      latitude: place.location?.latitude,
      longitude: place.location?.longitude,
    },
    photoReference: place.photoReference ?? null,
    types: place.types || [],
    categoryKeyword: place._categoryKeyword || null,
  };
}
