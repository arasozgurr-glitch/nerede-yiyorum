import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import { fetchPlaceDetails, getPhotoUrl } from "../services/placesService";
import BrandMark from "../../assets/brand-symbol.png";
import MenuTab from "../components/MenuTab";
import { useTheme } from "../theme/ThemeContext";
import { isFavorite, toggleFavorite } from "../services/favoritesService";
import { recordRestaurantView, recordFavoriteSignal } from "../services/personalizationService";

function openDirections(restaurant) {
  const { latitude, longitude } = restaurant.location || {};
  if (latitude == null || longitude == null) return;
  const label = encodeURIComponent(restaurant.name);
  const url = Platform.select({
    ios: `maps://app?daddr=${latitude},${longitude}&q=${label}`,
    android: `google.navigation:q=${latitude},${longitude}`,
    default: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
  });
  Linking.canOpenURL(url).then((supported) => {
    if (supported) Linking.openURL(url);
    else Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);
  });
}

export default function DetailScreen({ restaurant, onBack }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [fav, setFav] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setActiveTab("info");
    recordRestaurantView(restaurant).catch(() => {});
    fetchPlaceDetails(restaurant.id)
      .then((d) => { if (!cancelled) setDetails(d); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    isFavorite(restaurant.id).then((v) => { if (!cancelled) setFav(v); });
    return () => { cancelled = true; };
  }, [restaurant.id]);

  const handleToggleFavorite = async () => {
    const updated = await toggleFavorite(restaurant);
    const nextFav = updated.some((r) => r.id === restaurant.id);
    setFav(nextFav);
    recordFavoriteSignal(restaurant, nextFav).catch(() => {});
  };

  const reviewStats = useMemo(() => {
    const reviews = details?.reviews || [];
    if (!reviews.length) return null;
    const average = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length;
    const positive = reviews.filter((r) => r.rating >= 4).length;
    return { average, positivePct: Math.round((positive / reviews.length) * 100), count: reviews.length };
  }, [details]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Geri</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteBtn}>
            <Text style={styles.heart}>{fav ? "♥" : "♡"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.brandRow}>
          <Image source={BrandMark} style={styles.brandMark} />
          <View>
            <Text style={styles.brandName}>Nerede Yiyorum</Text>
            <Text style={styles.brandTagline}>İyi yemek, doğru yerde.</Text>
          </View>
        </View>

        <View style={styles.heroHeader}>
          <View style={styles.heroCopy}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <Text style={styles.address}>{details?.address || restaurant.address || "Adres bilgisi yükleniyor"}</Text>
            <View style={styles.metaRow}>
              <View style={styles.ratingPill}><Text style={styles.rating}>★ {Number(restaurant.rating || details?.rating || 0).toFixed(1)}</Text></View>
              <Text style={styles.reviews}>{Number(details?.reviewCount ?? restaurant.reviewCount ?? 0).toLocaleString("tr-TR")} Google yorumu</Text>
              {details?.isOpenNow != null && <View style={[styles.openPill, !details.isOpenNow && styles.closedPill]}><Text style={styles.openText}>{details.isOpenNow ? "Açık" : "Kapalı"}</Text></View>}
            </View>
          </View>
        </View>

        <View style={styles.primaryActions}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => openDirections(restaurant)}>
            <Text style={styles.primaryBtnText}>🧭 Yol Tarifi</Text>
          </TouchableOpacity>
          {details?.googleUrl && (
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => Linking.openURL(details.googleUrl)}>
              <Text style={styles.secondaryBtnText}>G Google'da Aç</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && <ActivityIndicator style={{ marginTop: 22 }} color={colors.accent} />}
        {error && <Text style={styles.error}>Restoran ayrıntıları yüklenemedi: {error}</Text>}

        {!loading && details && (
          <>
            {details.photoReferences?.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery} contentContainerStyle={{ paddingRight: 8 }}>
                {details.photoReferences.map((ref, i) => (
                  <Image key={i} source={{ uri: getPhotoUrl(ref, 800) }} style={styles.galleryPhoto} />
                ))}
              </ScrollView>
            )}

            <View style={styles.tabs}>
              {[["info", "Genel"], ["menu", "Menü"], ["reviews", "Yorumlar"]].map(([id, label]) => (
                <TouchableOpacity key={id} style={[styles.tab, activeTab === id && styles.tabActive]} onPress={() => setActiveTab(id)}>
                  <Text style={[styles.tabText, activeTab === id && styles.tabTextActive]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {activeTab === "info" && (
              <View>
                {reviewStats && (
                  <View style={styles.insightCard}>
                    <View style={styles.insightTop}><Text style={styles.cardTitle}>Puan özeti</Text><Text style={styles.insightScore}>{Number(details.rating || 0).toFixed(1)} / 5</Text></View>
                    <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.max(5, Math.min(100, reviewStats.positivePct))}%` }]} /></View>
                    <Text style={styles.insightText}>Gösterilen son {reviewStats.count} Google yorumunun %{reviewStats.positivePct}'i 4 veya 5 yıldız.</Text>
                  </View>
                )}
                <InfoRow icon="📍" label="Adres" value={details.address || restaurant.address} />
                {details.phone && <InfoRow icon="📞" label="Telefon" value={details.phone} onPress={() => Linking.openURL(`tel:${details.phone}`)} />}
                <View style={styles.infoCard}><Text style={styles.cardTitle}>🕒 Çalışma saatleri</Text>{details.weekdayText?.map((line, i) => <Text key={i} style={styles.hoursLine}>{line}</Text>)}</View>
                {details.website && <InfoRow icon="🌐" label="Web sitesi" value={details.website} link onPress={() => Linking.openURL(details.website)} />}
                <View style={styles.sourceNote}><Text style={styles.sourceText}>İşletme bilgileri ve puanlar Google Maps verilerinden alınmaktadır.</Text></View>
              </View>
            )}

            {activeTab === "menu" && <MenuTab restaurantName={restaurant.name} website={details.website} />}

            {activeTab === "reviews" && (
              <View>
                <View style={styles.reviewSummary}>
                  <Text style={styles.bigRating}>{Number(details.rating || 0).toFixed(1)}</Text>
                  <Text style={styles.stars}>★★★★★</Text>
                  <Text style={styles.reviewCount}>{Number(details.reviewCount || 0).toLocaleString("tr-TR")} Google yorumu</Text>
                </View>
                {(details.reviews || []).map((review, i) => (
                  <View key={i} style={styles.reviewCard}>
                    <View style={styles.reviewTop}><Text style={styles.author}>{review.authorName}</Text><Text style={styles.reviewTime}>{review.relativeTime}</Text></View>
                    <Text style={styles.reviewStars}>{"★".repeat(Math.max(0, Math.min(5, Number(review.rating || 0))))}</Text>
                    {!!review.text && <Text style={styles.reviewText}>{review.text}</Text>}
                  </View>
                ))}
                <Text style={styles.attribution}>Yorumlar Google kullanıcıları tarafından yazılmıştır.</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value, link, onPress }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return <TouchableOpacity disabled={!onPress} onPress={onPress} style={styles.infoCard}><Text style={styles.cardTitle}>{icon} {label}</Text><Text style={[styles.infoValue, link && { color: colors.accent }]} numberOfLines={2}>{value}</Text></TouchableOpacity>;
}

function getStyles(colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    scrollContent: { paddingBottom: 40 },
    topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
    backBtn: { minWidth: 60, paddingVertical: 8 }, backText: { fontSize: 15, color: colors.accent, fontWeight: "700" },
    favoriteBtn: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
    heart: { fontSize: 22, color: colors.accent },
    brandRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginBottom: 12 },
    brandMark: { width: 32, height: 32, borderRadius: 9, marginRight: 9 }, brandName: { fontSize: 13, fontWeight: "900", color: colors.ink }, brandTagline: { fontSize: 10, color: colors.inkSoft, marginTop: 1 },
    heroHeader: { paddingHorizontal: 20 }, heroCopy: { paddingBottom: 10 }, name: { fontSize: 27, lineHeight: 32, fontWeight: "850", color: colors.ink }, address: { fontSize: 13, lineHeight: 18, color: colors.inkSoft, marginTop: 5 },
    metaRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 7, marginTop: 10 }, ratingPill: { backgroundColor: colors.goldBg, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 5 }, rating: { color: colors.gold, fontWeight: "900", fontSize: 12 }, reviews: { color: colors.inkSoft, fontSize: 11 }, openPill: { backgroundColor: colors.badgeOpenBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }, closedPill: { backgroundColor: colors.badgeClosedBg }, openText: { color: colors.ink, fontSize: 10, fontWeight: "800" },
    primaryActions: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginTop: 4 }, primaryBtn: { flex: 1, backgroundColor: colors.ink, borderRadius: 12, paddingVertical: 13, alignItems: "center" }, primaryBtnText: { color: colors.bg, fontSize: 13, fontWeight: "850" }, secondaryBtn: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingVertical: 13, alignItems: "center" }, secondaryBtnText: { color: colors.ink, fontSize: 13, fontWeight: "850" },
    gallery: { marginTop: 16, paddingLeft: 20 }, galleryPhoto: { width: 245, height: 165, borderRadius: 16, marginRight: 9, backgroundColor: colors.chipBg },
    tabs: { flexDirection: "row", marginHorizontal: 20, marginTop: 16, marginBottom: 10, backgroundColor: colors.chipBg, borderRadius: 12, padding: 4, gap: 4 }, tab: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: "center" }, tabActive: { backgroundColor: colors.ink }, tabText: { fontSize: 12, fontWeight: "800", color: colors.inkSoft }, tabTextActive: { color: colors.bg },
    insightCard: { marginHorizontal: 20, marginBottom: 10, padding: 14, borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line }, insightTop: { flexDirection: "row", justifyContent: "space-between" }, cardTitle: { fontSize: 12, fontWeight: "850", color: colors.ink }, insightScore: { fontSize: 13, fontWeight: "900", color: colors.gold }, progressTrack: { height: 7, backgroundColor: colors.chipBg, borderRadius: 5, overflow: "hidden", marginTop: 10 }, progressFill: { height: "100%", backgroundColor: colors.accent, borderRadius: 5 }, insightText: { fontSize: 10, lineHeight: 15, color: colors.inkSoft, marginTop: 7 },
    infoCard: { marginHorizontal: 20, marginBottom: 9, padding: 14, borderRadius: 15, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line }, infoValue: { fontSize: 13, lineHeight: 19, color: colors.ink, marginTop: 6 }, hoursLine: { fontSize: 11, color: colors.ink, marginTop: 5 },
    sourceNote: { marginHorizontal: 20, padding: 10, borderRadius: 12, backgroundColor: colors.chipBg }, sourceText: { fontSize: 9, color: colors.inkSoft, lineHeight: 13 },
    reviewSummary: { marginHorizontal: 20, marginBottom: 10, padding: 16, alignItems: "center", borderRadius: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line }, bigRating: { fontSize: 34, fontWeight: "900", color: colors.ink }, stars: { color: colors.gold, letterSpacing: 2, marginTop: 2 }, reviewCount: { fontSize: 10, color: colors.inkSoft, marginTop: 4 },
    reviewCard: { marginHorizontal: 20, marginBottom: 8, padding: 13, borderRadius: 15, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line }, reviewTop: { flexDirection: "row", justifyContent: "space-between", gap: 8 }, author: { fontSize: 11, fontWeight: "850", color: colors.ink }, reviewTime: { fontSize: 9, color: colors.inkSoft }, reviewStars: { color: colors.gold, fontSize: 10, marginTop: 4 }, reviewText: { fontSize: 11, lineHeight: 17, color: colors.inkSoft, marginTop: 6 }, attribution: { marginHorizontal: 20, fontSize: 9, color: colors.inkSoft, textAlign: "center", marginTop: 5 },
    error: { color: colors.accentDark, marginTop: 16, fontSize: 12, paddingHorizontal: 20 },
  });
}
