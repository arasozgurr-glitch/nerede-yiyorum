import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function SettingsScreen({ onBack, onOpenLegal }) {
  const { colors, mode, setThemeMode } = useTheme();
  const themeLabel = mode === "system" ? "☀️/🌙 Sistem" : mode === "light" ? "☀️ Açık" : "🌙 Koyu";
  const cycleTheme = () => setThemeMode(mode === "system" ? "light" : mode === "light" ? "dark" : "system");
  const Row = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.row,{backgroundColor:colors.card,borderColor:colors.line}]} activeOpacity={0.8}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={{flex:1}}><Text style={[styles.rowTitle,{color:colors.ink}]}>{title}</Text>{subtitle ? <Text style={[styles.rowSub,{color:colors.inkSoft}]}>{subtitle}</Text> : null}</View>
      <Text style={[styles.chevron,{color:colors.inkSoft}]}>›</Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={[styles.screen,{backgroundColor:colors.bg}]}>
      <View style={[styles.header,{borderBottomColor:colors.line}]}>
        <TouchableOpacity onPress={onBack} style={styles.back}><Text style={[styles.backText,{color:colors.ink}]}>‹</Text></TouchableOpacity>
        <View><Text style={[styles.eyebrow,{color:colors.accent}]}>NERede YİYORUM</Text><Text style={[styles.title,{color:colors.ink}]}>Ayarlar</Text></View>
      </View>
      <View style={styles.content}>
        <Text style={[styles.group,{color:colors.inkSoft}]}>GÖRÜNÜM</Text>
        <Row icon="◐" title="Tema" subtitle={themeLabel} onPress={cycleTheme}/>
        <Text style={[styles.group,{color:colors.inkSoft}]}>GİZLİLİK VE HUKUK</Text>
        <Row icon="🔒" title="KVKK Aydınlatma Metni" onPress={()=>onOpenLegal("kvkk")}/>
        <Row icon="🛡️" title="Gizlilik Politikası" onPress={()=>onOpenLegal("privacy")}/>
        <Row icon="📄" title="Kullanım Koşulları" onPress={()=>onOpenLegal("terms")}/>
        <Text style={[styles.group,{color:colors.inkSoft}]}>İLETİŞİM</Text>
        <View style={[styles.contact,{backgroundColor:colors.card,borderColor:colors.line}]}>
          <Text style={[styles.contactTitle,{color:colors.ink}]}>Veri sorumlusu</Text>
          <Text style={[styles.contactText,{color:colors.inkSoft}]}>Özgür Aras</Text>
          <Text style={[styles.contactText,{color:colors.inkSoft}]}>arasozgurr@gmail.com</Text>
        </View>
        <Text style={[styles.guest,{color:colors.inkSoft}]}>Misafir kullanım modu aktif. Hesap oluşturmanız gerekmez.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
  screen:{flex:1},header:{paddingHorizontal:18,paddingTop:10,paddingBottom:14,borderBottomWidth:1,flexDirection:"row",alignItems:"center",gap:8},back:{width:38,height:38,alignItems:"center",justifyContent:"center"},backText:{fontSize:34,fontWeight:"300"},eyebrow:{fontSize:9,fontWeight:"900",letterSpacing:1.4},title:{fontSize:21,fontWeight:"900",marginTop:2},content:{padding:20},group:{fontSize:9,fontWeight:"900",letterSpacing:1.4,marginTop:8,marginBottom:8},row:{minHeight:62,borderWidth:1,borderRadius:15,paddingHorizontal:14,flexDirection:"row",alignItems:"center",gap:12,marginBottom:9},icon:{fontSize:20,width:28,textAlign:"center"},rowTitle:{fontSize:13,fontWeight:"800"},rowSub:{fontSize:11,marginTop:2},chevron:{fontSize:26,fontWeight:"300"},contact:{borderWidth:1,borderRadius:15,padding:14,marginBottom:16},contactTitle:{fontSize:12,fontWeight:"800",marginBottom:5},contactText:{fontSize:12,lineHeight:19},guest:{fontSize:11,lineHeight:17,textAlign:"center",marginTop:8}}
);
