const express = require('express');
const cors= require('cors');
const mongoose= require('mongoose');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());


mongoose.connect("mongodb://127.0.0.1:27017/restaurant_db")
.then(()=>console.log("mongodb running"))
.catch(err=>console.log(`error :${err}`));

// --------------------------------menu---------------------------
const menuSchema = new mongoose.Schema({
  itemName:{
    type:String,
    required:true
  },
  price:{
    type:String,
    required:true
  },
  ingredients:{
    type:String,
    required:true
  },
  image:{
    type:String
  }
})

const menuModel = mongoose.model("menuModel",menuSchema);


//---------------------------------image endpoint---------------
app.post('/add-item', async(req, res)=>{
  try{
    const {itemName, price, ingredients, image} =req.body;
    const newItem= new menuModel({
      itemName,
      price,
      ingredients,
      image
    })

    await newItem.save();
    res.status(201).json({Message:"Item added"});

  }catch(err){
    console.error("Error in /add-item:", err);  // Logs the exact error in terminal
    res.status(500).json({ message: `Error occurred: ${err.message}`})
  }
})

app.get(`/get-item`, async (req,res)=>{
  try{
    const menuItem = await menuModel.find();
    res.status(200).json(menuItem);
  }catch(err){
    res.status(500).json({message:err.message});
  }
})


app.delete(`/delete-menu-item/:id`, async (req, res)=>{
  try{
    const itemId= req.params.id;
    await menuModel.findByIdAndDelete(itemId);

    res.status(200).json({message:`item deleted`})
  }
  catch(err){
    res.status(500).json({message:`error: ${err}`});
  }
})

app.get(`/get-item/:id`, async (req,res)=>{
  try{
    const itemId= req.params.id;
    const menuItem= await menuModel.findById(itemId)

    res.status(200).json(menuItem);
  }catch(err){
    res.status(500).json({message:err.message});
  }
})

app.put(`/edit-menu-item/:id`, async (req, res)=>{
  try{
    const itemId= req.params.id;
    const updatedData= req.body;
    await menuModel.findByIdAndUpdate(itemId, updatedData);

    res.status(200).json({message:`item Edited`})
  }
  catch(err){
    res.status(500).json({message:`error: ${err}`});
  }
})



app.listen(8000,()=>{
  console.log("listening..")
})
