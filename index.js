const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
        const popularPackages = client.db("medscanDb").collection("popularPackage");
        const recommendation = client.db("medscanDb").collection("recommendations");
        const testCollection = client.db("medscanDb").collection("allTestCollection");
        const districtCollection = client.db("medscanDb").collection
            ("allDistrict");
        const upazilaCollection = client.db("medscanDb").collection
            ("allUpazila");
        const reservationCollection = client.db("medscanDb").collection
            ("allReservation");

        const reportcollection = client.db("medscanDb").collection
            ("report");

        // Api for test
        app.post('/report', async (req, res) => {
            const reservation = req.body;
            const result = await reportcollection.insertOne(reservation);
            res.send(result);
        })
        app.get('/report', async (req, res) => {
            const result = await reportcollection.find().toArray();
            res.send(result)
        })

        app.get('/reportemail', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await reportcollection.find(query).toArray();
            res.send(result);
        })
        app.get('/reportlink', async (req, res) => {
            const link = req.query.link;
            const query = { uniqueLink: uniqueLink }
            const result = await reportcollection.find(query).toArray();
            res.send(result);
        })

        // API for reservation
        app.post('/reservations', async (req, res) => {
            const reservation = req.body;
            const result = await reservationCollection.insertOne(reservation);
            res.send(result);
        })
        app.get('/reservations/:id', async (req, res) => {
            const id = req.params.id;
            const query = { reserveID: id }
            const result = await reservationCollection.find(query).toArray();
            res.send(result);
        })


        app.get('/reservations', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await reservationCollection.find(query).toArray();
            res.send(result)
        })


        app.delete('/reservations/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reservationCollection.deleteOne(query);
            res.send(result);
        })
        app.get('/testemail/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await reservationCollection.findOne(query);
            res.send(result);
        })








        // API for users
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        })
        app.get('/usersemail', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/useremail/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result)
        })

        app.get('/reservationsemail/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        app.put('/usersemail/:email', async (req, res) => {
            try {
                const email = req.params.email;
                const updatedUserData = req.body;
                const query = { email: email };
                const update = { $set: updatedUserData };
                const result = await userCollection.updateOne(query, update);

                if (result.modifiedCount > 0) {
                    res.status(200).send({ success: true, message: 'User data updated successfully' });
                } else {
                    res.status(404).send({ success: false, message: 'User not found' });
                }
            } catch (error) {
                console.error('Error updating user data:', error);
                res.status(500).send({ success: false, message: 'Internal Server Error' });
            }
        });

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

        // -----------------------**********------------------------------------

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

        // -----------------------**********------------------------------------

        // API for popular package

        app.get('/popularPackages', async (req, res) => {
            const result = await popularPackages.find().toArray();
            res.send(result)
        })

        app.get('/popularPackages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await popularPackages.findOne(query);
            res.send(result);
        })

        // -----------------------**********------------------------------------

        // API for recommendations
        app.get('/recommendations', async (req, res) => {
            const result = await recommendation.find().toArray();
            res.send(result)
        })



        // -----------------------**********------------------------------------

        // API for all test 
        app.get('/alltests', async (req, res) => {
            const result = await testCollection.find().toArray();
            res.send(result)
        })
        app.post('/alltests', async (req, res) => {
            const testInfo = req.body;
            const result = await testCollection.insertOne(testInfo);
            res.send(result);
        })

        app.get('/alltests/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await testCollection.findOne(query);
            res.send(result);
        })


        app.delete('/alltests/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await testCollection.deleteOne(query);
            res.send(result);
        })
        app.patch('/alltests/:id', async (req, res) => {
            const item = req.body;
            console.log(item);
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    title: item.title,
                    image: item.image,
                    price: item.price,
                    description: item.description

                }
            }

            const result = await testCollection.updateOne(filter, updatedDoc)
            res.send(result);
        })


        app.post('/updateSlots', async (req, res) => {
            try {
                const { date } = req.body;
                console.log('Received request to update slots for date:', date);

                const query = { 'availableDates.date': date };
                console.log('MongoDB query:', query);

                const update = { $inc: { 'availableDates.$.slots': -1 } };
                console.log('MongoDB update:', update);

                const result = await testCollection.updateMany(query, update);
                console.log('Update result:', result);

                if (result.modifiedCount > 0) {
                    res.send({ success: true });
                } else {
                    res.status(404).send({ success: false, message: "Date not found" });
                }
            } catch (error) {
                console.error("Error updating slots:", error);
                res.status(500).send({ error: "Internal Server Error" });
            }
        });







        // -----------------------**********------------------------------------
        // payment intent
        app.post('/create-payment-intent', async (req, res) => {
            const { price } = req.body;
            const amount = parseInt(price * 100);
            console.log(amount, 'amount inside the intent')

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card']
            });

            res.send({
                clientSecret: paymentIntent.client_secret
            })
        });

        // API for district and upazila

        app.get('/alldistrict', async (req, res) => {
            const result = await districtCollection.find().toArray();
            res.send(result)
        })
        app.get('/allupazila', async (req, res) => {
            const result = await upazilaCollection.find().toArray();
            res.send(result)
        })











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