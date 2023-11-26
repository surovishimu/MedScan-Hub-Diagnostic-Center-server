const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qqjubfa.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("medscanDb").collection("users");
        const bannerCollection = client.db("medscanDb").collection("banners");

        // API for users
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        })
        app.post('/users', async (req, res) => {
            const users = req.body;
            const query = { email: users.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(users);
            res.send(result);
        })
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })
        app.patch('/users/blockstatus/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: 'block'
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })
        app.patch('/users/activestatus/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: 'Active'
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // API for banners

        app.get('/banners', async (req, res) => {
            const result = await bannerCollection.find().toArray();
            res.send(result)
        })

        app.post('/banners', async (req, res) => {
            const banners = req.body;
            const result = await bannerCollection.insertOne(banners);
            res.send(result);
        })
        app.delete('/banners/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bannerCollection.deleteOne(query);
            res.send(result);
        })
        app.patch('/banners/activestatus/:id', async (req, res) => {
            const id = req.params.id;
            const filterDeactivateAll = { isActive: true };
            const updateDeactivateAll = {
                $set: {
                    isActive: false
                }
            };
            await bannerCollection.updateMany(filterDeactivateAll, updateDeactivateAll);
            const filterActivateSelected = { _id: new ObjectId(id) };
            const updateActivateSelected = {
                $set: {
                    isActive: true
                }
            };

            const result = await bannerCollection.updateOne(filterActivateSelected, updateActivateSelected);
            res.send(result);
        });
        // get active banner
        app.get('/banners/active', async (req, res) => {
            try {
                const activeBanner = await bannerCollection.findOne({ isActive: true });
                res.send(activeBanner);
            } catch (error) {
                console.error('Error retrieving active banner:', error);
                res.status(500).send('Internal Server Error');
            }
        });





        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('MedScan Hub server is running')
})

app.listen(port, () => {
    console.log(`MedScan Hub server is running on port ${port}`);
})