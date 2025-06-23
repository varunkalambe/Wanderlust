const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../Models/listings");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(ListingController.createListing));

//New route
router.get("/new", isLoggedIn, ListingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(ListingController.ShowListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"),  validateListing, wrapAsync(ListingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing));


//edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

module.exports = router;