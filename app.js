var web = require('express')(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    random = require('mongoose-random');

web.use(bodyParser.urlencoded({extended:false}));
web.use(bodyParser.json());

var attractionSchema = mongoose.Schema({
  title:{
      type: String,
      required: true
  },
  website: String,
  date: Date,
  time: String,
  tags : String,
  address : {
      address:String,
      city:String,
      zip:String,
      state:String
  },
  image: String,
  expires: { type: Date }
});

attractionSchema.plugin(random, { path: 'r' });

var Attraction = mongoose.model('Attraction', attractionSchema),
    db = [];





mongoose.connect('mongodb://localhost:27017/aggregatephx', function(err, database){
  web.listen('8080', function(){
    db = database;
      console.log('Started');
  })
});


//Hello I'm on Site
web.get('/', function(req, res){
  res.send('Hello World');
});

/*
  /Random/
  /New/
  /Vote/:id
*/


web.get('/Random', function(req, res){
  var attraction = [];
 Attraction.findRandom().limit(1).exec(function (err, attr) {
  // console.log(attr);
  // res.send("Here's random - " + attr[0].title);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(attr));
  });
});

/**
  @@URL : localhost:8080/New/
**/

//TODO:
web.post('/New/', function(req, res){
      var data = parseInfo(req);

      if(data.title == "" || typeof data.title == 'undefined'){
        res.status(400).send("Bad Request");
      } else {
        var newAttraction = new Attraction(data).save(function(err, attr){
          // res.send(err);
          // console.log(attr);
          res.send('Ok');
        });
      };


  //res.send('Hello Here')
});

web.post('/Vote/:id', function(req, res){

});

function parseInfo(req){
  var data = {
    address : {}
  };

      data.title = req.body.title,
      data.website = req.body.website,
      data.date = req.body.date,
      data.time = req.body.time,
      data.tags = req.body.tags,
      data.address.address = req.body.address,
      data.address.city = req.body.city,
      data.address.zip = req.body.zip,
      data.address.state = req.body.state,
      data.image = req.body.image,
      data.expires = req.body.expires;

  return data;

}

function isDuplicate(doc) {

    Attraction.findOne({ title: doc.title })
}

//TODO - try adding some more features to API - search, duplicates, etc...
