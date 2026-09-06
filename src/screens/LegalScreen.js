import React from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";

const LEGAL = {
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    eyebrow: "KİŞİSEL VERİLERİN KORUNMASI",
    sections: [
      ["1. Veri Sorumlusu", "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerinizin veri sorumlusu Özgür Aras'tır. İletişim: arasozgurr@gmail.com"],
      ["2. İşlenen Veriler", "Uygulamanın kullanımına bağlı olarak konum bilgisi, uygulama tercihleri, favoriler, arama ve filtreleme tercihleri, restoran etkileşimleri, geri bildirimler ve teknik olarak gerekli cihaz/uygulama bilgileri işlenebilir. Nerede Yiyorum'un temel kullanımı için kullanıcı hesabı oluşturmanız gerekmez."],
      ["3. İşleme Amaçları", "Veriler; yakındaki restoranları göstermek, mesafe hesaplamak, restoran önerilerini kişiselleştirmek, favorileri ve tercihleri yönetmek, uygulamanın güvenli ve düzgün çalışmasını sağlamak, teknik sorunları gidermek ve uygulamayı geliştirmek amacıyla işlenebilir."],
      ["4. Konum Bilgisi", "Yakınınızdaki restoranları gösterebilmek için cihazınızın konumu kullanılabilir. Konum izni işletim sisteminiz üzerinden yönetilir. İzin vermemeniz halinde konuma bağlı bazı özellikler kullanılamayabilir."],
      ["5. Üçüncü Taraf Hizmetler ve Aktarım", "Restoran, harita, konum, fotoğraf ve benzeri özelliklerin sağlanması için Google Places / Google Maps ve uygulamanın teknik altyapısında kullanılan hizmet sağlayıcılardan yararlanılabilir. Kullanılan hizmetlerin kesin kapsamı ve varsa yurt dışı veri aktarımı, hizmetlerin yapılandırmasına ve yürürlükteki mevzuata göre değerlendirilir."],
      ["6. Toplanma Yöntemi ve Hukuki Sebep", "Veriler; uygulama kullanımı, cihazın konum servisleri ve kullanıcı tarafından gerçekleştirilen seçim ve etkileşimler aracılığıyla elektronik ortamda toplanabilir. İşleme faaliyetlerinde KVKK'nın 5. maddesinde düzenlenen ilgili hukuki sebepler esas alınır."],
      ["7. Saklama Süresi", "Kişisel veriler, işlenme amaçları için gerekli süre boyunca ve ilgili mevzuatta öngörülen süreler dikkate alınarak saklanır. Süre sona erdiğinde veya işleme sebebi ortadan kalktığında mevzuata uygun şekilde silinir, yok edilir veya anonimleştirilir."],
      ["8. KVKK Kapsamındaki Haklarınız", "KVKK'nın 11. maddesi kapsamında kişisel verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, amaç ve aktarım bilgilerini öğrenme, düzeltme, kanuni şartların oluşması halinde silme/yok etme, ilgili işlemlerin üçüncü kişilere bildirilmesini isteme, otomatik analiz sonucuna itiraz etme ve kanuna aykırı işleme nedeniyle zararınızın giderilmesini talep etme haklarına sahipsiniz. Taleplerinizi arasozgurr@gmail.com adresine iletebilirsiniz."],
    ],
  },
  privacy: {
    title: "Gizlilik Politikası",
    eyebrow: "VERİLERİN KULLANIMI",
    sections: [
      ["Hesap Oluşturmadan Kullanım", "Nerede Yiyorum'un temel özelliklerini kullanmak için hesap oluşturmanız gerekmez. Uygulamaya Misafir olarak devam edebilirsiniz. Temel kullanım için ad, telefon veya e-posta bilgisi zorunlu olarak talep edilmez."],
      ["Konum", "Yakındaki restoranları keşfetmek için cihazınızın konum bilgisi kullanılabilir. Konum iznini cihazınızın ayarlarından istediğiniz zaman değiştirebilirsiniz."],
      ["Favoriler ve Tercihler", "Favori restoranlarınız ve uygulama içerisindeki bazı tercih ve etkileşim bilgileriniz, kişiselleştirilmiş keşif deneyimi sunmak amacıyla cihazınızda veya kullanılan teknik altyapıda saklanabilir."],
      ["Google Hizmetleri", "Restoran bilgileri, harita, fotoğraf, konum ve benzeri özellikler için Google'ın ilgili hizmetlerinden yararlanılabilir. Google tarafından işlenen veriler Google'ın kendi şart ve gizlilik kurallarına da tabi olabilir."],
      ["Veri Güvenliği", "Kişisel verilerin yetkisiz erişim, kayıp, kötüye kullanım veya hukuka aykırı işlenmeye karşı korunması için makul teknik ve idari tedbirler uygulanır."],
      ["Değişiklikler ve İletişim", "Bu politika uygulamanın özellikleri, teknik altyapısı veya mevzuat değiştikçe güncellenebilir. Gizlilik ve kişisel verilerle ilgili sorularınız için arasozgurr@gmail.com adresine ulaşabilirsiniz."],
    ],
  },
  terms: {
    title: "Kullanım Koşulları",
    eyebrow: "UYGULAMA KULLANIMI",
    sections: [
      ["1. Uygulamanın Amacı", "Nerede Yiyorum; restoranları keşfetme, konuma göre restoran bulma, restoran bilgilerini görüntüleme ve kullanıcı tercihlerine göre öneriler alma amacıyla sunulur."],
      ["2. Restoran Bilgileri", "Restoran adı, adres, çalışma saatleri, puan, yorum, fotoğraf ve benzeri bilgiler üçüncü taraf kaynaklardan sağlanabilir ve zaman içinde değişebilir. Bu bilgilerin her zaman güncel, eksiksiz veya hatasız olduğu garanti edilmez."],
      ["3. Restoran Önerileri", "Uygulamadaki öneriler; puan, mesafe, fiyat, tercih ve benzeri kriterlerin otomatik değerlendirilmesine dayanabilir. Öneriler kişisel karar desteği niteliğindedir; herhangi bir restoranın kalite, güvenlik veya hizmet standardı konusunda garanti oluşturmaz."],
      ["4. Harita ve Konum", "Harita ve konum özellikleri için cihazınızdan konum izni alınması gerekebilir. İzin verilmemesi halinde bazı özellikler kullanılamayabilir."],
      ["5. Üçüncü Taraf Hizmetler", "Uygulama Google Maps, Google Places ve benzeri üçüncü taraf hizmetlerden yararlanabilir. Bu hizmetlerin kendi kullanım koşulları ve gizlilik politikaları bulunabilir."],
      ["6. Kullanıcı Sorumluluğu", "Uygulama yürürlükteki mevzuata ve üçüncü kişilerin haklarına uygun kullanılmalıdır. Kötüye kullanım, teknik altyapıya zarar verme ve yetkisiz erişim girişimleri yasaktır."],
      ["7. Hizmetin Değiştirilmesi", "Uygulamanın özellikleri geliştirilebilir, değiştirilebilir veya teknik nedenlerle geçici olarak kullanılamayabilir."],
      ["8. Sorumluluk", "Nerede Yiyorum üçüncü taraf restoranların sunduğu hizmetlerden, fiyatlardan, çalışma saatlerinden, ürünlerden veya hizmet kalitesinden doğrudan sorumlu değildir."],
      ["9. İletişim", "Kullanım koşullarıyla ilgili iletişim için arasozgurr@gmail.com adresini kullanabilirsiniz."],
    ],
  },
};

export default function LegalScreen({ type, onBack }) {
  const { colors } = useTheme();
  const data = LEGAL[type] || LEGAL.privacy;
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.line }]}>
        <TouchableOpacity onPress={onBack} style={styles.back}><Text style={[styles.backText,{color:colors.ink}]}>‹</Text></TouchableOpacity>
        <View style={{flex:1}}><Text style={[styles.eyebrow,{color:colors.accent}]}>{data.eyebrow}</Text><Text style={[styles.title,{color:colors.ink}]}>{data.title}</Text></View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.notice,{backgroundColor:colors.chipBg,borderColor:colors.line}]}>
          <Text style={[styles.noticeText,{color:colors.inkSoft}]}>Veri sorumlusu: Özgür Aras · arasozgurr@gmail.com</Text>
        </View>
        {data.sections.map(([heading, body]) => (
          <View key={heading} style={styles.section}>
            <Text style={[styles.heading,{color:colors.ink}]}>{heading}</Text>
            <Text style={[styles.body,{color:colors.inkSoft}]}>{body}</Text>
          </View>
        ))}
        <Text style={[styles.updated,{color:colors.inkSoft}]}>Son güncelleme: 6 Eylül 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
  screen:{flex:1},
  header:{paddingHorizontal:18,paddingTop:10,paddingBottom:14,borderBottomWidth:1,flexDirection:"row",alignItems:"center",gap:8},
  back:{width:38,height:38,alignItems:"center",justifyContent:"center"},
  backText:{fontSize:34,fontWeight:"300",lineHeight:36},
  eyebrow:{fontSize:9,fontWeight:"900",letterSpacing:1.4},
  title:{fontSize:20,fontWeight:"900",marginTop:2},
  content:{padding:20,paddingBottom:40},
  notice:{borderWidth:1,borderRadius:14,padding:12,marginBottom:20},
  noticeText:{fontSize:11,lineHeight:17},
  section:{marginBottom:20},
  heading:{fontSize:14,fontWeight:"850",marginBottom:6},
  body:{fontSize:13,lineHeight:21},
  updated:{fontSize:10,marginTop:4},
});
