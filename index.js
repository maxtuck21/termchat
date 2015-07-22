var prompt = require('prompt');
var login = require('facebook-chat-api');

prompt.start();

var credentials = {
    properties: {
        email: {
        },
        password: {
            hidden: true
        }
    }
};

var recipient = {name: "recipient", description: "Who would you like to message?"};

prompt.get(credentials, function(err, result) {
    if (err) return console.log("Error: Invalid username or password.");

    login({email: result.email, password: result.password}, function (err, api) {
        if(err) return console.error(err);
        console.log('login success!');
        prompt.get(recipient, function(err, result) {

            api.getUserId(result.recipient, function(err, obj) {
                if(err) return console.error(err);
                api.sendMessage("Test: Message sent from facebook-chat-api", obj[0].uid);
            });
        });
    });
});

