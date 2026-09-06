import React from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function SearchBar({ value, onChangeText, onSubmit }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder="Restoran veya mutfak ara..."
        placeholderTextColor={colors.inkSoft}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Text style={styles.clear}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    wrap: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 12,
      paddingHorizontal: 12,
      marginHorizontal: 20,
      marginTop: 12,
    },
    icon: { fontSize: 14, marginRight: 8 },
    input: { flex: 1, paddingVertical: 10, fontSize: 14, color: colors.ink },
    clear: { fontSize: 14, color: colors.inkSoft, paddingHorizontal: 4 },
  });
}
