let express = require('express')
let router = express.Router()
let passport = require("passport")
let crypto = require("crypto") 
let LocalStrategy = require("passport-local")
const path = require('path');
const { cursorTo } = require('readline');
let User = require("../models/user")


// COMPROBACION DE USUARIO
passport.use(new LocalStrategy(async function verify(username, password, done) {
    try{
        const user = await User.findOne({where: {username: username}})
        if(!user){
            return done(null,false, {message : 'Usuario o contraseña incorrecto'})
        }

        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', async function(err, hashedPassword){
            if(err){ return done(err)}

        if(!crypto.timingSafeEqual(user.password, hashedPassword)){
            return done(null,false, {message : 'Usuario o contraseña incorrecto'})
        }

        return done(null, user)
        })
    }catch(e){
        return done(e);
    }
}))

passport.serializeUser(function(user, done){
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    User.findByPk(id).then(function(user){done(null, user);})
})

//LOGIN
router.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login?failed=1',

}))

router.get("/login", (req, res, next) => {
    const failed = req.query.failed
    res.render("login", {failed:failed})
})

//REGISTRO
router.post('/register',(req, res, next) => {
        let salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword){
            if(err){res.redirect("/auth/registro?failed=1")}
            try{
                const user = await User.create({username: req.body.username, password: hashedPassword, salt: salt})
                res.redirect("/")

                req.login(user, function(err){
                    if(err){
                        res.redirect("/auth/register?failed=3")
                        res.redirect('/')
                    }
                })
            }catch(e){res.redirect('/auth/register?failed=2')}
        })
})

router.get('/register',(req, res, next) => {
    const failed = req.query.failed
    let msg = ""
    switch(failed){
        case "1":
            msg = "FALLO EN EL SERVER"
            break;
        case "2":
            msg = "USUARIO EXISTENTE"
            break;
        case "3":
            msg = "ERROR DE LOGIN PAPU"
            break
    }
    res.render("register", {failed, msg:msg})
})

//DESLOGUEO
router.post("/logout", (req, res, next) =>{
    req.logOut(function(err){
       if(err) {return next(err)}
        res.redirect("/")
    })
})

module.exports = router