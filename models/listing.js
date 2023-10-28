const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/uyyRJA2an4o",
        set:(v)=>
            v===""
            ?"https://unsplash.com/photos/uyyRJA2an4o"
            :v,
    },
    location:String,
    country:String,
    price:Number
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;