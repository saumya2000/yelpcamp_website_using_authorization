var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var localStrategy=require("passport-local");
var methodOverride=require("method-override");
var Campground=require("./models/campground");
var seedDB=require("./seeds");
var Comment=require("./models/comments");
var User=require("./models/user");

//requiring routes
var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");

// seedDB();  //seed the database
mongoose.connect("mongodb://localhost/yelp_camp_v8", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"this is a secret line",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to run in every single route to use currentUser
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});
// Campground.create(
// 	{
// 	name:"saumya gupta",
// 	image:"https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
// 	description:"Lovely atmosphere.I love it."
// 	},function(err,campground){
// 		if(err){
// 			console.log(err);
// 		}
// 		else{
// 			console.log("NEWLY CREATED CAMPGROUND");
// 			console.log(campground);
// 		}

// });

// var campgrounds=[
// 	{name:"saumya gupta",image:"https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg"},
// 	{name:"simran gupta",image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZlpgHFX7cAtY5g-sIKoE_O2VSQgPmCPK5WX1fh57eax9Tlfd3xw"},
// 	{name:"riya jain",image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"}
// 	];

app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);   //append /campgrounds to all the routes in campgroundRoutes
app.use("/",indexRoutes);

app.listen(3000,process.env.IP,function(){
	console.log("The Yelpcamp server has started");
});