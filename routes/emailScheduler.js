const SubscribedUser = require('../models/SubscribedUsers')
const router = require('express').Router()
const cron = require("node-cron")
const sendEmail = require('../utils/SendEmail')


router.post('/subscribe',async(req,res)=>{
    try{
        const {email} = req.body;
        const subsribedUser = await SubscribedUser.findOne({email})
        if(subsribedUser) return res.status(400).json({msg: "You have already subscribed"})
        
        const newSubscriber = new SubscribedUser({email})

        await newSubscriber.save()
        res.status(200).json({msg: "You are a subscriber of LAA-PASA now."})
    }catch(err){
        return res.status(500).json({msg: err.message})
    }
})

router.get('/scheduleEmail/:id', async(req,res)=>{
    try{
        const subscriber = await SubscribedUser.findById(req.params.id);
    if(!subscriber) return res.status(404).json({msg:"You are not a subscriber"})


    const {email, createdAt} = subscriber;

    const mailOptions={
        from: "LAA-PASA",
        to: email,
        subject: "LAA-PASA: Weekly Offer announcement",
        html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #555; padding: 50px 20px; font-size: 110%;">
        <h1 style="color: teal">Weekly Offer: 10% discount on Pork Meat</h1>
        <img src="https://images.pexels.com/photos/8477071/pexels-photo-8477071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="LAA-PASA" style="max-width: 100%; height: auto; display: block;  max-height: 300px; border: 2px solid teal">
        <p style="color: #000;">Dear Subscriber,</p>
        <p style="color: #000;">We are delighted to offer you a special discount of 10% on Pork Meat for this week. This offer is exclusively available for our subscribers.</p>
        <p style="color: #000;">Don't miss out on this opportunity to save on your favorite products!</p>
        <a href="/" style="background-color: teal; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 5px;">Visit Homepage</a>
        <p style="color: #000; font-size: 20px;">Hurry up! This offer is valid for a week only.</p>
        </div>
        
        `
    };

    const cronPattern = `*/2 * * * *`; // Run every 5 minutes

    cron.schedule(cronPattern, async () => {
        try {
            await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.html);
            // Optionally, you can return a response here, but since this is scheduled,
            // the response might not be meaningful to the client making the request.
        } catch (err) {
            console.error("Error sending email:", err);
        }
    });
    res.status(200).json(subscriber);


    }catch(err){
        return res.status(500).json({msg:err})
    }
    
})

module.exports = router;