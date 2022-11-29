const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

const jwt  = require('jsonwebtoken')
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

// middleware
app.use(cors())
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4qgafns.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
  const authHeader =  req.headers.authorization;
  if(!authHeader){
    return res.status(401).send('unauthorized access');
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function(err , decoded){
    if(err){
      return res.status(403).send({message: 'forbiden access'})
    }
    req.decoded = decoded;
    next();
  })
}

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

     app.get('/bookings', verifyJWT,  async(req, res) => {
      const email = req.query.email;
     
      const decodedEmail = req.decoded.email;

      if(email !== decodedEmail){
        return res.status(403).send({message: 'forbidden access'});
      }
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

// jwt token 

  app.get('/jwt',  async(req, res) => {
    const email = req.query.email;
    const query = {email: email};
    const user = await  usersCollection.findOne(query);
    if(user){
      const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn:'1h'})
      return res.send({accessToken: token});
    }
    console.log(user);
    res.status(403).send({accessToken:''})
  });


  app.get('/users', async(req , res) => {
    const query = {};
    const users = await usersCollection.find(query).toArray();
    res.send(users)
  })

  app.post('/users', async(req,res) => {
    const user = req.body
    const result = await usersCollection.insertOne(user);
    res.send(result);
  });

  
      
    }
    finally {

    }
}
run().catch(console.log)






app.get('/', async (req, res) => {
    res.send('my assignment 12 server is running');
})

app.listen(port, () => console.log(`my assignment 12 running on ${port}`))