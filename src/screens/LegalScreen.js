import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";

const LEGAL = {
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    eyebrow: "KİŞİSEL VERİLERİN KORUNMASI",
    sections: [
      [
        "1. Veri Sorumlusu",
        "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında kişisel verilerinizin veri sorumlusu Özgür Aras'tır. İletişim: arasozgurr@gmail.com",
      ],
      [
        "2. Uygulama ve Veri İşleme Yapısı",
        "Nerede Yiyorum, temel özelliklerinin önemli bir bölümünü kullanıcı hesabı oluşturmadan kullanabileceğiniz şekilde tasarlanmıştır. Temel kullanım için ad, soyad, telefon numarası veya e-posta adresi girmeniz zorunlu değildir. Uygulama kapsamında bazı bilgiler yalnızca cihazınızda, bazı bilgiler ise uygulamanın çalışması için kullanılan hizmetlere aktarılabilir.",
      ],
      [
        "3. İşlenebilen Veriler",
        "Uygulamanın kullanımına bağlı olarak; uygulama tercihleri, favori restoranlar, görüntülenen restoranlara ilişkin etkileşim sinyalleri, kategori tercihleri, uygulama içi arama sorguları, restoranlara verilen beğeni veya beğenmeme geri bildirimleri ve tema tercihi cihazınızda saklanabilir. Bu bilgiler kişiselleştirilmiş restoran önerileri ve uygulama deneyimi sunmak amacıyla kullanılabilir.",
      ],
      [
        "4. Konum Bilgisi",
        "Yakınınızdaki restoranları göstermek, restoranları mesafeye göre sıralamak ve harita özelliklerini sunmak amacıyla uygulamayı kullandığınız sırada cihazınızın konum bilgisi, özellikle enlem ve boylam verileri, kullanılabilir. Konum izni işletim sisteminiz üzerinden yönetilir. Konum izni verilmemesi halinde konuma bağlı bazı özellikler kullanılamayabilir.",
      ],
      [
        "5. Konum Bilgisinin Kullanılması ve Aktarılması",
        "Yakındaki restoranların bulunabilmesi amacıyla cihazınızdan alınan konum bilgisi, uygulamanın sunucu altyapısı üzerinden restoran verilerinin sağlanması amacıyla Google Places gibi kullanılan hizmetlere iletilebilir. Konum bilgisi uygulama tarafından kalıcı bir kullanıcı profili oluşturmak amacıyla cihazda saklanmaz.",
      ],
      [
        "6. Cihazda Saklanan Veriler",
        "Favoriler, uygulama tercihleri ve kişiselleştirme amacıyla kullanılan bazı etkileşim sinyalleri cihazınızın yerel depolama alanında tutulabilir. Bu kapsamda favori restoranların temel bilgileri, tercih edilen kategoriler, arama sorguları, restoran görüntüleme sinyalleri ve beğeni veya beğenmeme geri bildirimleri cihazınızda saklanabilir.",
      ],
      [
        "7. Kişiselleştirme",
        "Uygulama, restoran önerilerini kişiselleştirmek amacıyla tercihlerinizi ve uygulama içindeki bazı etkileşimlerinizi kullanabilir. Kişiselleştirme kapsamında kullanılan veriler, mevcut uygulama mimarisinde cihaz üzerinde değerlendirilir. Bu değerlendirmeler restoranların sıralanması ve önerilerin size daha uygun hale getirilmesi amacıyla kullanılır.",
      ],
      [
        "8. Üçüncü Taraf Hizmetler",
        "Restoran bilgileri, konum, harita, fotoğraf, çalışma saatleri, puan ve kullanıcı yorumları gibi özelliklerin sağlanması amacıyla Google Maps Platform ve Google Places gibi üçüncü taraf hizmetlerden yararlanılabilir. Bu hizmetler kapsamında ilgili verilerin üçüncü taraf hizmet sağlayıcıların sistemlerinde işlenmesi söz konusu olabilir. Üçüncü taraf hizmetlerin kendi kullanım koşulları ve gizlilik politikaları ayrıca uygulanabilir.",
      ],
      [
        "9. İşleme Amaçları",
        "Kişisel veriler; yakındaki restoranları göstermek, restoranlar arasında mesafe hesaplamak, arama ve filtreleme özelliklerini sunmak, restoran önerilerini kişiselleştirmek, favorileri ve uygulama tercihlerini yönetmek, uygulamanın güvenli ve düzgün çalışmasını sağlamak, teknik sorunları gidermek ve uygulama deneyimini geliştirmek amacıyla işlenebilir.",
      ],
      [
        "10. Toplanma Yöntemi ve Hukuki Sebep",
        "Veriler; uygulamanın kullanılması, cihazın konum servisleri ve kullanıcı tarafından gerçekleştirilen seçim ve etkileşimler aracılığıyla elektronik ortamda toplanabilir. Kişisel veri işleme faaliyetleri, KVKK'nın 5. maddesinde düzenlenen ilgili hukuki sebepler çerçevesinde yürütülür.",
      ],
      [
        "11. Saklama Süresi",
        "Cihaz üzerinde saklanan veriler, uygulamanın ilgili özellikleri kullanılmaya devam edildiği sürece cihazınızda tutulabilir. Verilerin silinmesi, uygulamanın kaldırılması, cihaz depolama verilerinin temizlenmesi veya ilgili özelliğin kullanımının sona ermesi sonucunda cihazdaki veriler silinebilir. Mevzuat gereği ayrıca saklanması gereken veriler bakımından ilgili yasal süreler uygulanır.",
      ],
      [
        "12. KVKK Kapsamındaki Haklarınız",
        "KVKK'nın 11. maddesi kapsamında kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işleme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, kişisel verilerin aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme ve kanuni şartların oluşması halinde silinmesini veya yok edilmesini talep etme dahil olmak üzere kanunda düzenlenen haklara sahipsiniz. Taleplerinizi arasozgurr@gmail.com adresine iletebilirsiniz.",
      ],
      [
        "13. Veri Güvenliği",
        "Kişisel verilerin yetkisiz erişim, kayıp, kötüye kullanım veya hukuka aykırı işlenmeye karşı korunması amacıyla makul teknik ve idari tedbirlerin uygulanması hedeflenmektedir.",
      ],
    ],
  },

  privacy: {
    title: "Gizlilik Politikası",
    eyebrow: "VERİLERİN KULLANIMI",
    sections: [
      [
        "Hesap Oluşturmadan Kullanım",
        "Nerede Yiyorum'un temel özelliklerini kullanmak için hesap oluşturmanız gerekmez. Uygulamayı Misafir olarak kullanabilirsiniz. Temel kullanım için ad, telefon veya e-posta bilgisi zorunlu olarak talep edilmez.",
      ],
      [
        "Konum",
        "Yakınınızdaki restoranları keşfetmek, mesafeleri hesaplamak ve harita özelliklerini kullanmak için cihazınızın konum bilgisi kullanılabilir. Konum izni cihazınızın işletim sistemi üzerinden yönetilir ve istediğiniz zaman değiştirilebilir.",
      ],
      [
        "Favoriler",
        "Favori restoranlarınız cihazınızın yerel depolama alanında saklanır. Favorileriniz temel kullanım kapsamında bir kullanıcı hesabına bağlanmaz ve uygulamanın mevcut mimarisinde favori listesinin kendisi sunucuya gönderilmez.",
      ],
      [
        "Tercihler ve Kişiselleştirme",
        "Seçtiğiniz mutfak türleri, bütçe ve mesafe gibi uygulama tercihleri ile restoran görüntüleme, kategori seçimi, arama ve beğeni/beğenmeme gibi bazı etkileşim sinyalleri cihazınızda kişiselleştirilmiş öneriler oluşturmak amacıyla saklanabilir.",
      ],
      [
        "Arama Sorguları",
        "Uygulama içerisinde gerçekleştirdiğiniz arama sorguları, kişiselleştirilmiş restoran önerileri ve arama deneyimini geliştirmek amacıyla cihazınızda saklanabilir.",
      ],
      [
        "Google Hizmetleri",
        "Restoran bilgileri, harita, fotoğraf, konum, çalışma saatleri, puanlar ve kullanıcı yorumları gibi özellikler için Google Maps Platform ve Google Places hizmetlerinden yararlanılabilir. Google tarafından işlenen veriler, Google'ın kendi kullanım koşulları ve gizlilik politikalarına da tabidir.",
      ],
      [
        "Restoran Bilgileri",
        "Restoran adı, adres, çalışma saatleri, puan, yorum, fotoğraf ve benzeri bilgiler üçüncü taraf kaynaklardan sağlanabilir. Bu bilgiler zaman içinde değişebilir ve her zaman eksiksiz veya güncel olmayabilir.",
      ],
      [
        "Veri Güvenliği",
        "Kişisel verilerin yetkisiz erişim, kayıp, kötüye kullanım veya hukuka aykırı işlenmeye karşı korunması amacıyla makul teknik ve idari tedbirlerin uygulanması hedeflenmektedir.",
      ],
      [
        "Verilerin Silinmesi",
        "Cihaz üzerinde tutulan favoriler, tercihler ve kişiselleştirme verileri cihazınızdaki uygulama verilerinin temizlenmesi veya uygulamanın kaldırılması gibi işlemler sonucunda silinebilir.",
      ],
      [
        "Değişiklikler ve İletişim",
        "Bu politika uygulamanın özellikleri, teknik altyapısı veya yürürlükteki mevzuat değiştikçe güncellenebilir. Gizlilik ve kişisel verilerle ilgili sorularınız için arasozgurr@gmail.com adresine ulaşabilirsiniz.",
      ],
    ],
  },

  terms: {
    title: "Kullanım Koşulları",
    eyebrow: "UYGULAMA KULLANIMI",
    sections: [
      [
        "1. Uygulamanın Amacı",
        "Nerede Yiyorum; restoranları keşfetme, konuma göre restoran bulma, restoran bilgilerini görüntüleme, restoranları karşılaştırma ve kullanıcı tercihlerine göre öneriler alma amacıyla sunulur.",
      ],
      [
        "2. Restoran Bilgileri",
        "Restoran adı, adres, çalışma saatleri, puan, yorum, fotoğraf ve benzeri bilgiler üçüncü taraf kaynaklardan, özellikle Google Maps Platform ve Google Places hizmetlerinden sağlanabilir. Bu bilgiler zaman içinde değişebilir. Bilgilerin her zaman güncel, eksiksiz veya hatasız olduğu garanti edilmez.",
      ],
      [
        "3. Restoran Önerileri",
        "Uygulamadaki öneriler; restoran puanı, mesafe, fiyat, kullanıcı tercihleri ve uygulama içindeki bazı etkileşim sinyalleri gibi kriterlerin otomatik olarak değerlendirilmesine dayanabilir. Öneriler kişisel karar desteği niteliğindedir ve herhangi bir restoranın kalite, güvenlik veya hizmet standardı konusunda garanti oluşturmaz.",
      ],
      [
        "4. Arama ve Sıralama",
        "Arama sonuçları ve restoran sıralamaları; arama sorgusu, mesafe, puan, fiyat, kategori, kullanıcı tercihleri ve kişiselleştirme sinyalleri gibi çeşitli kriterlerden etkilenebilir.",
      ],
      [
        "5. Harita ve Konum",
        "Harita ve konum özellikleri için cihazınızdan konum izni alınması gerekebilir. İzin verilmemesi halinde konuma bağlı bazı özellikler kullanılamayabilir. Harita ve yönlendirme özellikleri üçüncü taraf harita hizmetlerine yönlendirebilir.",
      ],
      [
        "6. Üçüncü Taraf Hizmetler",
        "Uygulama Google Maps, Google Places ve benzeri üçüncü taraf hizmetlerden yararlanabilir. Bu hizmetlerin kendi kullanım koşulları, gizlilik politikaları ve teknik gereklilikleri bulunabilir.",
      ],
      [
        "7. Google İçeriği ve Yorumlar",
        "Google kaynaklı restoran bilgileri, fotoğraflar ve kullanıcı yorumları üçüncü taraf içerikleridir. Bu içeriklerin gösteriminde ilgili Google Maps ve Google Places kurallarına ve gerekli atıf/bağlantı gerekliliklerine uyulması esastır.",
      ],
      [
        "8. Kullanıcı Sorumluluğu",
        "Uygulama yürürlükteki mevzuata ve üçüncü kişilerin haklarına uygun kullanılmalıdır. Kötüye kullanım, teknik altyapıya zarar verme, yetkisiz erişim girişimleri ve hizmetin işleyişini bozacak faaliyetler yasaktır.",
      ],
      [
        "9. Hizmetin Değiştirilmesi",
        "Uygulamanın özellikleri geliştirilebilir, değiştirilebilir veya teknik nedenlerle geçici olarak kullanılamayabilir. Üçüncü taraf hizmetlerde meydana gelen değişiklikler de uygulamanın bazı özelliklerinin çalışmasını etkileyebilir.",
      ],
      [
        "10. Sorumluluk",
        "Nerede Yiyorum, üçüncü taraf restoranların sunduğu hizmetlerden, fiyatlardan, çalışma saatlerinden, ürünlerden, içeriklerden veya hizmet kalitesinden doğrudan sorumlu değildir. Uygulamadaki restoran bilgileri karar vermenize yardımcı olmak amacıyla sunulur.",
      ],
      [
        "11. İletişim",
        "Kullanım koşullarıyla ilgili iletişim için arasozgurr@gmail.com adresini kullanabilirsiniz.",
      ],
    ],
  },
};

export default function LegalScreen({ type, onBack }) {
  const { colors } = useTheme();
  const data = LEGAL[type] || LEGAL.privacy;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.line }]}>
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Text style={[styles.backText, { color: colors.ink }]}>‹</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.eyebrow, { color: colors.accent }]}>
            {data.eyebrow}
          </Text>

          <Text style={[styles.title, { color: colors.ink }]}>
            {data.title}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.notice,
            {
              backgroundColor: colors.chipBg,
              borderColor: colors.line,
            },
          ]}
        >
          <Text style={[styles.noticeText, { color: colors.inkSoft }]}>
            Veri sorumlusu: Özgür Aras · arasozgurr@gmail.com
          </Text>
        </View>

        {data.sections.map(([heading, body]) => (
          <View key={heading} style={styles.section}>
            <Text style={[styles.heading, { color: colors.ink }]}>
              {heading}
            </Text>

            <Text style={[styles.body, { color: colors.inkSoft }]}>
              {body}
            </Text>
          </View>
        ))}

        <Text style={[styles.updated, { color: colors.inkSoft }]}>
          Son güncelleme: 6 Eylül 2026
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  back: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    fontSize: 34,
    fontWeight: "300",
    lineHeight: 36,
  },

  eyebrow: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    marginTop: 2,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  notice: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },

  noticeText: {
    fontSize: 11,
    lineHeight: 17,
  },

  section: {
    marginBottom: 20,
  },

  heading: {
    fontSize: 14,
    fontWeight: "850",
    marginBottom: 6,
  },

  body: {
    fontSize: 13,
    lineHeight: 21,
  },

  updated: {
    fontSize: 10,
    marginTop: 4,
  },
});