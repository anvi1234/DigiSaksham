const user = require("../model/user.model");
const express=require('express');
var app = express();
const router=express.Router();


app.post("", (req, res) => {
    var myData = new user({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
    })

    
    myData.save()
    .then(item => {
    res.send("item saved to database");
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
   });