const Product = require('../models/Product')
const router = require("express").Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin')


class APIfeatures{
  constructor(query, queryString){
      this.query = query;
      this.queryString =  queryString;
  }
  filtering(){
      const queryObj = {...this.queryString} //queryString = req.query
    
      const excludedFields = ['page', 'sort', 'limit']
      excludedFields.forEach(el => delete(queryObj[el]))
      
   
      let queryStr = JSON.stringify(queryObj)
      queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

   //    gte = greater than or equal
   //    lte = lesser than or equal
   //    lt = lesser than
   //    gt = greater than
  
      this.query.find(JSON.parse(queryStr))
      return this;
  }

  sorting(){
      if(this.queryString.sort){
          const sortBy = this.queryString.sort.split(',').join(' ')
          this.query = this.query.sort(sortBy)
      }else{
          this.query = this.query.sort('-createdAt')
      }

      return this;
  } 

  paginating(){
      const page = this.queryString.page * 1 || 1
      const limit = this.queryString.limit * 1 || 9
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit)
      return this;
  }
}



router.post("/addProducts",auth,authAdmin, async(req,res)=>{
  try{
    const {product_id, title, desc, price,category, image} = req.body;
    console.log(image)
    if(!image)
    return res.status(400).json({msg: "No image uploaded"});
    const product = await Product.findOne({product_id})
    if(product)
    return res.status(400).json({msg: "The product already exists"});
    const newProduct = new Product({
      product_id, title, desc, price,category,image
    })

    await newProduct.save();
    return res.status(200).json({msg: "Created a new product"});


  }catch(err){

  }
})

router.put("/updateProduct/:id",auth,authAdmin, async(req,res)=>{
  try{
    const {title, desc, price, category, image}  = req.body;
    if(!image)
    return res.status(400).json({msg: "No image Uploaded"});
    
    await Product.findByIdAndUpdate({_id: req.params.id}, {title,desc,price,category,image})
    res.status(200).json({msg: "Updated a product"})
  }catch(err){
    return res.status(500).json({msg: err.message})

  }

 })

 router.delete('/deleteProduct/:id',auth,authAdmin, async(req,res)=>{
  try{
    await Product.findByIdAndDelete(req.params.id)
    res.status(200).json({msg: "Deleted a product"})

  }catch(err){
    return res.status(500).json({msg: err.message})

  }

 })

 router.get('/product',async(req,res)=>{
  try{
    console.log(req.query);
    const features = new APIfeatures(Product.find(),req.query)
    .filtering().sorting().paginating()
    const products = await features.query
    res.json({status:'success', result: products.length, product: products})

  }catch(err){
    return res.status(500).json({msg: err.message});

  }

 })

 router.get('/product/:id', async(req,res)=>{
  try{
    const prod_id = req.params.id;
    const productDetails = await Product.findById(prod_id)
    if(!productDetails) return res.status(404).json({msg: "Product does not exist"})

    return res.status(200).json(productDetails);

  }catch(err){
    return res.status(500).json(err.message);
  }
 })

 




module.exports = router;


