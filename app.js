var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    random = require('mongoose-random'),
    mustache = require('mustache-express'),
    moment = require('moment'),
    fs = require('fs');
    var web = express();

web.use(bodyParser.urlencoded({extended:false}));
web.use(bodyParser.json());
web.engine('html', mustache());
web.set('views', __dirname + '/assets')
web.use('/css', express.static('css'));

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
  expires: { type: Date },
  source: String,
  description: String
});

attractionSchema.plugin(random, { path: 'r' });

var Attraction = mongoose.model('Attraction', attractionSchema),
    db = [];
//console.log(process.env.Username)

mongoose.connect('mongodb://'+process.env.Username+':'+process.env.Password+'@ds161255.mlab.com:61255/aggregatephx', function(err, database){
  web.listen(process.env.PORT || 8080, function(){
    console.log(err);
    db = database;
      console.log('Started');
  })
});


//Hello I'm on Site
web.get('/', function(req, res){

  getRandomAttr().then(function(data){
    //console.log(data);

    // format date if available
    if(data[0].date){
      var date = moment(data[0].date);
      data[0].date = date;
      data[0].date.month = date.format('MMM');
      data[0].date.day = date.format('D');
    }


  //Use default bg image if no image is included in document
    if (!data[0].image) {
      data[0].image = 'css/food.png';
    }
//testing source
  //  data[0].source = "This came from Yelp";

    res.render('popup.html', data[0]);
  });

});


function getRandomAttr() {
  return new Promise(function(resolve, reject){
    var attraction = [];
    Attraction.findRandom().limit(1).exec(function (err, attr) {
     if(err) console.log("Nothing returned");
     attraction = attr;
   }).then(function(attraction){
     resolve(attraction);
   })
  });



}

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




web.get('/Search/:tags', function(req, res){
  var searchTags = req.params.tags.split(',').map(function(re){
    return new RegExp(re, 'i');
  });


  var filter = { tags: { $in: searchTags} };
  var proj = {
    title:1,
    website: 1,
    date: 1,
    time: 1,
    tags : 1,
    address : 1,
    image: 1,
    expires: 1
  };
  console.log(searchTags);
  Attraction.findRandom(filter, proj,{ limit: 1 }, function(req, attr){
    console.log('Found ' + (attr == ""));
    if(attr == ""){
      res.status(200).send("No results found for that tag!")
    } else {
      res.status(200).send(JSON.stringify(attr));
    }

  });

});

  web.get('/FindExpired', function(req, res){
    var d = new Date();


    var filter = { expires: { $lt: d} };
    var proj = {
      title:1,
      website: 1,
      date: 1,
      time: 1,
      tags : 1,
      address : 1,
      image: 1,
      expires: 1
    };

    Attraction.find(filter, proj, function(req, attr){
      console.log('Found ' + (attr == ""));
      if(attr == ""){
        res.status(200).send("No results found!");
      } else {
        res.status(200).send(JSON.stringify(attr));
      }

    });
  });

  web.get('/RemoveExpired', function(req, res){
    var d = new Date();


    var filter = { expires: { $lt: d} };


    Attraction.remove(filter, function(req, attr){
      console.log('Found ' + (attr == ""));
      if(attr == ""){
        res.status(200).send("No results found!");
      } else {
        res.status(200).send("Removed Expired Attractions");
      }

    });
  });



/**
  @@URL : localhost:8080/New/
**/


web.post('/New/', function(req, res){
      var data = parseInfo(req);

      if(data.title == "" || typeof data.title == 'undefined'){
        res.status(400).send("Bad Request");
      } else {

        Attraction.find({ 'title': data.title }).count(function (err, res2){
          if(err) console.log(err);
          if(res2 > 0){
            res.status(400).send("Duplicate Submission");
            console.log("Duplicate Submission");
          } else {
            var newAttraction = new Attraction(data).save(function(err, attr){
              // res.send(err);
              // console.log(attr);
              res.send('Ok');
            });
          };

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
