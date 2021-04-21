const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb').ObjectID;

app.use(cors());
app.use(bodyParser.json());


// const uri = "mongodb+srv://<username>:<password>@cluster0.rf1wp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rf1wp.mongodb.net/wolf-solution?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("wolf-solution").collection("service");
  const reviewCollection = client.db("wolf-solution").collection("review");
  const bookingCollection = client.db("wolf-solution").collection("booking");
  
  app.post('/addService',(req,res)=>{
    const service = req.body;
    serviceCollection.insertOne(service)
    .then(result =>{
        res.send(result);
    })
  })

  app.get('/getServices',(req,res)=>{

    serviceCollection.find()
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })
  app.get('/deleteService',(req,res)=>{
    const id = ObjectID(req.query.id)
    console.log(id);
    serviceCollection.deleteOne({_id:id})
    .then(result => res.send(result))
  })

  app.get('/getAllBookings',(req,res)=>{

    bookingCollection.find()
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  
  app.get('/getServiceById/:id', (req,res)=>{
    const id = ObjectID(req.params.id)
    serviceCollection.find({_id:id})
    .toArray((err, documents)=>{
        res.send(documents[0])
        // console.log(documents[0])
    })
  })

  app.post('/addReview',(req,res)=>{
    const review = req.body;
    console.log(review);
    reviewCollection.insertOne(review)
    .then(result =>{
        console.log(result);
        res.send(result);
    })
  })

  app.get('/getReviews',(req,res)=>{

    reviewCollection.find()
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })

  app.post('/addBooking',(req,res)=>{
    const booking = req.body;
    // console.log(booking);
    bookingCollection.insertOne(booking)
    .then(result =>{
        // console.log(result);
        res.send(result);
    })
  })


  app.post('/updateBookingStatus',(req,res)=>{
    const {id,serviceStatus} = req.body;
    const objId = ObjectID(id);
    // console.log(id, serviceStatus);
    bookingCollection.updateOne(
      {"_id":objId},{$set: {"serviceStatus": serviceStatus}}, (error , response ) =>{
        if(err)
          console.log(error);
        if(response){
          res.send(response)
        }
      }
    )
    // .then(result => {
    //   console.log(result);
    // })
    
  })

  app.get('/getBookingsByEmail',(req,res)=>{
    const email = req.query.email;
    console.log(email);
    bookingCollection.find({email:email})
    .toArray((err, documents)=>{
      res.send(documents)
    })
  })
  

});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening`)
})