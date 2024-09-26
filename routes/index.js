let express = require('express')
let router = express.Router()

router.get("/", function(req, res, next){
    if(req.user){
        res.render("index", {username: req.user.username })
    }else{
        res.redirect("/auth/login")
    }


})

router.get("/chat", function(req, res, next){
    if(req.user){
        res.render("chat", {username: req.user.username })
    }else{
        res.redirect("/auth/login")
    }


})
  
router.get("/biblioteca", function(req, res, next){
    if(req.user){
        res.render("biblioteca", {username: req.user.username })
    }else{
        res.redirect("/auth/login")
    }


})
  
  router.get('/login', (req, res) => {
    res.render('login')
  })

module.exports = router