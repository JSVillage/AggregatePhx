var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
  console.log("connected!");

  var attractionSchema = mongoose.Schema({
    title:{ type: String, required: true},
    website: String,
    location: String,
    date: String,
    category: {
      localEvent: Boolean,
      location: Boolean,
      music: Boolean,
      food: Boolean,
      sport: Boolean,
      educational: Boolean,
      kids: Boolean,
      art: Boolean
    },
    image: String,
    expires: { type: Date }
  });

  var Attraction = mongoose.model('Attraction', attractionSchema);

  var expireD = new Date();

  var party = new Attraction({
    title: "Mike's Party",
    location: "Mike's house",
    date: "Monday 8/8/16",
    category: {
      localEvent: true,
      location: false,
      music: true,
      food: false,
      sport: false,
      educational: false,
      kids: false,
      art: false
    },
    expires: "08/01/2016"
  });

  party.save(function(err, partyEvent) {
    if(err) return console.error(err);
    console.log(partyEvent);
  });






});
