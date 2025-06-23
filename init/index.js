const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require ("../Models/listings.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
   await mongoose.connect(MONGO_URL);
} 

main()
    .then(() => {
        console.log("Connected to DB");
    }).catch((err)=>{
        console.log(err);
    });

    const initDB = async () => {
    try {
        await Listing.deleteMany();
        initData.data = initData.data.map((obj) => ({
            ...obj, owner: "68543484a0059d514dcbc008",
        }));
        await Listing.insertMany(initData.data);
        console.log("data was initialized");
    } catch (err) {
        console.error("Data initialization failed:", err);
    }
};


    initDB();