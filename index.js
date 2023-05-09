const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 6000

app.use(cors())
app.use(express.json())


app.post('/users', (req,res)=>{
    const user = req.body
    console.log(user)
})

app.get('/', (req,res)=>{
    res.send('espresso-emporium server is running')
})

app.listen(port, ()=>{
    console.log('espresso-emporium server is running');
})