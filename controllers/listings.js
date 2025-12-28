const Listing = require("../models/listing.js");
const MAP_TOKEN = process.env.MAP_TOKEN;

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
    // Location not found - default to New Delhi
    console.log(`Location not found: "${location}", using default coordinates`);
    // GeoJSON format: [lon, lat]
    return { type: "Point", coordinates: [77.209, 28.6139] };
  } catch (error) {
    console.error("Geocoding error:", error);
    // GeoJSON format: [lon, lat]
    return { type: "Point", coordinates: [77.209, 28.6139] };
  }
}

module.exports.index = async (req, res) => {
  const { category, q } = req.query;
  let filter = {};
  if (category) {
    filter.category = category;
  }
  if (q && q.trim() !== "") {
    // Case-insensitive search on title
    filter.title = { $regex: q, $options: "i" };
  }
  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", { allListings, category, query: q });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing, MAP_TOKEN });
};

module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // Handle image upload
  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  } else {
    // Default image if none uploaded
    newListing.image = {
      url: "https://plus.unsplash.com/premium_photo-1682310096066-20c267e20605?q=80&w=1212&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      filename: "default",
    };
  }

  // Geocode the location
  const locationQuery = `${req.body.listing.location}, ${req.body.listing.country}`;
  newListing.geometry = await geocodeLocation(locationQuery);

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Re-geocode if location changed
  const locationQuery = `${req.body.listing.location}, ${req.body.listing.country}`;
  listing.geometry = await geocodeLocation(locationQuery);

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
