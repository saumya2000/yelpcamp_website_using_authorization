var Campground=require("../models/campground");
var Comment=require("../models/comments");

//all the middleware goes here
var middlewareObj={};

middlewareObj.checkCampgroundOwnership=function(req,res,next){
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			res.redirect("back");
		}else{
			//does the user own campground?
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			}else{
				res.redirect("back");
			}
		}
	});	
	}else{
		res.redirect("back");    //go back to previous page
	}
}

middlewareObj.checkCommentOwnership=function(req,res,next){
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}else{
			//does the user own comment?
			if(foundComment.author.id.equals(req.user._id)){
				next();
			}else{
				res.redirect("back");
			}
		}
	});	
	}else{
		res.redirect("back");    //go back to previous page
	}
}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports=middlewareObj;