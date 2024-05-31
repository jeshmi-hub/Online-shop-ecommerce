const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
dotenv.config();
const productRoute = require('./routes/product');
const upload = require('./routes/upload');
const user = require("./routes/user");
const category = require("./routes/category");
const videoUpload = require("./routes/uploadVideo");
const recipes = require("./routes/recipes");
const uploadUserImage = require("./routes/uploadUserImage");
const axios = require('axios');
const sendEmail = require('./utils/SendEmail');
const subscriber = require("./routes/emailScheduler");
const review = require("./routes/review")


const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend domain
    credentials: true, 
    exposedHeaders: ["set-cookie"]// Allow cookies to be sent with requests
}));
app.use(fileUpload({
    useTempFiles: true
}))


app.use("/api",productRoute);
app.use("/api",upload);
app.use("/api", user);
app.use("/api", category);
app.use("/api", videoUpload);
app.use("/api", recipes);
app.use("/api", uploadUserImage);
app.use("/api",subscriber);
app.use("/api", review);

app.post("/khalti-api", async(req,res)=>{
  const payload = req.body;

  try {

    const khaltiResponse = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/', payload, {
      headers: {
        Authorization:  `Key 1be6ed59a2dd447fac3aeb7170876c48`
      }
    });

    const mailOptions={
      from: "LAA-PASA",
      to : "Confirm Order",
      subject: "Order Confirmation Email",
      html:`
      <div style="max-width: 700px; margin:auto; border: 10px solid #555; padding: 50px 20px; font-size: 110%;">
      <h1 style="color: teal">Your ordered has been confirmed</h1>
      <img src="https://images.pexels.com/photos/4506249/pexels-photo-4506249.jpeg?auto=compress&cs=tinysrgb&w=600" alt="LAA-PASA" style="max-width: 100%; height: auto; display: block;  max-height: 300px; border: 2px solid teal">
      <p style="color: #000;"></p>
      <a href="/" style="background-color: teal; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 5px;">Homepage</a>
      <p style="color: #000; font-size: 20px;">Your order will be delivered to you within today.</p>
      </div>
      
      `
    }

    const {email} = payload.customer_info;
    if (khaltiResponse && khaltiResponse.data) {
      // Call sendEmail function to send confirmation email
      await sendEmail(email,mailOptions.subject,mailOptions.html);
    }

    res.json({
      success: true,
      data: khaltiResponse?.data
    });

  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
});






try {
    mongoose.set('strictQuery', false)
    mongoose.connect(process.env.DBCONNECTION) 
    console.log('Mongo connected')
}
catch(error) {
    console.log(error)
    process.exit()
}

const port = process.env.PORT || 8000

app.listen(port, () =>{
    console.log('server is running on', port)
})
