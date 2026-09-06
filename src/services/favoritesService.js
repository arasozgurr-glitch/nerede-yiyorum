import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "nyy_favorites";

// Favoriler tamamen cihazda saklanır — hesap sistemi yoktur, hiçbir sunucuya
// gönderilmez. Her favori, listeyi yeniden çekmeden gösterebilmek için
// restoranın temel bilgilerini (isim, adres, puan, konum) de saklar.

export async function getFavorites() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function isFavorite(placeId) {
  const list = await getFavorites();
  return list.some((r) => r.id === placeId);
}

export async function addFavorite(restaurant) {
  const list = await getFavorites();
  if (list.some((r) => r.id === restaurant.id)) return list;
  const updated = [...list, restaurant];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeFavorite(placeId) {
  const list = await getFavorites();
  const updated = list.filter((r) => r.id !== placeId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function toggleFavorite(restaurant) {
  const fav = await isFavorite(restaurant.id);
  return fav ? removeFavorite(restaurant.id) : addFavorite(restaurant);
}
