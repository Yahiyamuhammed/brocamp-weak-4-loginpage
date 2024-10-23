const express = require("express");
const router = express.Router();
router.get('/',(req,res)=>{
    res.end('hi hello')
})
module.exports=router