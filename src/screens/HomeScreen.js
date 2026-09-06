import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";

import CategoryFilter from "../components/CategoryFilter";
import FilterBar from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import RestaurantCard from "../components/RestaurantCard";
import RestaurantMap from "../components/RestaurantMap";
import { getCurrentLocation } from "../services/locationService";
import { fetchNearbyRestaurants } from "../services/placesService";
import { sortByWeightedScore, distanceKm, attachWeightedScores, recommendationReason } from "../utils/ranking";
import { getUserPreferences, getSignals, recordCategorySignal, recordSearchSignal, personalizeRestaurants } from "../services/personalizationService";
import { CATEGORIES } from "../constants/categories";
import { useTheme } from "../theme/ThemeContext";
import { buildDecisionPicks } from "../services/decisionService";
// kullanılmıyor (bkz. README — "Her Zaman İzin Ver" konum izni App Store
// incelemesinde risk oluşturabileceği için ilk sürümde devre dışı bırakıldı).

export default function HomeScreen({ onSelectRestaurant, onOpenFavorites, onOpenSettings }) {
  const { colors, mode, setThemeMode } = useTheme();
  const styles = getStyles(colors);

  const [location, setLocation] = useState(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [query, setQuery] = useState("");
  const [radiusMeters, setRadiusMeters] = useState(3000);
  const [openNow, setOpenNow] = useState(false);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sortMode, setSortMode] = useState("score");
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"
  const [preferences, setPreferences] = useState(null);
  const [signals, setSignals] = useState(null);
  const [decisionOpen, setDecisionOpen] = useState(false);

  useEffect(() => {
    Promise.all([getUserPreferences(), getSignals()]).then(([p, s]) => {
      setPreferences(p);
      setSignals(s);
    });
  }, []);

  const loadRestaurants = useCallback(
    async (loc, category, opts) => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const results = await fetchNearbyRestaurants(loc, {
          keyword: category.keyword,
          radiusMeters: opts.radiusMeters,
          openNow: category.forceOpenNow || opts.openNow,
          maxPrice: opts.maxPrice ?? undefined,
        });
        setRestaurants(results);
      } catch (err) {
        setErrorMessage(err.message);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refetch = useCallback(
    (overrides = {}) => {
      if (!location) return;
      loadRestaurants(location, overrides.category ?? activeCategory, {
        radiusMeters: overrides.radiusMeters ?? radiusMeters,
        openNow: overrides.openNow ?? openNow,
        maxPrice: "maxPrice" in overrides ? overrides.maxPrice : maxPrice,
      });
    },
    [location, activeCategory, radiusMeters, openNow, maxPrice, loadRestaurants]
  );

  const handleFindLocation = useCallback(async () => {
    setErrorMessage(null);
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      loadRestaurants(loc, activeCategory, { radiusMeters, openNow, maxPrice });
    } catch (err) {
      setErrorMessage(err.message);
    }
  }, [activeCategory, radiusMeters, openNow, maxPrice, loadRestaurants]);

  const handleCategorySelect = useCallback(
    (category) => {
      setActiveCategory(category);
      recordCategorySignal(category.id).then(() => getSignals().then(setSignals)).catch(() => {});
      if (category.forceOpenNow) setOpenNow(true);
      refetch({ category, openNow: category.forceOpenNow ? true : undefined });
    },
    [refetch]
  );

  // Not: yakınlık bildirimleri işlevi v1'de devre dışı (bkz. yukarıdaki not).

  // Arama kutusu, mesafe/fiyat sıralaması istemci tarafında uygulanır
  // (bunlar için Google'a yeniden istek atmaya gerek yok).
  const visibleRestaurants = useMemo(() => {
    let list = restaurants;

    if (query.trim()) {
      const q = query.trim().toLocaleLowerCase("tr");
      list = list.filter((r) => r.name.toLocaleLowerCase("tr").includes(q));
    }

    const weighted = attachWeightedScores(list);
    if (sortMode === "distance" && location) {
      return [...weighted].sort((a, b) => distanceKm(location, a.location) - distanceKm(location, b.location));
    }
    if (sortMode === "price") {
      return [...weighted].sort((a, b) => (a.priceLevel ?? 99) - (b.priceLevel ?? 99));
    }
    if (preferences && signals) {
      const ranked = personalizeRestaurants(weighted, {
        preferences,
        signals,
        getDistance: (r) => location ? distanceKm(location, r.location) : null,
      });
      return ranked.map((r) => ({
        ...r,
        _recommendationReason: recommendationReason(r, { preferences, signals, distance: location ? distanceKm(location, r.location) : null }),
      }));
    }
    return sortByWeightedScore(weighted).map((r) => ({
      ...r,
      _recommendationReason: recommendationReason(r, { preferences, signals, distance: location ? distanceKm(location, r.location) : null }),
    }));
  }, [restaurants, query, sortMode, location, preferences, signals]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const timer = setTimeout(() => recordSearchSignal(query).then(() => getSignals().then(setSignals)).catch(() => {}), 700);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const decisionPicks = useMemo(() => buildDecisionPicks(visibleRestaurants, {
    preferences,
    signals,
    getDistance: (r) => (location ? distanceKm(location, r.location) : null),
  }), [visibleRestaurants, preferences, signals, location]);

  const handleFeelingLucky = useCallback(() => {
    if (decisionPicks.length === 0) return;
    setDecisionOpen(true);
  }, [decisionPicks]);

  const selectDecision = useCallback((pick) => {
    setDecisionOpen(false);
    import("../services/personalizationService").then(({ recordRestaurantView }) => recordRestaurantView(pick.r));
    onSelectRestaurant(pick.r);
  }, [onSelectRestaurant]);

  const cycleTheme = () => {
    const next = mode === "system" ? "light" : mode === "light" ? "dark" : "system";
    setThemeMode(next);
  };
  const themeLabel = mode === "system" ? "☀️/🌙 Sistem" : mode === "light" ? "☀️ Açık" : "🌙 Koyu";

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.brandBlock}>
          <Image source={require("../../assets/brand-symbol.png")} style={styles.brandLogo} resizeMode="contain" />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Nerede Yiyorum</Text>
            <Text style={styles.subtitle}>İyi yemek, doğru yerde.</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onOpenFavorites} style={styles.iconBtn}>
          <Text style={styles.iconBtnText}>❤️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.utilityRow}>
        <TouchableOpacity style={styles.utilityChip} onPress={cycleTheme}>
          <Text style={styles.utilityChipText}>{themeLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.utilityChip} onPress={onOpenSettings}>
          <Text style={styles.utilityChipText}>⚙️ Ayarlar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.locBar}>
        <Text style={styles.locText} numberOfLines={1}>
          {location ? "Konum bulundu" : errorMessage || "Konum henüz alınmadı"}
        </Text>
        <TouchableOpacity style={styles.locButton} onPress={handleFindLocation}>
          <Text style={styles.locButtonText}>Konumumu bul</Text>
        </TouchableOpacity>
      </View>

      {location && (
        <>
          <SearchBar value={query} onChangeText={setQuery} onSubmit={() => {}} />

          <View style={styles.filterWrap}>
            <CategoryFilter activeCategoryId={activeCategory.id} onSelect={handleCategorySelect} />
          </View>

          <FilterBar
            radiusMeters={radiusMeters}
            onRadiusChange={(m) => { setRadiusMeters(m); refetch({ radiusMeters: m }); }}
            openNow={openNow}
            onToggleOpenNow={(v) => { setOpenNow(v); refetch({ openNow: v }); }}
            maxPrice={maxPrice}
            onMaxPriceChange={(v) => { setMaxPrice(v); refetch({ maxPrice: v }); }}
            sortMode={sortMode}
            onSortModeChange={setSortMode}
          />

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.luckyBtn} onPress={handleFeelingLucky}>
              <Text style={styles.luckyBtnText}>🎲 Bugün Ne Yiyorum?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewToggle, viewMode === "list" && styles.viewToggleActive]}
              onPress={() => setViewMode(viewMode === "list" ? "map" : "list")}
            >
              <Text style={[styles.viewToggleText, viewMode === "list" && styles.viewToggleTextActive]}>
                {viewMode === "list" ? "🗺️ Harita" : "📋 Liste"}
              </Text>
            </TouchableOpacity>
          </View>
          {preferences && (preferences.cuisine?.length || preferences.budget || preferences.distance) ? (
            <View style={styles.personalizedBanner}>
              <Text style={styles.personalizedTitle}>✦ Sana özel sıralama</Text>
              <Text style={styles.personalizedText}>Tercihlerin, mesafe ve restoran güvenilirliğini birlikte değerlendiriyoruz.</Text>
            </View>
          ) : null}
        </>
      )}

      {loading && <ActivityIndicator style={{ marginTop: 24 }} color={colors.accent} />}

      {!loading && location && visibleRestaurants.length === 0 && !errorMessage && (
        <Text style={styles.empty}>Bu filtrelerle sonuç bulunamadı</Text>
      )}

      {!loading && errorMessage && location && (
        <Text style={styles.empty}>{errorMessage}</Text>
      )}

      {viewMode === "map" ? (
        <RestaurantMap
          userLocation={location}
          restaurants={visibleRestaurants}
          onSelect={onSelectRestaurant}
        />
      ) : (
        <FlatList
          data={visibleRestaurants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <RestaurantCard
              restaurant={item}
              rank={index + 1}
              distance={location ? distanceKm(location, item.location) : null}
              onPress={() => {
                import("../services/personalizationService").then(({ recordRestaurantView }) => recordRestaurantView(item));
                onSelectRestaurant(item);
              }}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      {decisionOpen && (
        <View style={styles.modalBackdrop}>
          <View style={styles.decisionSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.decisionHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.decisionEyebrow}>BUGÜNÜ SENİN İÇİN SEÇTİK</Text>
                <Text style={styles.decisionTitle}>Bugün ne yiyelim?</Text>
                <Text style={styles.decisionSubtitle}>Kararı rastgele vermiyoruz. Tercihlerini, mesafeyi, bütçeyi ve restoran güvenilirliğini birlikte değerlendiriyoruz.</Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setDecisionOpen(false)}><Text style={{fontSize:22,color:colors.ink}}>×</Text></TouchableOpacity>
            </View>
            {decisionPicks.map((pick, index) => (
              <TouchableOpacity key={pick.r.id} style={styles.decisionCard} onPress={() => selectDecision(pick)} activeOpacity={0.85}>
                <View style={styles.decisionRank}><Text style={styles.decisionRankText}>{index + 1}</Text></View>
                <View style={styles.decisionMain}>
                  <View style={styles.decisionTop}><Text style={styles.decisionType}>{pick.icon} {pick.type}</Text><Text style={styles.decisionScore}>{Math.round(pick[keyForPick(pick)] * 100)}/100</Text></View>
                  <Text style={styles.decisionName} numberOfLines={1}>{pick.r.name}</Text>
                  <Text style={styles.decisionMeta}>{pick.r.rating ? `⭐ ${Number(pick.r.rating).toFixed(1)}` : 'Puan yok'} · {pick.km != null ? `${pick.km.toFixed(1)} km` : 'mesafe yok'} · {priceLabel(pick.r.priceLevel)}</Text>
                  <Text style={styles.decisionReason}>{pick.reason(pick)}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.decisionFootnote}>Seçimini yaptığında bu tercih, önerilerini zamanla daha iyi hale getirmemize yardımcı olur.</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function keyForPick(pick) { return pick.type === "Sana en uygun" ? "personal" : pick.type === "Yeni bir şey dene" ? "novelty" : "value"; }
function priceLabel(level) { return level ? "₺".repeat(Math.max(1, Math.min(4, Number(level)))) : "Fiyat bilgisi yok"; }

function getStyles(colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6 },
    brandBlock: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
    brandLogo: { width: 46, height: 46, borderRadius: 13 },
    title: { fontSize: 21, fontWeight: "800", color: colors.ink, letterSpacing: -0.4 },
    subtitle: { fontSize: 12, color: colors.inkSoft, marginTop: 2 },
    iconBtn: { padding: 4 },
    iconBtnText: { fontSize: 22 },
    utilityRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginTop: 10 },
    utilityChip: {
      paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16,
      backgroundColor: colors.chipBg,
    },
    utilityChipText: { fontSize: 12, fontWeight: "600", color: colors.inkSoft },
    locBar: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 20,
      marginTop: 12,
      padding: 12,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 12,
      gap: 10,
    },
    locText: { flex: 1, fontSize: 13, color: colors.inkSoft },
    locButton: {
      backgroundColor: colors.accent,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 8,
    },
    locButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
    filterWrap: { marginTop: 14 },
    actionRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginTop: 12 },
    luckyBtn: {
      flex: 1, backgroundColor: colors.accent, paddingVertical: 10, borderRadius: 10, alignItems: "center",
    },
    luckyBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
    viewToggle: {
      paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, alignItems: "center",
      borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card,
    },
    viewToggleActive: { backgroundColor: colors.card },
    viewToggleText: { fontSize: 13, fontWeight: "600", color: colors.inkSoft },
    viewToggleTextActive: { color: colors.ink },
    modalBackdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(25,20,16,0.48)", justifyContent: "flex-end" },
    decisionSheet: { backgroundColor: colors.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 18, paddingTop: 9, paddingBottom: 18, maxHeight: "88%" },
    sheetHandle: { width: 42, height: 4, borderRadius: 4, backgroundColor: colors.line, alignSelf: "center", marginBottom: 15 },
    decisionHeader: { flexDirection: "row", alignItems: "flex-start", marginBottom: 14 },
    decisionEyebrow: { color: colors.accent, fontSize: 9, fontWeight: "900", letterSpacing: 1.1 },
    decisionTitle: { color: colors.ink, fontSize: 24, fontWeight: "900", marginTop: 4, letterSpacing: -0.6 },
    decisionSubtitle: { color: colors.inkSoft, fontSize: 11, lineHeight: 16, marginTop: 5, paddingRight: 6 },
    closeBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.card, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line },
    decisionCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 17, padding: 11, marginBottom: 9 },
    decisionRank: { width: 31, height: 31, borderRadius: 10, backgroundColor: colors.chipBg, alignItems: "center", justifyContent: "center", marginRight: 10 },
    decisionRankText: { color: colors.ink, fontSize: 12, fontWeight: "900" },
    decisionMain: { flex: 1, minWidth: 0 },
    decisionTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    decisionType: { color: colors.accent, fontSize: 10, fontWeight: "900" },
    decisionScore: { color: colors.inkSoft, fontSize: 9, fontWeight: "800" },
    decisionName: { color: colors.ink, fontSize: 14, fontWeight: "900", marginTop: 3 },
    decisionMeta: { color: colors.inkSoft, fontSize: 9, marginTop: 3 },
    decisionReason: { color: colors.inkSoft, fontSize: 9, lineHeight: 13, marginTop: 5 },
    chevron: { color: colors.accent, fontSize: 25, fontWeight: "300", marginLeft: 8 },
    decisionFootnote: { color: colors.inkSoft, fontSize: 9, lineHeight: 13, textAlign: "center", marginTop: 2, paddingHorizontal: 14 },
    empty: { textAlign: "center", color: colors.inkSoft, marginTop: 24, paddingHorizontal: 20 },
    list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  });
}
