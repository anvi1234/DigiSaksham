var express = require("express");
var fs = require("fs");
var multer=require("multer");
var cors=require("cors");
const path = require('path');
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/*********Provide authentication here******* */
app.use(cors());


/*******


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PATCH,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type , Accept');
  
    next();
  });
**********/
const userResponse = require('./model/response.model');
  /********database connectivity****** */
const dbConfig = require('./dbconfig/userdb');
const mongoose = require('mongoose');

mongoose.connect(dbConfig.url, { useNewUrlParser: true })
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...');
        process.exit();
    });


    /********create schema in database****** */

var nameSchema = new mongoose.Schema({
    UserId:Number,
    fullname:String,
    email:String,
    password:String,
    phoneno:Number,
    passwordconfirm:String,
    teachingid:Number,
    followingId:Number,
    materialId:Number,
    identifyid:Number,
    id:Number,
    name:String,
    categories:String,
    inputfile:String, 
    image:String,
    addonarray:[], 
     addmodule:[],

    havefollowing: String,
    identify: String,
    image:String,
    imagefile:String,
    password: String,
    passwordconfirm: String,
    phonno: Number,
    teachingonline: String,
    trainningmaterial: String,
    coursename:String,
    clientdocument:String,
    ppt:String,
    pdf:String,
    video:String,
    resume:String,
    categories:String,
    coursemodule:String,
    imagePath:String,
    uploadvideofile:String,
    uploadpdffile:String,
    uploadpptfile:String,
    companies:[],
    submodulename:String,
    projectname:String,
    company:String,
    coursemodule:String,
    

  },
{
    collection:"users",
    timestamps:true
}

);
var User = mongoose.model("users", nameSchema);


/****** connect with index.html file***** */

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});




/********uploading image******** */

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "backend/document");
    },
    filename: (req, file, cb) => {
     const name = file.originalname.toLowerCase().split(' ').join('-');
     cb(null, name + '-' + Date.now() + '.' + path.extname(file.originalname));
    }
});
let upload = multer({storage: storage});


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
   
  app.get('/api', function (req, res) {
    res.end('file catcher example');
  });

  app.post('/pdf',upload.single('pdf'), function (req, res) {
     const url = req.protocol + '://' + req.get("host");
      
    var  myData=new User({
        
        imagePath:url + "/backend/document" + req.file.filename
    })
      myData.save();


    if (!req.file) {
      console.log("No file received");
      return res.send({
        success: false
      });
  
    } else {
      console.log('file received');
      return res.send({
        success: true
      })
    }
});




app.post("/userdata", (req, res, next)=> {
 var myData = new User(req.body);
  
     myData.save()
        .then(result => {
          if (result != undefined && result != null && result != '') {
            //API return type (response format)          
            var userResponse = {
                message: "success",
                userId: result.userId,
                statusCode: 200,
                userData: result
            }
            return res.status(200).send({ userResponse });
        }
            
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
        
       
     
       
});


app.post('/login',function(req,res){
User.findOne({email:req.body.email,password:req.body.password})
 .then(result =>{
  if (result != undefined && result != null && result != '') {
    //API return type (response format)              
    var userResponse = {
        message: "success",
        userId: 0,
        statusCode: 200,
        userData: result
    }
    return res.status(200).send({ userResponse });
  }
else{
  console.log("errr");
}
 })
})



app.get("/findbyid",function (req, res) {
  let id = req.params.id;
User.findById(id, function (err, product){
      res.json(product);
  });
});




app.get( "/finddata",function (req, res) {
 User.find(function (err, products){
    if(err){
      console.log(err);
    }
    else {
      res.json(products);
    }
  });
});


app.get('/findbyid' , function (req, res) {
  let _id = req.params._id;
 User.findById(_id, function (err, User){
      res.json(product);
  });
});





    app.post("/update",function(req,res){

      User.findOne({email:req.body.email})
        .then(result=>{
          var myData = new User(req.body);
        myData.save()
        .then(item => {
          res.send("Name saved to database");
          
      })
      .catch(err => {
          res.status(400).send("Unable to save to database");
      });
      
        })

    })




app.listen(port, () => {
    console.log("Server listening on port " + port);
});
