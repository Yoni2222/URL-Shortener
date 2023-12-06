const mongoose = require("mongoose");
const tableSchema = new mongoose.Schema({
    originalUrl : String,
    shortUrl : String,
    date : String,
    currTime : String,
    userId : String
});
module.exports = mongoose.model('urlAddress', tableSchema);