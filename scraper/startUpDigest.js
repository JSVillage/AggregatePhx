var PublicGoogleCalendar = require('public-google-calendar'),
	_ = require('lodash'),
	moment = require('moment'),
	request = require('request'),
	publicGoogleCalendar = new PublicGoogleCalendar({ calendarId: 'startupdigest.com_4aq2skojomd9esa9g0hffl32mc@group.calendar.google.com' });
  
publicGoogleCalendar.getEvents(function(err, events) {
  if (err) { return console.log(err.message); }
  _.each(events, function(event, i){


	var split = moment(event.start);

	var dateSetup = split.format('MM/DD/YYYY'),
		timeSetup = split.format('hh:mm A');
	

	var data = {
		title : event.summary,
		tags : 'Event, Tech',
		expires : dateSetup,
		date : dateSetup,
		time : timeSetup,
		source : 'https://www.startupdigest.com/digests/phoenix',
		description : event.description,
		address : event.location
	};
	//console.log(data)
	processRequest(data);
  })
});

function processRequest(data){
	request.post(
	    'http://www.aggregatephx.com/New/',
	    { form: data },
	    function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log(body)
	        }
	    }
	);
}

/**

<iframe src='https://www.google.com/calendar/embed?src=startupdigest.com_4aq2skojomd9esa9g0hffl32mc@group.calendar.google.com&ctz=America/Phoenix'style=border=0 frameborder=0 height=800 width=100%25 scrolling='no'></iframe>
<p class="submit-event"><a href="/digests/phoenix/submit-event">

**/