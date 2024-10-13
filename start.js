const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const { v4: uuidv4 } = require('uuid')
const session = require('express-session')

const creditianals = {
    id: 'admin@gmail.com',
    pass: 'admin'
}

app.set('view engine', 'ejs')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}))
console.log(session);


app.get('/', (req, res) => {
    res.send('hi hello')
})
app.get('/login', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Prevent caching
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    console.log('login requisted', req.session.user);

    if (req.session.user) {
        console.log('session availiable');
        res.redirect('/home')

    }
    else {
        console.log('session not availiable');
        res.render('login', { title: "just an express", login: true })
    }

})
app.get('/home', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Prevent caching
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.session.user) {
        res.render('home',{email:req.session.user})
    }
    else
        res.redirect('/login')
})
app.post('/login', (req, res) => {
    console.log(req.body.email, req.body.password)

    if (creditianals.id == req.body.email && creditianals.pass == req.body.password) {
        req.session.user = req.body.email
        // res.send('hi hello')
        res.redirect('/home')
        console.log(req.session);
    }
    else {
        // res.render('login',{title:"just an express"})
        // res.send('invalid id or pass')
        res.render('login', { title: "just an express", login: false })

    }
})
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        console.log('logout succesful');


    })
    console.log(req.session);

    res.redirect('/login')
})
app.listen(3000, () => {
    console.log('sever started');

})