import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { useTheme } from "../theme/ThemeContext";

const slides = [
  { icon: "📍", title: "Yakınındaki iyi yerleri keşfet", text: "Konumuna, zevklerine ve bütçene göre restoranları tek yerde bul." },
  { icon: "⭐", title: "Sadece puana bakma", text: "Mesafe, fiyat, açıklık durumu ve kişisel tercihlerini birlikte değerlendiriyoruz." },
  { icon: "🧭", title: "Karar vermek kolaylaşsın", text: "Bugün Ne Yiyorum? ile kararsız kaldığında sana uygun bir seçenek seç." },
];

export default function OnboardingScreen({ onComplete, onOpenLegal }) {
  const { colors } = useTheme(); const [index, setIndex] = useState(0); const slide = slides[index]; const isLast = index === slides.length - 1;
  return <SafeAreaView style={[styles.screen,{backgroundColor:colors.bg}]}>
    <View style={styles.skip}><TouchableOpacity onPress={onComplete}><Text style={[styles.skipText,{color:colors.inkSoft}]}>Atla</Text></TouchableOpacity></View>
    <View style={styles.content}>
      <Image source={require("../../assets/brand-symbol.png")} style={styles.logo} resizeMode="contain" />
      <View style={[styles.icon,{backgroundColor:colors.chipBg}]}><Text style={styles.iconText}>{slide.icon}</Text></View>
      <Text style={[styles.title,{color:colors.ink}]}>{slide.title}</Text><Text style={[styles.text,{color:colors.inkSoft}]}>{slide.text}</Text>
      <View style={styles.dots}>{slides.map((_,i)=><View key={i} style={[styles.dot,{backgroundColor:i===index?colors.accent:colors.line}]} />)}</View>
    </View>
    {isLast ? (
      <View style={styles.legalBox}>
        <Text style={[styles.legalText,{color:colors.inkSoft}]}>Hesap oluşturmak zorunda değilsin. Uygulamayı misafir olarak kullanabilirsin.</Text>
        <View style={styles.legalLinks}>
          <TouchableOpacity onPress={()=>onOpenLegal?.("kvkk")}><Text style={[styles.legalLink,{color:colors.accent}]}>KVKK Aydınlatma Metni</Text></TouchableOpacity>
          <Text style={[styles.legalSep,{color:colors.line}]}>•</Text>
          <TouchableOpacity onPress={()=>onOpenLegal?.("privacy")}><Text style={[styles.legalLink,{color:colors.accent}]}>Gizlilik Politikası</Text></TouchableOpacity>
        </View>
      </View>
    ) : null}
    <TouchableOpacity style={[styles.button,{backgroundColor:colors.accent}]} onPress={()=>index<slides.length-1?setIndex(index+1):onComplete()}>
      <Text style={styles.buttonText}>{index<slides.length-1?"Devam et":"Misafir olarak devam et"}</Text>
    </TouchableOpacity>
  </SafeAreaView>;
}
const styles=StyleSheet.create({screen:{flex:1,padding:20},skip:{alignItems:"flex-end"},skipText:{fontSize:13,fontWeight:"700",padding:10},content:{flex:1,alignItems:"center",justifyContent:"center",paddingBottom:30},logo:{width:170,height:90,marginBottom:20},icon:{width:86,height:86,borderRadius:28,alignItems:"center",justifyContent:"center",marginBottom:22},iconText:{fontSize:38},title:{fontSize:27,fontWeight:"850",textAlign:"center",letterSpacing:-.5},text:{fontSize:14,lineHeight:22,textAlign:"center",marginTop:12,maxWidth:320},dots:{flexDirection:"row",gap:7,marginTop:28},dot:{width:8,height:8,borderRadius:4},legalBox:{width:"100%",alignItems:"center",marginBottom:14},legalText:{fontSize:11,lineHeight:17,textAlign:"center",maxWidth:320},legalLinks:{flexDirection:"row",gap:7,marginTop:7,alignItems:"center"},legalLink:{fontSize:10,fontWeight:"800"},legalSep:{fontSize:10},button:{height:52,borderRadius:16,alignItems:"center",justifyContent:"center",marginBottom:8},buttonText:{color:"#fff",fontSize:15,fontWeight:"850"}});
