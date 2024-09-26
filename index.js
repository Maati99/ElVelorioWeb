const express = require('express')
const path = require("path");
let indexRouter = require("./routes/index")
let authRouter = require("./routes/auth")
const app = express()
const port = 3000
let sequelize = require("./js/database");
const passport = require('passport');


sequelize.sync(

).then(()=> console.log('db esta on'))

app.set('views',  path.join(__dirname, 'views'))
app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended : false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('express-session')({ secret: 'SECRETKEY', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/", indexRouter)
app.use("/auth", authRouter)
/*
app.get('/', (req, res) => {
  res.render('index', { username: "Usuario Invalido"})
})

app.get('/chat', (req, res) => {
  res.render('chat')
})

app.get('/biblioteca', (req, res) => {
  res.render('biblioteca')
})

app.get('/login', (req, res) => {
  res.render('login')
})*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})