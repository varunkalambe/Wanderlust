const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewScheme = new Schema(
    {
        comment:{
            type : String,
        },
        rating:{
            type: Number,
            min:1,
            max:5
        },
        createdAt:{
            type:Date,
            default: Date.now
        },
        author:{
            type: Schema.Types.ObjectId,
            ref: "user",
        }
    });

    module.exports = mongoose.model("Review", reviewScheme);