const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const { isLoggedIn, isOwner, valideListing } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });


router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, valideListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createNewListing)
  );

//new Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
  .get(wrapAsync(listingController.showListing)
  )
  .put(isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    valideListing,
    wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));



//edit route
router.get("/:id/edit", isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm));

module.exports = router;