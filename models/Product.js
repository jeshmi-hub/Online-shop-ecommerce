const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    product_id:{
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    title:{
        type: String,
        trim: true,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        trim: true,
        required: true


    },
    category:{
        type: String,
        required: true
    },
    image:{
        type: Object,
        required: true
    },
    checked:{
        type: Boolean,
        default: false
    },
    sold:{
        type: Number,
        default : 0
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Products", productSchema)