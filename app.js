const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Listing=require('./models/listing.js');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const cors=require("cors");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connection Successful");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.use(cors());
app.set('view engine',"ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get('/',(req,res)=>{
    res.send('hi im root');
})

// app.get("/testListing",async(req,res)=>{
//     const sampleListing =new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:7000,
//         location:"Calangute,Goa",
//         country:"India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });
//index Route
app.get('/listings',async(req,res)=>{
    const alllist=await Listing.find({});
    res.render("listings/index",{alllist});

});

//NEW -> id route se phele to avoid conflicts
app.get('/listing/new',(req,res)=>{
    res.render('listings/new');
})

// show Route
app.get('/listings/:id',async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render('listings/show',{listing});
});





//create Route

app.post('/listing',async(req,res,next)=>{
    try{
    //1st method
    //const {title,description,price,image,country,location}=req.body;
    let newListing=new Listing(req.body.listing);   //we set name as listing[title]
    await newListing.save();
    //console.log(newListing);
    res.redirect('/listings');
    }
    catch(err){
        next(err);
    }
});

app.delete('/listing/:id',async(req,res)=>{
    let {id}=req.params;
    let deletedList=await Listing.findByIdAndDelete(id);
    console.log("Deleted",deletedList);
    res.redirect('/listings');

})
//Update 
app.put('/listings/:id',async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//edit Route
app.get("/listing/:id/edit", async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
});




//delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedList=await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings")
});
//error handlier
app.use((err,req,res,next)=>{
    res.send("something went wrong");
    next();
});
app.listen(8080,()=>{
    console.log("server on 8080",`${"http://localhost:8080/listings"}`);
})