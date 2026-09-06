import * as Location from "expo-location";

/**
 * Kullanıcıdan konum izni ister ve mevcut konumu döner.
 * İzin verilmezse veya konum alınamazsa hata fırlatır; ekranda buna göre mesaj gösterilmeli.
 */
export async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Konum izni verilmedi");
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}
