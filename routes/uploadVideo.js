const router = require('express').Router()
const cloudinary = require('cloudinary').v2
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

router.post('/uploadVideo', (req,res)=>{
    try{
        console.log(req.files)
        if(!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({msg: 'No files were uploaded.'})
    
        const file = req.files.file;
        if(file.size > 1024*1024*100) { // Assuming max video size is 50MB
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "Size too large"})
        }

        if(file.mimetype !== 'video/mp4' && file.mimetype !== 'video/webm' && file.mimetype !== 'video/quicktime'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "File format is incorrect."})
        }

        cloudinary.uploader.upload(file.tempFilePath, {resource_type: "video", folder: "Laa-pasa"}, async(err, result)=>{
            if(err) throw err;

            removeTmp(file.tempFilePath)

            res.json({public_id: result.public_id, url: result.secure_url})
        })

        
    }catch(err){
        res.status(500).json({msg: err.message})
    }
})

router.post('/destroyVideo', (req, res) =>{
    try {
        const {public_id} = req.body;
        if(!public_id) return res.status(400).json({msg: 'No videos Selected'})

        cloudinary.uploader.destroy(public_id, {resource_type: "video"}, async(err, result) =>{
            if(err) throw err;

            res.json({msg: "Deleted Video"})
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
    
})

const removeTmp = (path) =>{
    fs.unlink(path, err=>{
        if(err) throw err;
    })
}

module.exports = router
