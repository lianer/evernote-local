(function () {
    var query = location.search.slice(1);

    query = QS(query).getAll();
    if(query["oauth_verifier "] && query["oauth_token"]){
        callbackAuth(query["oauth_verifier "], query["oauth_token"]);
    }
    else{
        gotoAuth();
    }

    function gotoAuth() {
        var hostName = "https://sandbox.evernote.com";
        var options, oauth;
        options = {
            consumerKey: "lianer",
            consumerSecret: secret,
            callbackUrl: "http://localhost:3003",
            signatureMethod: "HMAC-SHA1",
        };
        oauth = OAuth(options);
        oauth.request({
            method: "GET",
            url: hostName + "/oauth",
            success: function (token, secret) {
                console.log(token, secret);
                // location.href = hostName + "/OAuth.action?oauth_token=" + token;
            },
            failure: function () {
                console.log("操作异常");
            }
        });
    }

    function callbackAuth(verifier, token) {
        
    }
})();




