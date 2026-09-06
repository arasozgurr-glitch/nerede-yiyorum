import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";

const RADIUS_OPTIONS = [
  { label: "1 km", meters: 1000 },
  { label: "3 km", meters: 3000 },
  { label: "5 km", meters: 5000 },
  { label: "10 km", meters: 10000 },
];

const PRICE_OPTIONS = [
  { label: "Tüm fiyatlar", value: null },
  { label: "₺", value: 1 },
  { label: "₺₺", value: 2 },
  { label: "₺₺₺", value: 3 },
  { label: "₺₺₺₺", value: 4 },
];

const SORT_OPTIONS = [
  { label: "En iyi eşleşme", value: "score" },
  { label: "En yakın", value: "distance" },
  { label: "En ucuz", value: "price" },
];

export default function FilterBar({
  radiusMeters,
  onRadiusChange,
  openNow,
  onToggleOpenNow,
  maxPrice,
  onMaxPriceChange,
  sortMode,
  onSortModeChange,
}) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Chip
        label={openNow ? "✓ Şu an açık" : "Şu an açık"}
        active={openNow}
        onPress={() => onToggleOpenNow(!openNow)}
        colors={colors}
      />

      <Row label="Mesafe" colors={colors}>
        {RADIUS_OPTIONS.map((opt) => (
          <Chip
            key={opt.meters}
            label={opt.label}
            active={radiusMeters === opt.meters}
            onPress={() => onRadiusChange(opt.meters)}
            colors={colors}
          />
        ))}
      </Row>

      <Row label="Fiyat" colors={colors}>
        {PRICE_OPTIONS.map((opt) => (
          <Chip
            key={String(opt.value)}
            label={opt.label}
            active={maxPrice === opt.value}
            onPress={() => onMaxPriceChange(opt.value)}
            colors={colors}
          />
        ))}
      </Row>

      <Row label="Sırala" colors={colors}>
        {SORT_OPTIONS.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            active={sortMode === opt.value}
            onPress={() => onSortModeChange(opt.value)}
            colors={colors}
          />
        ))}
      </Row>
    </View>
  );
}

function Row({ label, children, colors }) {
  const styles = getStyles(colors);
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.rowLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {children}
      </ScrollView>
    </View>
  );
}

function Chip({ label, active, onPress, colors }) {
  const styles = getStyles(colors);
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
    rowLabel: { fontSize: 11, fontWeight: "700", color: colors.inkSoft, marginBottom: 6, textTransform: "uppercase" },
    chip: {
      paddingVertical: 7,
      paddingHorizontal: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.line,
      backgroundColor: colors.card,
      marginRight: 8,
    },
    chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
    chipText: { fontSize: 12, fontWeight: "600", color: colors.inkSoft },
    chipTextActive: { color: colors.bg },
  });
}
