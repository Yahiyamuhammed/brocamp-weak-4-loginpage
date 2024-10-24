// const { Router } = require("express");
const express = require("express");
const router = express.Router();
// const {connectToDb}=require('../config/db')
// const db = await connectToDb();
const db=require('../config/db')

router.get('/', (req, res) => {
    res.send('hi hello')
})
router.get('/login', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Prevent caching
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    console.log('login requisted', req.session.user);

    if (req.session.user) {
        console.log('session availiable');
        res.redirect('/user/home')

    }
    else {
        console.log('session not availiable');
        res.render('login', { title: "just an express", login: true ,user:'user'})
    }

})
router.get('/home', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Prevent caching
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.session.user) {
        res.render('home',{email:req.session.user})
    }
    else
        res.redirect('/user/login')
})
router.post('/login',async (req, res) => {
    console.log(req.body.email, req.body.password)

    // db.get().collection('user').insertOne(req.body).then((data)=>{
    //     console.log(data,'data inserted');
        
    // })
    const email=await db.get().collection('user').findOne({email:req.body.email})
    if(email)
    {
        console.log('email found',email);
        if(email.password==req.body.password)
        {
            req.session.user = req.body.email
            res.redirect('/user/home')
            console.log(req.session);
        }
        else
            res.render('login', { title: "just an express", login: false ,user:'user'})

        
    }
    else {
        res.render('login', { title: "just an express", login: false, user:'user' })

    }
})
router.get('/signup',(req,res)=>{
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Prevent caching
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    console.log('login requisted', req.session.user);

    if (req.session.user) {
        console.log('session availiable');
        res.redirect('/user/home')

    }
    else
        res.render('signup' ,{ title: "just an express", signup: true })
})
router.post('/signup',async (req,res)=>{
    const currentDate = new Date();
    // console.log(currentDate); // Example output: 2024-10-23T14:30:00.000Z

    const email=await db.get().collection('user').findOne({email:req.body.email})
    if(email)
        res.render('signup' ,{ title: "just an express", signup: false })
    else
    {
        const data={...req.body,Date:currentDate,status:'Active'}
        db.get().collection('user').insertOne(data).then((data)=>{
        req.session.user = req.body.email
        console.log(data,'data inserted');
        res.redirect('/user/home')
    })
    }
})

router.get('/logout', (req, res) => {
    req.session.user=null
    console.log(req.session);

    res.redirect('/user/login')
})

module.exports=router