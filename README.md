# Nerede Yiyorum — V8 / Adım 1

Bu sürümde ilk mağaza öncesi teknik adım tamamlandı: Google Places entegrasyonu **Places API (New)** yapısına taşındı ve API anahtarı backend'de tutuluyor.

## Bu adımda yapılanlar

- Nearby Search (New) ve Text Search (New) kullanıldı.
- Place Details (New) kullanıldı.
- Fotoğraflar backend proxy üzerinden akıyor.
- Mobil uygulamada Google API anahtarı bulunmuyor.
- Üretimde gereksiz alan istememek için açık FieldMask kullanılıyor.
- Backend'e `/health` kontrol endpoint'i eklendi.
- İstek başına ve alan başına maliyet kontrolü için kapsamlı alan maskeleri tanımlandı.

## Çalıştırma

Mobil uygulama:

```bash
npm install
npx expo start
```

Backend:

```bash
cd server
npm install
cp .env.example .env
# .env içine GOOGLE_PLACES_API_KEY girin
npm start
```

Sonra `app.json` içindeki `extra.apiBaseUrl` değerini deploy edilmiş backend adresinizle değiştirin.

## v1.2.0 — Misafir kullanım ve hukuki metinler

- Zorunlu hesap/giriş akışı kullanılmaz; kullanıcı onboarding sonrasında **Misafir olarak devam et** seçeneğiyle uygulamaya geçer.
- Onboarding'in son adımında KVKK Aydınlatma Metni ve Gizlilik Politikası bağlantıları bulunur.
- Ayarlar ekranına KVKK Aydınlatma Metni, Gizlilik Politikası ve Kullanım Koşulları eklendi.
- Hukuki metinler uygulama içinde erişilebilir hale getirildi.
- `legal/index.html` App Store / Google Play için yayınlanabilecek statik hukuki sayfa taslağıdır. Yayın öncesi gerçek bir HTTPS URL altında barındırılmalıdır.
- Veri sorumlusu: Özgür Aras — arasozgurr@gmail.com


## v1.2.1 — Mağaza hazırlığı
- Kullanılmayan arka plan konumu/geofencing servisi kaldırıldı.
- iOS konum izin açıklaması, uygulamanın temel işlevini daha açık anlatacak şekilde güncellendi.
- Sürüm numarası 1.2.1 olarak güncellendi.


## SDK 54 mağaza hazırlığı — v1.3.0

- Expo SDK 51 → SDK 54
- React Native 0.74 → 0.81
- React 18 → 19
- `expo-location` → 19.0.8
- `expo-constants` → 18.0.13
- `react-native-maps` → 1.20.1
- `react-native-webview` → 13.15.0
- `@react-native-community/slider` → 5.0.1
- `@react-native-async-storage/async-storage` → 2.2.0
- New Architecture aktif edildi.

> Not: Bu çalışma ortamında npm registry erişimi zaman aşımına uğradığı için `npm install` tamamlanamadı. Bu nedenle `node_modules` ve lockfile yeniden üretilmedi. Projeyi çalıştıracağınız makinede `npm install` ardından `npx expo install --fix` ve `npx expo-doctor` çalıştırılmalıdır.
