const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
        
    },
    password:{
        type: String,
        required: true,
    },
    confirmPassword:{
        type: String,
        required: true,
    },
    image:{
        type: Object,
        required: true
    },
    verified:{
        type: Boolean,
        default: false,
    },
    role:{
        type: Number,
        default: 0
    },
    cart:{
        type: Array,
        default: []
    }

},{timestamps: true})

module.exports = mongoose.model('user', userSchema)