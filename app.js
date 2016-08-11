var web = require('express')(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

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

var Attraction = mongoose.model('Attraction', attractionSchema);




mongoose.connect('mongodb://localhost:27017/aggregatephx', function(err, database){
  web.listen('8080', function(){
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

});

web.post('/New/', function(req, res){

});

web.post('/Vote/:id', function(req, res){

});
