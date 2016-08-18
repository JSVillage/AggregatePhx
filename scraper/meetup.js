function test(){
	test2().then(function(){
		console.log('test')
	}).
	catch(function(){
		console.log('error')
	})

}

function test2(){
	return new Promise((resolve, reject) => {
		return reject()
	});
}

test()