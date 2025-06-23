const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true, // Make description required
    },
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
        },
        filename: {
            type: String,
            default: "listingimage"
        }
    },
    price: {
        type: Number,
        required: true, // Make price required
        min: 0
    },
    location: {
        type: String,
        required: true, // Make location required
    },
    country: {
        type: String,
        required: true, // Make country required
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
}
});


listingSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        });
        console.log("All associated reviews deleted.");
    }
});

module.exports = mongoose.model("Listing", listingSchema);