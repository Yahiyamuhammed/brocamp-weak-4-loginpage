const express = require("express");
const router = express.Router();
const db=require('../config/db')
const currentDate = new Date();

router.get('/',(req,res)=>{
    const currentDate = new Date();
console.log(currentDate); // Example output: 2024-10-23T14:30:00.000Z

    
    res.end('hi hello')

})
router.get('/login', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Prevent caching
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    console.log('login requisted', req.session.admin);

    if (req.session.admin) {
        console.log('session availiable');
        res.redirect('/admin/home')

    }
    else {
        console.log('session not availiable');
        res.render('login', { title: "just an express", login: true ,user:'admin'})
    }

})
router.get('/home',async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // Prevent caching
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    

    if (req.session.admin) {
        var users=await db.get().collection('user').find().toArray()
        console.log(users);
        
        res.render('adminHome',{email:req.session.admin,user:'admin',users})
    }
    else
        res.redirect('/admin/login')
})
router.post('/login',async (req, res) => {
    console.log(req.body.email, req.body.password)

    // db.get().collection('user').insertOne(req.body).then((data)=>{
    //     console.log(data,'data inserted');
        
    // })
    const email=await db.get().collection('admin').findOne({email:req.body.email})
    if(email)
    {
        console.log('email found',email);
        if(email.password==req.body.password)
        {
            req.session.admin = req.body.email
            res.redirect('/admin/home')
            console.log(req.session);
        }
        else
            res.render('login', { title: "just an express", login: false ,user:'admin' })

        
    }
    else {
        res.render('login', { title: "just an express", login: false ,user:'admin' })

    }
})
router.get('/editUser/:id',async(req,res)=>{
    const user= await db.get().collection('user').findOne({_id:new db.ObjectId(req.params.id)})
    res.render('editUser',{user})
})
router.post('/editUser/:id',(req,res)=>{
    try {
        db.get().collection('user').updateOne({_id:new db.ObjectId(req.params.id)},{$set:req.body})
        console.log('updated');
        
        res.redirect('/admin/home')
    }
 catch{
    console.log('Error updating user:', error);
    res.status(500).send('Error updating user');
 }   
})

router.get('/searchUser',async (req,res)=>{
    console.log(req.query.search);
    try{
        const users =await db.get().collection('user').find({name:req.query.search}).toArray()
        console.log(users);
        
    res.render('adminHome',{users})
    }
    catch{

    }
    
})  

router.get('/deleteUser/:id',(req,res)=>{
    db.get().collection('user').deleteOne({_id:new db.ObjectId(req.params.id)})
    res.redirect('/admin/home')
})

router.get('/addUser',(req,res)=>{
    res.render('addUser')
})
router.post('/addUser',async (req,res)=>{
    const data={...req.body,Date:currentDate}

    const email=await db.get().collection('user').findOne({email:req.body.email})
    if(email)
    {
        res.render('addUser', { error: 'Email already exists. Please use a different email.' });
    }
    else
    {
        db.get().collection('user').insertOne(data)
        res.redirect('/admin/home')
    }
    // db.get().collection('user').insertOne(data)
    // res.redirect('/admin/home')
})
router.get('/logout', (req, res) => {
    req.session.admin=null;
    console.log(req.session);

    res.redirect('/admin/login')
})
module.exports=router