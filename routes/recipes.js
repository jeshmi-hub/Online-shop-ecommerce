const Recipe = require("../models/Recipes")
const router = require("express").Router()
const auth = require("../middleware/auth")
//const authAdmin = require("../middleware/authAdmin")


router.post("/addRecipe", auth, async(req,res)=>{
    try{
        const{title,description,cooktime,video} = req.body;
        if(!video)
        return res.status(400).json({msg: "No video uploaded"})

        const recipe = new Recipe({title,description,cooktime, video})
        await recipe.save()
        return res.status(200).json({msg: "Created a new recipe"})

    }catch(err){
        res.status(500).json({msg:err.message})
    }
})

router.put("/updateRecipe/:id", auth, async(req,res)=>{
    try{
        const{title,description,cooktime,video} = req.body;
        if(!video)
        return res.status(400).json({msg:"No video Uploaded"})

        await Recipe.findByIdAndUpdate({_id: req.params.id}, {title,description,cooktime,video})
        res.status(200).json({msg:"Updated a recipe"})

    }catch(err){
        return res.status(500).json({msg: err.message})

    }
})

router.delete("/deleteRecipe/:id", auth, async(req,res)=>{
    try{
        await Recipe.findByIdAndDelete(req.params.id)
        res.status(200).json({msg: "Delete a recipe"})

    }catch(err){
        return res.status(500).json({msg: err.message})

    }
})

router.get('/recipes',async(req,res)=>{
    try{
        const recipe = await Recipe.find()
        if(!recipe)return res.status(404).json({msg: "Recipes does not exist"})
        res.json(recipe)

    }catch(err){
        return res.status(500).json({msg: err.message})

    }
})

router.get('/recipe/:id',auth, async(req,res)=>{
    try{
        const recipe_id = req.params.id;
        const recipeDetails = await Recipe.findById(recipe_id)
        if(!recipeDetails)return res.status(404).json({msg: "Recipe does not exist"})
        return res.status(200).json(recipeDetails)

    }catch(err){
        return res.status(500).json(err.message)

    }
})


module.exports = router;