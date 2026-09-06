import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { isFavorite, toggleFavorite, getFavorites } from "../services/favoritesService";
import { recordFavoriteSignal, recordRestaurantFeedback } from "../services/personalizationService";
import { getPhotoUrl } from "../services/placesService";

export default function RestaurantCard({ restaurant, rank, distance, onPress }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [fav, setFav] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let cancelled = false;
    isFavorite(restaurant.id).then((v) => { if (!cancelled) setFav(v); });
    return () => { cancelled = true; };
  }, [restaurant.id]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation?.();
    const updated = await toggleFavorite(restaurant);
    const nextFav = updated.some((r) => r.id === restaurant.id);
    setFav(nextFav);
    recordFavoriteSignal(restaurant, nextFav).catch(() => {});
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.thumb}>
        {restaurant.photoReference ? (
          <Image source={{ uri: getPhotoUrl(restaurant.photoReference, 240) }} style={styles.thumbImage} />
        ) : (
          <Text style={styles.thumbText}>🍽️</Text>
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.topRightGroup}>
            <TouchableOpacity onPress={handleToggleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.heart}>{fav ? "❤️" : "🤍"}</Text>
            </TouchableOpacity>
            <Text style={styles.rank}>#{rank}</Text>
          </View>
        </View>

        <Text style={styles.address} numberOfLines={1}>
          {restaurant.address}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.rating}>★ {restaurant.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({restaurant.reviewCount} yorum)</Text>
          {restaurant.isOpenNow != null && (
            <Text style={restaurant.isOpenNow ? styles.openTag : styles.closedTag}>
              {restaurant.isOpenNow ? "Açık" : "Kapalı"}
            </Text>
          )}
          {distance != null && (
            <Text style={styles.distance}>{distance.toFixed(1)} km</Text>
          )}
        </View>
        {restaurant._recommendationReason ? (
          <Text style={styles.reason} numberOfLines={2}>✦ {restaurant._recommendationReason}</Text>
        ) : null}
        <View style={styles.feedbackRow}>
          <Text style={styles.feedbackLabel}>Sana uygun mu?</Text>
          <TouchableOpacity onPress={(e) => { e.stopPropagation?.(); setFeedback("like"); recordRestaurantFeedback(restaurant, "like").catch(() => {}); }} style={[styles.feedbackBtn, feedback === "like" && styles.feedbackActive]}><Text>👍</Text></TouchableOpacity>
          <TouchableOpacity onPress={(e) => { e.stopPropagation?.(); setFeedback("dislike"); recordRestaurantFeedback(restaurant, "dislike").catch(() => {}); }} style={[styles.feedbackBtn, feedback === "dislike" && styles.feedbackActive]}><Text>👎</Text></TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      gap: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 14,
      padding: 14,
    },
    thumb: {
      width: 56,
      height: 56,
      borderRadius: 10,
      backgroundColor: colors.chipBg,
      alignItems: "center",
      justifyContent: "center",
    },
    thumbText: { fontSize: 22 },
    thumbImage: { width: "100%", height: "100%", borderRadius: 10 },
    info: { flex: 1 },
    topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
    topRightGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
    heart: { fontSize: 16 },
    name: { fontSize: 15, fontWeight: "700", color: colors.ink, flexShrink: 1 },
    rank: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.gold,
      backgroundColor: colors.goldBg,
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 6,
    },
    address: { fontSize: 12, color: colors.inkSoft, marginTop: 2, marginBottom: 6 },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
    rating: { fontSize: 12, fontWeight: "700", color: colors.ink },
    reviews: { fontSize: 12, color: colors.inkSoft },
    openTag: { fontSize: 11, fontWeight: "700", color: "#3C7A4B" },
    closedTag: { fontSize: 11, fontWeight: "700", color: "#8F2E1B" },
    distance: { fontSize: 12, color: colors.inkSoft, marginLeft: "auto" },
    reason: { fontSize: 10, lineHeight: 14, color: colors.accent, marginTop: 7, fontWeight: "700" },
    feedbackRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 7 },
    feedbackLabel: { fontSize: 9, color: colors.inkSoft, marginRight: 2 },
    feedbackBtn: { width: 28, height: 26, borderRadius: 8, backgroundColor: colors.chipBg, alignItems: "center", justifyContent: "center" },
    feedbackActive: { borderWidth: 1, borderColor: colors.accent },
  });
}
