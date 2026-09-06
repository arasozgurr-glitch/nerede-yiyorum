import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { CATEGORIES } from "../constants/categories";
import { useTheme } from "../theme/ThemeContext";

export default function CategoryFilter({ activeCategoryId, onSelect }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat.id === activeCategoryId;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(cat)}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: { paddingHorizontal: 16, gap: 8 },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.line,
      backgroundColor: colors.card,
      marginRight: 8,
    },
    chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
    chipText: { fontSize: 13, fontWeight: "600", color: colors.inkSoft },
    chipTextActive: { color: colors.bg },
  });
}
