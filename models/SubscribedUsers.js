const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const SubscribedUserSchema = new Schema({
    email:{
        type: String,
        required: true,
        trim: true
    }
},{timestamps: true})

module.exports = mongoose.model('subscribedUsers', SubscribedUserSchema)