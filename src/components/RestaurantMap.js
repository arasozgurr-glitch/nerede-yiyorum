import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function RestaurantMap({ userLocation, restaurants, onSelect }) {
  if (!userLocation) return null;

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }}
      showsUserLocation
    >
      {restaurants
        .filter((r) => r.location?.latitude && r.location?.longitude)
        .map((r, i) => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.location.latitude, longitude: r.location.longitude }}
            title={r.name}
            description={`★ ${r.rating.toFixed(1)} (${r.reviewCount} yorum)`}
            onCalloutPress={() => onSelect(r)}
          />
        ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", height: 500 },
});
