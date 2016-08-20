var cities = [
	'Phoenix',
	'Glendale',
	'Suprise',
	'Mesa',
	'Tempe',
	'Scottsdale',
	'Peoria',
	'Goodyear'
],
cheerio = require("cheerio"),
request = require("request"),
http = require('http'),
moment = require('moment');

function urlParse(Start, BeginDate, EndDate){
	return "https://www.yelp.com/events/phoenix/browse?start_date="+ BeginDate +"&end_date="+ EndDate +"&start=" + Start
};

startDate = moment().format('YYYYMMDD');
endDate = moment().add(7,'d').format('YYYYMMDD');

for (var incrementPage = 0; incrementPage <= 60; incrementPage = incrementPage + 15) {
	var url = urlParse(incrementPage, startDate, endDate);
	request(url, function(error, response, body){
		if(!error){
			var $ = cheerio.load(body, {decodeEntities: false}),
				results = $(".card");

			$(results).each(function(i, result){
				//Get the website and loop through each one
				var website = $(result).find('[itemprop="url"]').attr('href');
				website = 'https://www.yelp.com' + website;

				processWebsite(website);
			});
		}
	});
};


function processWebsite(website){
	request(website, function(err, webResponse, webBody){
		var $ = cheerio.load(webBody, {decodeEntities: false}),
			title = $('h1[itemprop="name"]').html(),
			tags = $('.category-str-list>a').html(),
			photo = $('.photo-box-img').attr('src').replace('60s', '300s').replace('//', ''),
			address = $('span[itemprop="streetAddress"]').html(),
			city = $('span[itemprop="addressLocality"]').html(),
			state = 'AZ',
			zip = $('span[itemprop="postalCode"]').html(),
			startTime = $('meta[itemprop="startDate"]').attr('content'),
			description = $('p[itemprop="description"]').html();

			var split = moment(startTime);

			var dateSetup = split.format('MM/DD/YYYY'),
				timeSetup = split.format('hh:mm A');

			photo = 'http://' + photo;
			tags += ', Event';

				var data = {
					'title':title,
					'tags':tags,
					'address' : address.Address + ' ' + address.City + ', ' + address.State + ' ' address.Zip,
					'city' : city,
					'state' : state,
					'zip' : zip,
					'expires' : dateSetup,
					'time' : timeSetup,
					'date' : dateSetup,
					'image' : photo,
					'source' : 'yelp.com',
					'website' : website,
					'description' : description
				};

			 processRequest(data);
	});
};

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
