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
  itemName: {
    type: String,
    required: true,
    // trim: true
  },
  price: {
    type: Number, // Store as number for calculations
    required: true,
    // min: 0
  },
  ingredients: {
    type: String,
    required: true,
    // trim: true
  },
  image: {
    type: String,
    // default: ""
  },
  category: {
    type: String,
    required: true,
    enum: ['starters', 'main-course', 'dessert', 'beverages'],
    lowercase: true,
    // trim: true
  }
});

const menuModel = mongoose.model("menuModel",menuSchema);

const reservationSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  phone:{
    type:Number,
    required:true
  },
  guests:{
    type:Number,
    required:true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  deleteAfter:{
    type : Date,
    index:{
      expires:0
    }
  }
})

const reservationModel = mongoose.model("reservationModel",reservationSchema);


//---------------------------------image endpoint---------------
app.post('/add-item', async(req, res)=>{
  try{
    const {itemName, price, ingredients, image, category} =req.body;
    const newItem= new menuModel({
      itemName,
      price,
      ingredients,
      image,
      category
    })

    await newItem.save();
    res.status(201).json({Message:"Item added"});

  }catch(err){
    console.error("Error in /add-item:", err);  // Logs the exact error in terminal
    res.status(500).json({ message: `Error occurred: ${err.message}`})
  }
})


app.post('/add-reservation', async(req, res)=>{
  try{
    const {name, phone, guests,date,time} =req.body;
    const reservationTime = new Date(`${date}T${time}:00`);

    const deleteAfter = new Date(reservationTime.getTime()+10*1000);
    const newReservation= new reservationModel({
      name,
      phone,
      guests,
      date,
      time,
      deleteAfter
    })

    await newReservation.save();
    res.status(201).json({Message:"Reservation added"});

  }catch(err){
    console.error("Error in /add-reservation:", err);  // Logs the exact error in terminal
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



app.get(`/get-reservation`, async (req,res)=>{
  try{
    const reservationItem = await reservationModel.find();
    res.status(200).json(reservationItem);
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


app.get("/check-reservation", async (req, res) => {
  try {
    const { name, phone, guests, date, time } = req.query;

    const reservation = await reservationModel.findOne({
      name,
      phone,
      guests,
      date,
      time,
    });

    if (reservation) {
      res.json({ exists: true, reservation });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error("Error in check-reservation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/delete-reservation", async (req, res) => {
  try {
    const { name, phone, guests, date, time } = req.body;

    const deleted = await reservationModel.findOneAndDelete({
      name,
      phone,
      guests,
      date,
      time
    });

    if (deleted) {
      res.json({ success: true, message: "Reservation deleted." });
    } else {
      res.json({ success: false, message: "Reservation not found." });
    }
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});


app.get('/reserved-dates', async (req, res) => {
  try {
    const reservations = await reservationModel.find({}, 'date time').lean();

    const dateMap = {};

    for (const reservation of reservations) {
      // Format the date to YYYY-MM-DD
      const dateStr = new Date(reservation.date).toISOString().split('T')[0];
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = [];
      }
      dateMap[dateStr].push(reservation.time);
    }

    // Convert map to array format
    const result = Object.keys(dateMap).map(date => ({
      date,
      times: dateMap[date]
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching reserved dates:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(8000,()=>{
  console.log("listening..")
})
