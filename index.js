var prompt = require('prompt');
var login = require('facebook-chat-api');

prompt.start();


prompt.get(['email', 'password'], function(err, result) {
    if (err) return console.log("Error: Invalid username or password.");

    login({email: result.email, password: result.password}, function (err, api) {
        if(err) return console.error(err);
        console.log('login success!');

    });
});

