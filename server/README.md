# Nerede Yiyorum — Backend V8

Backend, Google Places API (New) ile mobil uygulama arasında güvenli bir proxy görevi görür. Google API anahtarı mobil uygulamaya gönderilmez.

## 1. Google Cloud hazırlığı

Google Cloud projesinde **Places API (New)** etkinleştirilmelidir. Billing aktif olmalıdır. Üretimde API anahtarını yalnızca gerekli API'lerle sınırlandırın.

## 2. Yerelde çalıştırma

```bash
cd server
npm install
cp .env.example .env
# .env içindeki GOOGLE_PLACES_API_KEY değerini doldurun
npm start
```

Kontrol:

```bash
curl http://localhost:3000/health
```

Beklenen cevapta `placesApi: "new"` görünmelidir.

## 3. Uç noktalar

- `GET /api/nearby?lat=&lng=&radius=&keyword=&opennow=&maxprice=`
- `GET /api/details?placeId=`
- `GET /api/photo?photoReference=&maxWidth=`
- `GET /health`

## 4. Maliyet kontrolü

Places API (New) çağrılarında FieldMask zorunludur. Üretimde `*` kullanmayın; yalnızca uygulamanın gerçekten kullandığı alanları isteyin. Bu sürüm, Nearby/Text Search ve Details çağrılarında açık field mask kullanır.

## 5. API anahtarı

Mobil uygulama içine `GOOGLE_PLACES_API_KEY` koymayın. Mobil uygulama yalnızca kendi backend adresine istek atmalıdır. Google Cloud tarafında backend anahtarını kullanılan API'lerle sınırlandırın ve kota/uyarıları açın.
