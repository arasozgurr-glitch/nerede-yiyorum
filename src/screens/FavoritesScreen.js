import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { getFavorites, removeFavorite } from "../services/favoritesService";
import RestaurantCard from "../components/RestaurantCard";
import { useTheme } from "../theme/ThemeContext";

export default function FavoritesScreen({ onSelectRestaurant, onBack }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [favorites, setFavorites] = useState([]);

  const load = useCallback(() => {
    getFavorites().then(setFavorites);
  }, []);

  // Bu ekran her açıldığında (App.js tarafından yeniden mount edilir) listeyi tazeler.
  useEffect(() => { load(); }, [load]);

  const handleRemove = async (id) => {
    const updated = await removeFavorite(id);
    setFavorites(updated);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><Text style={styles.backText}>‹ Geri</Text></TouchableOpacity>
        <Text style={styles.title}>Favorilerim</Text>
        <View style={{ width: 40 }} />
      </View>

      {favorites.length === 0 ? (
        <Text style={styles.empty}>Henüz favori eklemediniz. Bir restoranı açıp kalp ikonuna dokunun.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <View>
              <RestaurantCard
                restaurant={item}
                rank={index + 1}
                distance={null}
                onPress={() => onSelectRestaurant(item)}
              />
              <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id)}>
                <Text style={styles.removeBtnText}>Favorilerden çıkar</Text>
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      )}
    </SafeAreaView>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8,
    },
    backText: { fontSize: 15, color: colors.accent, fontWeight: "600", width: 60 },
    title: { fontSize: 17, fontWeight: "700", color: colors.ink },
    empty: { textAlign: "center", color: colors.inkSoft, marginTop: 40, paddingHorizontal: 32, fontSize: 14 },
    list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
    removeBtn: { alignSelf: "flex-end", marginTop: 6, marginRight: 4 },
    removeBtnText: { fontSize: 12, color: colors.accent, fontWeight: "600" },
  });
}
