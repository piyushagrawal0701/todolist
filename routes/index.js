var express = require('express');
var router = express.Router();


const passport = require('passport');
const userModel = require('./users'); 
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

// SIGN UP ROUTE 
router.post('/register', function(req, res){
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret
  });

  userModel.register(userdata, req.body.password)
  .then(function(registereduser){
    passport.authenticate("local")(req,res, function(){
      res.redirect('/profile');
    })
  })
});

// LOGIN IN ROUTE 
router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/signup"
}), function(req, res) {})

// LOG OUT ROUTE 
router.get('/logout', function(req,res, next){
  req.logout(function(err){
    if (err){
      return next (err);

    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}




/* SIGN UP PAGE. */
router.get('/signup', function(req, res, next) {
  res.render('signup.ejs');
});

/* LOGIN PAGE. */
router.get('/loginpage', function(req, res, next) {
  res.render('login.ejs');
});

module.exports = router;
