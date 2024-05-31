const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true
    },
    cooktime:{
        type: String,
        required: true

    },
    video:{
        type: Object,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Recipe", recipeSchema)