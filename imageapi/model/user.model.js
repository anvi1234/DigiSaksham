var mongoose=require("mongoose");

var nameSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
 
 },
 {
  collection:"User",
  timestamps:true
})

 

module.exports=mongoose.model('User',nameSchema);
 