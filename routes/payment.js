const router = require('express').Router()
const Payment = require('../models/Payment')
const User = require('../models/User')
const Product = require('../models/Product')


router.get('/payments', async(req,res)=>{
    try{
        const payments = await Payment.find()
        res.json(payments)

    }catch(err){
        return res.status(500).json({msg: err.message})
    }

})
