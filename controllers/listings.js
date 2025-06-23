const Listing = require("../Models/listings");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
};

module.exports.renderNewForm = (req, res)=> {
    res.render('listings/new.ejs');
}

module.exports.ShowListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author",},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const listingData = {...req.body.listing}; // Keep as lowercase 'listing'
    
    // Handle image field - if empty or not provided, don't include it (will use default)
    if (!listingData.image || listingData.image.trim() === '') {
        delete listingData.image;
    } else {
        // If image is provided as string, convert to object format
        if (typeof listingData.image === 'string') {
            listingData.image = {
                filename: "listingimage",
                url: listingData.image
            };
        }
    }
    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) =>{
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let updateData = { ...req.body.listing }; // Changed from 'Listing' to 'listing' (lowercase)

    // Handle image field properly
    if (!updateData.image || updateData.image.trim() === '') {
        // If image is empty, set to default
        updateData.image = {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
        };
    } else {
        // If image is a string URL, convert to object format
        if (typeof updateData.image === 'string') {
            updateData.image = {
                filename: "listingimage",
                url: updateData.image
            };
        }
    }

    let listing = await Listing.findByIdAndUpdate(id, updateData);

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findOneAndDelete({ _id: id });
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}