const http=require ('http')
const { stdout } = require('process')
const hostname='127.0.0.1'
const port=3000
// http.createServer((req,res)=>
// {
//     res.writeHead(200,{'contet-type':'text/plain'})
//     res.write("welcome to http server")
//     res.end()
// }).listen(port,hostname,()=>{
//     console.log(`your server has started on http://${hostname}:${port}`);
    
// })
const readline=require('readline')
const rl=readline.createInterface({
    input:process.stdin,
    output:stdout

})
rl.question('enter your name',(name)=>
{
    console.log(name);
    rl.close()
    
})