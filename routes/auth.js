var express = require('express');
var router = express.Router();
var Evernote = require('evernote').Evernote;
var api = require('../../evernote-api');

/* GET home page. */
router.get('/', function(req, res, next) {
    var client = new Evernote.Client({
        consumerKey: api.key,
        consumerSecret: api.secret,
        sandbox: true // Optional (default: true)
    });
    client.getRequestToken('http://localhost:3003', function(err, oauthToken, oauthTokenSecret, results) {
        // store tokens in the session
        // and then redirect to client.getAuthorizeUrl(oauthToken)
        if(err){
            console.log(err);
            return;
        }

        console.log(oauthToken, oauthTokenSecret, results);
    });


    res.send("123");
});

module.exports = router;