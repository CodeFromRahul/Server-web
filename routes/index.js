var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require("./post");
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const localStrategy = require("passport-local");
const { route, response } = require('../app');
const { profile } = require('console');
passport.use(new localStrategy(userModel.authenticate()));
const upload = require("./multer")

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
  .populate("posts");
  console.log(user);
  res.render("profile",{user})
})
router.get("/feed",isLoggedIn,function(req,res,next){
  res.render("feed");
})
router.post("/upload",isLoggedIn,upload.single("file"), async function(req,res,next){
  if(!req.file){
  return res.status(404).send("no files were uploaded");}

const user = await userModel.findOne({  username:req.session.passport.user});
const post = await postModel.create({
  image: req.file.filename,
  imgText: req.body.filecaption,
  user : user._id
});

user.posts.push(post._id);
await user.save();
res.send("done")
res.send("File is uploaded successfully");

});

module.exports = router;
