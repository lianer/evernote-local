var qs = require("querystring");
var OAuth = require("xhr");

var hostName = "https://sandbox.evernote.com";
var evernoteAPI = require("../../evernote-api");
var secret = evernoteAPI.secret;

var options = {
    consumerKey: "lianer",
    consumerSecret: secret,
    callbackUrl: "http://localhost:3003",
    signatureMethod: "HMAC-SHA1"
};


function auth() {
    var oauth = OAuth(options);
    console.log(OAuth);

    // oauth.request({
    //     method: "GET",
    //     url: hostName + "/oauth",
    //     success: function (token, secret) {
    //         console.log(token, secret);
    //         // location.href = hostName + "/OAuth.action?oauth_token=" + token;
    //     },
    //     failure: function () {
    //         console.log("操作异常");
    //     }
    // });
}

module.exports={
    auth: auth
};