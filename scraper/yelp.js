var cities = [
	'Phoenix',
	'Glendale',
	'Suprise',
	'Mesa',
	'Tempe',
	'Scottsdale'
],
cheerio = require("cheerio"),
request = require("request"),
http = require('http');

function urlParse(City,Start){
	return "https://www.yelp.com/search?find_desc=Restaurants&find_loc="+ City +",+AZ&start=" + Start
};

for(var i in cities){
	for (var incrementPage = 0; incrementPage < 70; incrementPage = incrementPage + 10) {
		//console.log(urlParse(cities[i], incrementPage))
		var url = urlParse(cities[i], incrementPage);
		request(url, function(error, response, body){
			if(!error){
				var $ = cheerio.load(body, {decodeEntities: false}),
					results = $(".regular-search-result");
				$(results).each(function(i, result){
					var title = $(result).find('.biz-name > span').html(),
						tags = getTags($, $(result).find('.category-str-list')),
						address = getAddress($, $(result).find('address')),
						photo = $(result).find('.photo-box-img').attr('src').replace('90s', '300s').replace('//', '');
						photo = 'http://' + photo;

					var data = {
						'title':title,
						'tags':tags,
						'address' : address.Address,
						'city' : address.City,
						'state' : address.State,
						'zip' : address.Zip,
						'expires' : null,
						'time' : null,
						'image' : photo
					};
					
					request.post(
					    'http://www.aggregatephx.com/New/',
					    { form: data },
					    function (error, response, body) {
					        if (!error && response.statusCode == 200) {
					            console.log(body)
					        }
					    }
					);
					
				})

				console.log(url);
			}
		});
	}
};

function getTags($, tags){
	var tagList = [];
	$(tags).find('a').each(function(i, tag){
		tagList.push($(tag).html())
	});

	tagList.push('Restaurant');

	return tagList;
}

function getAddress($, address){
	var data = $(address).html(),
		arr = data.split('<br>'),
		ret = {'Address' : '', 'City':'', 'State':'AZ', 'Zip':''},
		test = arr[1].split(', AZ ');

		ret.Address = arr[0].replace('\\n', '').trim();
		ret.City = test[0];
		ret.Zip = test[1];

		return ret;
}
