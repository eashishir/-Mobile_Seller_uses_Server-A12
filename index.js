const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

// middleware
app.use(cors())
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4qgafns.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
      const categoriesCollection = client.db('myAssignment12').collection('categotires');
      const productsCollection = client.db('myAssignment12').collection('products');
      const bookingCollection = client.db('myAssignment12').collection('booking');
      const usersCollection = client.db('myAssignment12').collection('users');
      
  // firs get category only loaded

      app.get('/categories', async(req,res) => {
        const query = {};
        const category = await categoriesCollection.find(query).toArray();
        res.send(category)
      });

  // second get categories products are loaded

      app.get('/products/:id', async (req, res) => {

        const id = req.params.id;
        const query = { categoryId: parseInt(id) };
        const product = await productsCollection.find(query).toArray();
        res.send(product)
  
      });
// third is post bookings products data

     app.get('/bookings', async(req, res) => {
      const email = req.query.email;
      const query = {email: email}
      const bookings= await bookingCollection.find(query).toArray();
      res.send(bookings);
     })

      app.post('/bookings', async(req,res) => {
        const booking = req.body
        console.log(booking)
        const result = await bookingCollection.insertOne(booking);
        res.send(result);
      });

  //  fourth is users post and save server

  app.post('/users', async(req,res) => {
    const user = req.body
    const result = await usersCollection.insertOne(user);
    res.send(result);
  })
      
    }
    finally {

    }
}
run().catch(console.log)






app.get('/', async (req, res) => {
    res.send('my assignment 12 server is running');
})

app.listen(port, () => console.log(`my assignment 12 running on ${port}`))