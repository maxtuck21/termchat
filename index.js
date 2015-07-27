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
            console.log("\n");
            console.log(message.sender_name + ": " + message.body) 
        });
        sendLoop(api);
    });
});

var sendLoop = function(api) {
    prompt.get(toSend, function(err, result) {
        if(result.recipient.charAt(0) == "-" && result.recipient.charAt(1) == "c") {
            sendUserLoop(api, result.recipient.slice(3), result.message);
        }
        else {
            api.getUserId(result.recipient, function(err, obj) {
                if(err) console.error(err);
                else api.sendMessage(result.message, obj[0].uid);
                sendLoop(api);
            });
        }
    });
}

var sendUserLoop = function(api, user, message) {
    if(message != null) {
        api.getUserId(user, function(err, obj) {
            if(err) console.error(err);
            else api.sendMessage(message, obj[0].uid);
            sendUserLoop(api, user);
        });
    }
    else {
        var messagePrompt = "Message to " + user;
        prompt.get({name: "message", description: messagePrompt}, function(err, result) {
            if(result.message.charAt(0) == "-" && result.message.charAt(1) == "h") sendLoop(api);
            else api.getUserId(user, function(err, obj) {
                if(err) console.error(err);
                else api.sendMessage(result.message, obj[0].uid);
                sendUserLoop(api, user);
            });
        });
    }
}

