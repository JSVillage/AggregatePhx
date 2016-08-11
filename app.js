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
web.post('/New/', function(req, res){
  var title = req.body.title,
      website = req.body.website;
      if(title == "" || typeof title == 'undefined'){
        res.status(400).send("Bad Request");
      } else {
        var newAttraction = new Attraction({
          title : title,
          website: website
        }).save(function(err, attr){
          // res.send(err);
          // console.log(attr);
          res.send('Ok');
        });
      };


  //res.send('Hello Here')
});

web.post('/Vote/:id', function(req, res){

});
