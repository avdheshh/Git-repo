const listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const MapToken = process.env.Map_Token;

const geocodingClient = mbxGeocoding({ accessToken: MapToken });


module.exports.index = async (req, res) => {
  const allListings = await listing.find({});
  res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}



module.exports.createNewListing = (async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newlisting = new listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  newlisting.geometry = response.body.features[0].geometry;
  let savedListing = await newlisting.save();
  req.flash("success", "New Listing Created !");
  res.redirect("/listings");
});

module.exports.showListing = (async (req, res) => {
  let { id } = req.params;
  const listings = await listing.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
    .populate("owner");
  if (!listings) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings")
  }
  res.render("listings/show.ejs", { listings });
})

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listings = await listing.findById(id);
  if (!listings) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalListingUrl = listings.image.url;
  originalListingUrl = originalListingUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listings, originalListingUrl });
};



module.exports.updateListing =
  (async (req, res) => {
    let { id } = req.params;
    let listings = await listing.findByIdAndUpdate(id, { ...req.body.listing });



    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listings.image = { url, filename };
      await listings.save();
    }

    req.flash("success", " Listing Updated !");
    res.redirect(`/listings/${id}`);
  });


module.exports.destroyListing = (async (req, res) => {
  let { id } = req.params;
  let deletedListing = await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted !");
  res.redirect("/listings")

})