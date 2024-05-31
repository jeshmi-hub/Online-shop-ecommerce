const User = require('../models/User')
const Token = require('../models/token')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/SendEmail')
const router = require("express").Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const ResetPassToken = require('../models/resetPassToken');

const signToken = id => {
    return jwt.sign({id}, "secret", {expiresIn: "1h"})
}

const tokenResponse = (user, statuscode, res) => {
    const token = signToken(user._id)
    res.status(statuscode).json({
        Status: "success",
        token,
        data: {
            user: user
        }
    })
}

const resetPassTokenResponse = (user, statuscode, res)=>{
    const token = signToken(user._id)
    res.status(statuscode).json({
        Status: "success",
        token,
        data:{
            user:user
        }
    })
}



router.post("/register", async(req,res)=>{
    const registerResponse = req.body
    const existingUser = await User.findOne({email: registerResponse.email})
 
    if(!existingUser){
        try{
            if(registerResponse.password === registerResponse.confirmPassword){
                registerResponse.password = bcrypt.hashSync(registerResponse.password, 12)
                registerResponse.confirmPassword = bcrypt.hashSync(registerResponse.confirmPassword, 12)
                const registration = await new User(registerResponse).save()

                //code for email not verified

                if(registration.verified === false){  //checking if the use is verified
                    let tokens = await Token.findOne({userId: registration._id});  //finding the user based on its ID from Token
                    if(!tokens){ //Checking if token is available
                        tokens = await new Token({  //creating the new token for the user
                            userId: registration._id,  //giving user the ID
                            token: crypto.randomBytes(32).toString('hex')  //creating random token using the crypto package
                        }).save()

                        
                        const url = `${process.env.BASE_URL}api/users/${registration._id}/verify/${tokens.token}`
                        // const url = `/${registration._id}/verify/${tokens.token}`
                        console.log(url)
                        const accesstoken = createAccessToken({id:registration._id});
                        const refreshtoken = createRefreshToken({id: registration._id});
                        res.cookie('refreshtoken', refreshtoken,{
                            httpOnly: true,
                            path: '/api/refresh_token',
                            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                        })
                        const mailOptions = {
                            from: "LAA-PASA",
                            to: "Verify Email first",
                            subject: "To verify email to create account",
                            html: `
                            <div style="max-width: 700px; margin:auto; border: 10px solid #555; padding: 50px 20px; font-size: 110%;">
                              <h1 style="color: teal">Welcome to LAA-PASA!</h1>
                              <img src="https://images.pexels.com/photos/14493876/pexels-photo-14493876.jpeg" alt="LAA-PASA" style="max-width: 100%; height: auto; display: block;  max-height: 300px; border: 2px solid teal">
                              <p style="color: #000;">Thank you for registering with us. To complete your registration, please verify your email by clicking the button below:</p>
                              <a href="${url}" style="background-color: teal; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 5px;">Verify Email</a>
                              <p style="color: #000;">If you did not register with LAA-PASA, please ignore this email.</p>
                              </div>
                            `
                          };
                        await sendEmail(registration.email, mailOptions.subject,mailOptions.html)
                        console.log("Email has been sent for verification")
                        return res.json({accesstoken,msg:"Email has been send for verification"})
                    }
                }

                tokenResponse(registration, 200, res)
            }
        }catch(err){
          return res.status(500).json({msg:err})
        }
    }else{
        return res.json("User Already exist")
    }
   
})

router.post("/login", async(req,res)=>{
    const loginObject = {
        email: req.body.email,
        password: req.body.password
    }
    if(!loginObject.email || !loginObject.password){
        return res.status(500).json("Input all fields")
    }
    const existingUser = await User.findOne({email: loginObject.email})
    if(!existingUser){
        return res.status(500).json("Register First")
    }
    else{
        try{
            if (existingUser.password, bcrypt.compareSync(loginObject.password, existingUser.password)){
                if(existingUser.verified === false){
                    return res.status(400).json("Verify user First")
                } else {
                 const accesstoken = createAccessToken({ id: existingUser.id });
                const refreshtoken = createRefreshToken({ id: existingUser.id });
          
                res.cookie('refreshtoken', refreshtoken, {
                  httpOnly: true,
                  path: '/api/refresh_token',
                  maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                return res.json({refreshtoken, accesstoken, msg:"Logged in successfully"}); 
                }
            }else{
                return res.status(400).json("Incorrect password");
            }
        }catch(err){
            res.json(err.message)
        }
       // return res.status(200).json({msg:"Logged in"})
    }
})

router.get('/users/:id/verify/:token', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(400).json({ message: "Invalid user link" })
        } 

        const token = await Token.findOne({userId: req.params.id, token: req.params.token})

        if(!token){
            return res.status(400).json({ message: "Invalid token link" })
        }

        await Token.deleteOne({ _id: token._id }) // Remove the token from the database

        // Alternatively, you can use token.remove() if token object has a remove method available
        // await token.remove()

        await User.findByIdAndUpdate(req.params.id, {verified: true})
        res.status(200).json("Email verified successfully")
    } catch(err) {
        console.error("Error verifying email:", err.message)
        console.error("Error stack trace:", err.stack)
        res.status(500).json({ message: "Internal Server Error", error: err.message })
    }
})



router.get('/refresh_token', async(req,res)=>{
    try {   
        const rf_token = req.cookies.refreshtoken;
        console.log("refresh token",rf_token)
        if(!rf_token) return res.status(400).json({msg: "Please Login or Register"})

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
            if(err) return res.status(400).json({msg: err})
            const {id} = user

            const accesstoken = createAccessToken({id})
            console.log({id})

            return res.json({accesstoken, refreshtoken: rf_token})
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

router.get('/logout', async(req,res)=>{
    try{
        res.clearCookie('refreshtoken', {path:'/api/refresh_token'})
        return res.json({msg: "Logged out"})
      }catch(err){
        return res.status(500).json({msg:err.message})
      }
})

router.get('/getUser', auth, async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password -confirmPassword')
        if(!user) return res.status(400).json({msg: "User does not exist."})

        res.json(user)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

router.get('/allUsers', auth, authAdmin, async(req,res)=>{
    try{
        const user = await User.find().select('-password -confirmPassword')
        console.log(user)
        if(user){
            
        res.json(user);
    }
        
        else{
            res.status(400).json({message:"no users"})
        }
    }catch(err){
        res.status(404).json({message:err.message})
    }


})

router.get('/getOneUser/:id', auth, async(req,res)=>{
    try {
        const user = await User.findById(req.params.id).select('-password -confirmPassword')
        if(!user) return res.status(400).json({msg: "User does not exist."})

        res.json(user)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

router.put("/updateUser/:id", auth, async(req,res)=>{
    try{
        const {username, image} = req.body;
        if(!image)
        return res.status(400).json({msg: "No image Uploaded"});
       
            await User.findByIdAndUpdate({_id: req.params.id},{
            username, image})


        res.status(200).json({msg: "User updated"});

        
    
    }catch(err){
        return res.status(500).json({msg: err.message})
    }
})

router.patch('/cart',auth, async(req,res)=>{
    try{
        const user = await User.findById(req.user.id)
        if(!user)return res.status(400).json({msg: "User does not exist"})

        await User.findByIdAndUpdate({_id: req.user.id},{
            cart: req.body.cart
        })
        return res.json({msg: "Added to cart"})

    }catch(err){
        return res.status(500).json({msg: err.message})

    }

})

router.get('/user/:userId/cart', auth,authAdmin, async(req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.cart);

    }catch(err){
        console.error(err);
        res.status(500).json({msg: 'Server Error' });

    }
})

router.get('/userCart/:userId/cart',auth,async(req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.cart);

    }catch(err){
        console.error(err);
        res.status(500).json({msg: 'Server Error' });

    }
})

router.post('/reset-password', async (req, res) => {
        const { userEmail } = req.body; // Destructure userEmail from req.body
        const existingUser = await User.findOne({ email: userEmail });
        if(existingUser){
            try{
                let tokens = await ResetPassToken.findOne({userId: existingUser._id})
                if(!tokens){
                    tokens = await new ResetPassToken({
                        userId: existingUser._id,
                        token: crypto.randomBytes(32).toString('hex')
                    }).save()

                    const url = `http://localhost:8000/api/reset-password/${existingUser._id}/reset/${tokens.token}`
                    console.log(url)

                    const mailOptions={
                        from: "LAA-PASA",
                        to: "Reset-Password",
                        subject: "Reset your account Password",
                        html:`
                        <div style="max-width: 700px; margin:auto; border: 10px solid #555; padding: 50px 20px; font-size: 110%;">
                        <h1 style="color: teal">Reset Your Password</h1>
                        <img src="https://images.pexels.com/photos/14493876/pexels-photo-14493876.jpeg" alt="LAA-PASA" style="max-width: 100%; height: auto; display: block;  max-height: 300px; border: 2px solid teal">
                        <p style="color: #000;">To reset your password, please click the button below:</p>
                        <a href="${url}" style="background-color: teal; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 5px;">Reset Password</a>
                        <p style="color: #000;">If you did not made this request to reset password for LAA-PASA, please ignore this email.</p>
                        </div>
                        `

                    };

                    await sendEmail(existingUser.email, mailOptions.subject, mailOptions.html)
                    console.log("Email has been sent for password reset")
                    return res.json({msg: "Email has been sent for password reset"})

                }
                resetPassTokenResponse(existingUser, 200, res)


            }catch(err){
                return res.status(500).json({msg:err})

            }
        }
})


router.get('/reset-password/:id/reset/:token', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(400).json({message: "Invalid reset link"})
        }

        const token = await ResetPassToken.findOne({userId: req.params.id, token: req.params.token})
        if(!token){
            return res.status(400).json({message: "Invalid reset token"})
        }

        await ResetPassToken.deleteOne({_id: token._id})
        return res.status(200).json("reset pass token found")

    }catch(err){
        console.error("Error verifying email:", err.message)
        console.error("Error stack trace:", err.stack)
        res.status(500).json({ message: "Internal Server Error", error: err.message })

    }
})

router.post('/resetPass/:id', async(req,res)=>{

    try{
        const {newPassword, newconfirmPassword} = req.body
        if(newPassword===newconfirmPassword){
            const hashPassword = bcrypt.hashSync(newPassword,12);
            const hashConfirmPassword = bcrypt.hashSync(newconfirmPassword,12);
            const user = await User.findById(req.params.id)
            if(!user){
            return res.status(400).json({message: "User not found"})
            }

                await User.findByIdAndUpdate(req.params.id, {password: hashPassword, confirmPassword: hashConfirmPassword})
                res.status(200).json("Password reset successfully")
        }else{
            return res.status(400).json({msg: "Password and confirmPassword does not match"})
        } 
    }catch(err){
        console.error("Error verifying email:", err.message)
        console.error("Error stack trace:", err.stack)
        res.status(500).json({ message: "Internal Server Error", error: err.message })

    }
})






const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}



module.exports = router;
