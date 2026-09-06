// Kullanıcıya gösterilecek yemek türü kategorileri.
// "keyword" alanı, Google Places API aramasında kullanılan arama terimidir.
// "forceOpenNow" true ise bu kategori seçildiğinde "şu an açık" filtresi
// otomatik olarak devreye girer (örn. "7/24 Açık" kategorisi gibi).
export const CATEGORIES = [
  { id: "all", label: "Tümü", keyword: "" },
  { id: "kebap", label: "Kebap", keyword: "kebap" },
  { id: "deniz", label: "Deniz Ürünleri", keyword: "balık restoran" },
  { id: "vegan", label: "Vegan", keyword: "vegan restoran" },
  { id: "fastfood", label: "Fast Food", keyword: "fast food" },
  { id: "kahvalti", label: "Kahvaltı", keyword: "kahvaltı" },
  { id: "tatli", label: "Tatlı", keyword: "tatlıcı" },
  { id: "evyemegi", label: "Ev Yemeği", keyword: "ev yemekleri lokanta" },
  { id: "sokak", label: "Sokak Lezzetleri", keyword: "sokak lezzetleri" },
  { id: "helal", label: "Helal Sertifikalı", keyword: "helal sertifikalı restoran" },
  { id: "kahve", label: "Kahve", keyword: "kahveci" },
  { id: "acik247", label: "7/24 Açık", keyword: "", forceOpenNow: true },
];
