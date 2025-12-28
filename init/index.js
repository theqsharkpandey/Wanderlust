const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config();

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MAP_TOKEN = process.env.MAP_TOKEN;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Geocode location using Geoapify
async function geocodeLocation(location) {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        location
      )}&apiKey=${MAP_TOKEN}`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      // Geoapify returns [lon, lat]
      const [lon, lat] = data.features[0].geometry.coordinates;
      // GeoJSON format: [lon, lat]
      return { type: "Point", coordinates: [lon, lat] };
    }
    console.log(`Location not found: "${location}", using default coordinates`);
    // GeoJSON format: [lon, lat]
    return { type: "Point", coordinates: [77.209, 28.6139] };
  } catch (error) {
    console.error("Geocoding error:", error);
    // GeoJSON format: [lon, lat]
    return { type: "Point", coordinates: [77.209, 28.6139] };
  }
}

const initDB = async () => {
  await Listing.deleteMany({});

  // Add owner and geocode each listing
  const listingsWithGeo = [];
  for (const obj of initData.data) {
    const locationQuery = `${obj.location}, ${obj.country}`;
    console.log(`Geocoding: ${locationQuery}`);
    const geometry = await geocodeLocation(locationQuery);
    listingsWithGeo.push({
      ...obj,
      owner: "693bedbab15e8972a9f989d8",
      geometry,
    });
  }

  await Listing.insertMany(listingsWithGeo);
  console.log("data was initialized with geocoded locations");
};

initDB();
