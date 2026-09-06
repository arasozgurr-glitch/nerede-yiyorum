require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_BASE = "https://places.googleapis.com/v1";

if (!GOOGLE_KEY) {
  console.error("HATA: GOOGLE_PLACES_API_KEY tanımlı değil (.env dosyasına bakın).");
  process.exit(1);
}

app.use(cors({ origin: true }));
app.use(express.json({ limit: "32kb" }));
app.use(rateLimit({ windowMs: 60 * 1000, max: 60 }));

const PRICE_LEVELS = [
  "PRICE_LEVEL_FREE",
  "PRICE_LEVEL_INEXPENSIVE",
  "PRICE_LEVEL_MODERATE",
  "PRICE_LEVEL_EXPENSIVE",
  "PRICE_LEVEL_VERY_EXPENSIVE",
];

function toNumericPrice(level) {
  if (typeof level === "number") return level;
  const index = PRICE_LEVELS.indexOf(level);
  return index < 0 ? null : index;
}

function normalizePhoto(photo) {
  if (!photo?.name) return null;
  return {
    name: photo.name,
    widthPx: photo.widthPx || null,
    heightPx: photo.heightPx || null,
  };
}

function normalizePlace(place, categoryKeyword = "") {
  return {
    id: place.id,
    name: place.displayName?.text || "İsimsiz restoran",
    rating: place.rating ?? 0,
    reviewCount: place.userRatingCount ?? 0,
    address: place.formattedAddress || place.shortFormattedAddress || "",
    isOpenNow: place.currentOpeningHours?.openNow ?? null,
    priceLevel: toNumericPrice(place.priceLevel),
    location: {
      latitude: place.location?.latitude,
      longitude: place.location?.longitude,
    },
    photoReference: place.photos?.[0]?.name ?? null,
    photos: (place.photos || []).slice(0, 8).map(normalizePhoto).filter(Boolean),
    types: place.types || [],
    primaryType: place.primaryType || null,
    categoryKeyword,
    googleUrl: place.googleMapsUri || null,
  };
}

function commonFieldMask() {
  return [
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.location",
    "places.rating",
    "places.userRatingCount",
    "places.priceLevel",
    "places.currentOpeningHours",
    "places.photos",
    "places.types",
    "places.primaryType",
    "places.googleMapsUri",
  ].join(",");
}

async function googlePost(path, body, fieldMask) {
  const response = await fetch(`${GOOGLE_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_KEY,
      "X-Goog-FieldMask": fieldMask,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    const detail = data?.error?.message || `HTTP ${response.status}`;
    throw new Error(`Google Places hatası: ${detail}`);
  }
  return data;
}

async function googleGet(path, fieldMask) {
  const response = await fetch(`${GOOGLE_BASE}${path}`, {
    headers: {
      "X-Goog-Api-Key": GOOGLE_KEY,
      "X-Goog-FieldMask": fieldMask,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    const detail = data?.error?.message || `HTTP ${response.status}`;
    throw new Error(`Google Places hatası: ${detail}`);
  }
  return data;
}

function numericPriceLevels(maxPrice) {
  if (maxPrice == null) return undefined;
  const n = Math.max(0, Math.min(4, Number(maxPrice)));
  return PRICE_LEVELS.slice(0, n + 1);
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "nerede-yiyorum-api", placesApi: "new" });
});

app.get("/api/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 3000, keyword = "", opennow, maxprice } = req.query;
    const latitude = Number(lat);
    const longitude = Number(lng);
    const radiusMeters = Math.max(100, Math.min(5000, Number(radius) || 3000));

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({ error: "Geçerli lat ve lng zorunlu" });
    }

    const common = {
      maxResultCount: 20,
      languageCode: "tr",
      locationRestriction: {
        circle: {
          center: { latitude, longitude },
          radius: radiusMeters,
        },
      },
    };

    let data;
    if (String(keyword).trim()) {
      const body = {
        textQuery: `${String(keyword).trim()} restoran`,
        pageSize: 20,
        languageCode: "tr",
        locationBias: {
          circle: {
            center: { latitude, longitude },
            radius: radiusMeters,
          },
        },
        includedType: "restaurant",
      };
      if (opennow === "true") body.openNow = true;
      const priceLevels = numericPriceLevels(maxprice);
      if (priceLevels?.length) body.priceLevels = priceLevels;
      data = await googlePost("/places:searchText", body, commonFieldMask());
    } else {
      const body = { ...common, includedTypes: ["restaurant"], rankPreference: "DISTANCE" };
      if (opennow === "true") body.openNow = true;
      const priceLevels = numericPriceLevels(maxprice);
      if (priceLevels?.length) body.priceLevels = priceLevels;
      data = await googlePost("/places:searchNearby", body, commonFieldMask());
    }

    res.json({ results: (data.places || []).map((p) => normalizePlace(p, String(keyword).trim())) });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message || "Google Places sorgusu başarısız" });
  }
});

app.get("/api/details", async (req, res) => {
  try {
    const { placeId } = req.query;
    if (!placeId || typeof placeId !== "string" || !placeId.trim()) {
      return res.status(400).json({ error: "Geçerli placeId zorunlu" });
    }

    const fieldMask = [
      "id",
      "displayName",
      "formattedAddress",
      "nationalPhoneNumber",
      "internationalPhoneNumber",
      "currentOpeningHours",
      "regularOpeningHours",
      "photos",
      "rating",
      "userRatingCount",
      "location",
      "priceLevel",
      "websiteUri",
      "googleMapsUri",
      "reviews",
    ].join(",");

    const resource = placeId.startsWith("places/") ? placeId : `places/${placeId}`;
    const data = await googleGet(`/${resource}?languageCode=tr`, fieldMask);
    const r = data;

    res.json({
      result: {
        id: r.id,
        name: r.displayName?.text || "İsimsiz restoran",
        phone: r.nationalPhoneNumber || r.internationalPhoneNumber || null,
        address: r.formattedAddress || null,
        rating: r.rating ?? 0,
        reviewCount: r.userRatingCount ?? 0,
        priceLevel: toNumericPrice(r.priceLevel),
        website: r.websiteUri || null,
        googleUrl: r.googleMapsUri || null,
        isOpenNow: r.currentOpeningHours?.openNow ?? null,
        weekdayText: r.regularOpeningHours?.weekdayDescriptions || r.currentOpeningHours?.weekdayDescriptions || [],
        photoReferences: (r.photos || []).slice(0, 8).map((p) => p.name).filter(Boolean),
        reviews: (r.reviews || []).slice(0, 5).map((review) => ({
          authorName: review.authorAttribution?.displayName || "Google kullanıcısı",
          rating: review.rating ?? 0,
          text: review.text?.text || "",
          relativeTime: review.relativePublishTimeDescription || "",
          authorUrl: review.authorAttribution?.uri || null,
          profilePhotoUrl: review.authorAttribution?.photoUri || null,
        })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message || "Google Places detay sorgusu başarısız" });
  }
});

app.get("/api/photo", async (req, res) => {
  try {
    const { photoReference, maxWidth = 800 } = req.query;
    if (!photoReference) return res.status(400).json({ error: "photoReference zorunlu" });
    const width = Math.max(120, Math.min(1600, Number(maxWidth) || 800));
    const url = `${GOOGLE_BASE}/${photoReference}/media?maxWidthPx=${width}&key=${encodeURIComponent(GOOGLE_KEY)}`;
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) return res.status(502).json({ error: `Fotoğraf alınamadı: HTTP ${response.status}` });
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fotoğraf sunucusu hatası" });
  }
});

app.get("/", (_req, res) => res.send("Nerede Yiyorum API çalışıyor — Places API (New)."));

app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
