const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js")
const listing = require("../models/listing.js");
const { valideReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviweController = require("../controllers/review.js");




//Reviews
//Post Reviews route
router.post("/", isLoggedIn,
  valideReview,
  wrapAsync(reviweController.createReview)
);

//Delete Review Route
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviweController.destroyReview));


module.exports = router;