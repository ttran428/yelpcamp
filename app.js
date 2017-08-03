var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.Promise = global.Promise; // removes the deprecated promise warning
mongoose.connect("mongodb://localhost/yelp_camp", { useMongoClient: true }); // removes the deprecated open() warning

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
    name:String,
    image: String,
    description:String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {name:"Granite Hill", 
//     image:"http://www.gobroomecounty.com/files/hd/Campground1.jpg",
//     description: "This is a huge granite hll. no bathrooms. No water. Beatufiul"
//     }
//     , function(err, campground) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("newley created campground:");
//             console.log(campground);
//         }
//     });

var campgrounds = [
    {name:"Salmon Creek", image:"https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5253636.jpg"},
    {name:"Granite Hill", image:"http://www.gobroomecounty.com/files/hd/Campground1.jpg"},
    {name: "Mountain Goat's Rest", image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5115588.jpg"}
    
    ];

app.get("/", function(req, res) {
    res.render("landing");
})

//Index:show all campgrounds
//used for collecting data
app.get("/campgrounds", function(req, res) {
       //use db to get all campgrounds instead of array
      Campground.find({}, function(err, allCampgrounds){
          if(err){
              console.log(err);
          } else{
              res.render("index", {campgrounds: allCampgrounds});
          }
        }
      )
});
// Create: add campground to database
//used for sending data
app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc= req.body.description;
    var newCampground = {name:name, image:image, description: desc} //put new campground into campgrounds
    Campground.create(newCampground, function(err, newlyCreated) {  //puts a new campground into model
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds"); //takes back to campgrounds page
        }
    })
})

// NEW: show form to create new cammgpround
//used for the form to submit to campgrounds. convention
app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
})

//Show- shows more info about one campground
//make sure is after other routes or will read id as anything
app.get("/campgrounds/:id", function(req, res){
    //find campground with id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            console.log(err);
        } else{ 
            //shows campground with that that campground
            res.render("show", {campground:foundCampground})//object that sends to ejs file called campground
    }})
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp SErver has started");
})