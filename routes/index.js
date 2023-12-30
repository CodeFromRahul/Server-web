var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require("./post");
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const localStrategy = require("passport-local");
const { route } = require('../app');
const { profile } = require('console');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
 
  res.render('login',{error:req.flash("error")});
});
router.post("/register", function(req,res){
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });
  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true
}),function(req,res){

})

router.get("/logout", function(req,res){
  req.logOut(function(err){
    if(err){  return next(err);
    }
    res.redirect("/login")
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated())  return next();

  res.redirect("/login");
}

router.get("/profile",isLoggedIn, async function(req,res,next){
  let user = await userModel.findOne({
    username : req.session.passport.user
  })
  res.render("profile",{user})
})
router.get("/feed",isLoggedIn,function(req,res,next){
  res.render("feed");
})

module.exports = router;
