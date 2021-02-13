const express = require('express');
const { authToken } = require('../middlewares/auth');
const {ToyModel,validToy} = require("../models/toyModel");
const router = express.Router();

/* search toys */
router.get('/', async (req, res) => {
  let perPage = 10;
  let page = req.query.page;
  let sortQ = req.query.s;
  let ifReverse = (req.query.reverse == "yes") ? -1 : 1 ;
  let searchByParams = {};
  if(req.query.name) searchByParams.name = req.query.name;
  if(req.query.info) searchByParams.info = req.query.info;
    try {
      let data = await ToyModel.find(searchByParams, {date_created: 0, user_id: 0})
      .sort({[sortQ]:ifReverse})
      .limit(perPage)
      .skip(page * perPage)
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
});

/* search between price */
router.get('/prices/', async (req, res) => {
  let perPage = 10;
  let page = req.query.page;
  let sortQ = "price";
  let ifReverse = (req.query.reverse == "yes") ? -1 : 1 ;
    try {
      let data = await ToyModel.find({price: {$gte: req.query.min, $lte: req.query.max}}, {date_created: 0, user_id: 0})
      .sort({[sortQ]:ifReverse})
      .limit(perPage)
      .skip(page * perPage)
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
});

//search by category
router.post("/cat/:catid", async(req,res) => {
  let catid = req.params.catid;
  let page = req.body.page;
  try {
    let data = await ToyModel.find({category:catid}, {date_created: 0, user_id: 0})
    .limit(10)
    .skip(page * 10)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})

//add
router.post("/", authToken , async(req,res) => {
  
  let validBody = validToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let toy = new ToyModel(req.body);
    toy.user_id = req.userData._id;
    await toy.save();
    res.status(201).json(toy);
  } 
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  } 
})

//edit
router.put("/:editId", authToken , async(req,res) => {
  let editId = req.params.editId;
  let validBody = validToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let toy = await ToyModel.updateOne({_id:editId,user_id:req.userData._id},req.body);
    res.json(toy);
  } 
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  } 
})

//delete
router.delete("/:delId", authToken , async(req,res) => {
  let delId = req.params.delId;
  
  try{
    let toy = await ToyModel.deleteOne({_id:delId,user_id:req.userData._id});
    res.json(toy);
  } 
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  } 
})

module.exports = router;
