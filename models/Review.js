const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true
    },
    username:{
        type: String,
        required: true,
        trim: true  
    },
    image:{
        type: Object,
        required: true
    },
    review:{
        type: String,
        required: true,
        trim: true
    },
    rating:{
        type: Number,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model("review", reviewSchema)