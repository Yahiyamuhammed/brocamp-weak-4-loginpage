const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const { v4: uuidv4 } = require('uuid')
const session = require('express-session')
const db=require('./config/db')


app.set('view engine', 'ejs')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}))
console.log(session);


const userRoute=require('./router/userRoute')
const adminRoute=require('./router/adminRoute')

app.use('/user',userRoute)
app.use('/admin',adminRoute)

db.connect((err)=>{
    if(err)
        console.log('connection error',err);
    else
        console.log('connection successfull');
        
        
})

app.listen(3000, () => {
    console.log('sever started');

})