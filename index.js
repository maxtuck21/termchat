var login = require('facebook-chat-api');
var inquirer = require('inquirer');
var commander = require('commander');


var credentials = [ {
    name: "email",
    message: "What is your email?"
},
{
    name: "password",
    type: "password",
    message: "What is your password?"
}]


var toSend = [{name: "recipient", message: "Who would you like to message?"}, {name: "message", message: "What is your message?"}];

inquirer.prompt(credentials, function(result) {

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
    inquirer.prompt(toSend, function(result) {
        if(result.recipient.charAt(0) == "-" && result.recipient.charAt(1) == "c") {
            api.getUserId(result.recipient.slice(3), function(err, obj) {
                sendUserLoop(api, obj[0], result.message);
            });
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
        api.sendMessage(message, user.uid);
        sendUserLoop(api, user);
        }
    else {
        api.getUserInfo(user.uid, function(err, obj) {
            if (err) console.error(err);
            var messagePrompt = "Message to " + obj[user.uid].name;
            inquirer.prompt([{name: "message", message: messagePrompt}], function(result) {
                if(result.message.charAt(0) == "-" && result.message.charAt(1) == "h") {sendLoop(api);}
                else {
                    api.sendMessage(result.message, user.uid);
                    sendUserLoop(api, user);
                }
            });
        });
    }
}


