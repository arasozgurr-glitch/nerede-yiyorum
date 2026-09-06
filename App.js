import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import PreferencesScreen from "./src/screens/PreferencesScreen";
import HomeScreen from "./src/screens/HomeScreen";
import DetailScreen from "./src/screens/DetailScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import LegalScreen from "./src/screens/LegalScreen";

// Not: AuthScreen.js projede duruyor ama artık akışa dahil değil — şu an
// gerçek bir hesap sistemine (backend'de kullanıcı doğrulama) bağlı değildi,
// bu da kullanıcıyı yanıltabilirdi. İleride gerçek bir auth sistemi
// kurduğunuzda (örn. Firebase Auth) bu ekranı buraya geri ekleyebilirsiniz.

function Root(){
 const {resolvedScheme}=useTheme(); const [stage,setStage]=useState("loading"); const [route,setRoute]=useState("home"); const [selectedRestaurant,setSelectedRestaurant]=useState(null); const [legalType,setLegalType]=useState(null);
 useEffect(()=>{AsyncStorage.multiGet(["ny_onboarding","ny_preferences"]).then(v=>{const m=Object.fromEntries(v); if(m.ny_onboarding!=="done") setStage("onboarding"); else if(m.ny_preferences!=="done") setStage("preferences"); else setStage("app");}).catch(()=>setStage("onboarding"));},[]);
 const finishOnboarding=async()=>{await AsyncStorage.setItem("ny_onboarding","done");setStage("preferences")};
 const finishPreferences=async(prefs)=>{await AsyncStorage.setItem("ny_preferences","done");await AsyncStorage.setItem("ny_preferences_data",JSON.stringify(prefs));setStage("app")};
 if(stage==="loading") return null; if(stage==="onboarding") return <><StatusBar style="dark"/><OnboardingScreen onComplete={finishOnboarding} onOpenLegal={(type)=>{setLegalType(type);setStage("preLegal")}}/></>; if(stage==="preLegal") return <><StatusBar style={resolvedScheme==="dark"?"light":"dark"}/><LegalScreen type={legalType} onBack={()=>{setLegalType(null);setStage("onboarding")}}/></>; if(stage==="preferences") return <><StatusBar style={resolvedScheme==="dark"?"light":"dark"}/><PreferencesScreen onComplete={finishPreferences}/></>;
 let screen; if(legalType) screen=<LegalScreen type={legalType} onBack={()=>setLegalType(null)}/>; else if(selectedRestaurant) screen=<DetailScreen restaurant={selectedRestaurant} onBack={()=>setSelectedRestaurant(null)}/>; else if(route==="favorites") screen=<FavoritesScreen onSelectRestaurant={setSelectedRestaurant} onBack={()=>setRoute("home")}/>; else if(route==="settings") screen=<SettingsScreen onBack={()=>setRoute("home")} onOpenLegal={setLegalType}/>; else screen=<HomeScreen onSelectRestaurant={setSelectedRestaurant} onOpenFavorites={()=>setRoute("favorites")} onOpenSettings={()=>setRoute("settings")}/>; return <><StatusBar style={resolvedScheme==="dark"?"light":"dark"}/>{screen}</>;
}
export default function App(){return <ThemeProvider><Root/></ThemeProvider>}
