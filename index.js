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

var toSend = {properties: {recipient: {description: "Who would you like to message?"}, message:{ description: "What is your message?"}}};

prompt.get(credentials, function(err, result) {
    if (err) return console.log("Error: Invalid username or password.");

    login({email: result.email, password: result.password}, function (err, api) {
        api.setOptions({logLevel: "silent"});
        if(err) return console.error(err);
        console.log('login success!');
        api.listen(function(err, message) {
            console.log(message.sender_name + ": " + message.body) 
        });
        sendloop(api);
    });
});

var sendloop = function(api) {
    prompt.get(toSend, function(err, result) {
        api.getUserId(result.recipient, function(err, obj) {
            if(err) console.error(err);
            else api.sendMessage(result.message, obj[0].uid);
            sendloop(api);
        });
    });
}
