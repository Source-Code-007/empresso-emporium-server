const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 7000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.iw4kl2c.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const coffeesDB = client.db('coffeesDB').collection('coffees')

        app.post('/addCoffee', async (req, res) => {
            const newCoffee = req.body
            // console.log(newCoffee);
            const result = await coffeesDB.insertOne(newCoffee);
            res.send(result)
        })

        app.put('/update-coffee/:id', async (req, res) => {
            const uniqueId = req.params.id
            const updatedCoffee = req.body
            const { name, chef, supplier, price, category, details, photo } = updatedCoffee
            const query = { _id: new ObjectId(uniqueId) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name, chef, supplier, price, category, details, photo
                }
            }
            const result = await coffeesDB.updateOne(query, updatedDoc, options)
            res.send(result)
        })

        app.get('/coffee/:id', async (req, res) => {
            const uniqueId = req.params.id
            const query = { _id: new ObjectId(uniqueId) }
            const loadedCoffee = await coffeesDB.findOne(query)
            res.send(loadedCoffee)
        })

        app.get('/coffees', async (req, res) => {
            const coffeesData = await coffeesDB.find({}).toArray();
            res.send(coffeesData)
        })

        app.delete('/coffee/:id', async(req,res)=>{
            const uniqueId = req.params.id
            const query = {_id: new ObjectId(uniqueId)}
            const result = await coffeesDB.deleteOne(query)
            res.send(result)
        })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('espresso-emporium server is running')
})

app.listen(port, () => {
    console.log('espresso-emporium server is running');
})