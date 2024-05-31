const User = require('../models/User')
const Review = require('../models/Review')
const router = require('express').Router()


router.post("/postReview/:id", async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user) return res.status(400).json({msg:"User not found"})
        const {review,rating} = req.body;

        const userReview = await new Review({userId: user._id, username: user.username, image: user.image,review, rating}).save()

        return res.status(200).json({msg: "Review posted"})

    }catch(err){
        return res.status(400).json({msg: "You've already reviwed this website"})

    }

})

router.get("/reviews", async(req,res)=>{
    try{
        const reviews = await Review.find();
        if(!reviews) return res.status(400).json({msg: "No reviews found"})

        return res.status(200).json(reviews)
    }catch(err){
        return res.status(400).json({msg: err})

    }
})

router.delete("/review/:id", async(req,res)=>{
    try{
        await Review.findByIdAndDelete(req.params.id)
        return res.status(200).json({msg: "Deleted a review"})

    }catch(err){
        return res.status(500).json({msg: err.message})

    }
})

module.exports = router