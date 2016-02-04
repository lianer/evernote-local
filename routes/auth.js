var express = require('express');
var router = express.Router();
var Evernote = require('evernote').Evernote;
var api = require('../../evernote-api');

var tokens = {
    token: "",
    secret: "",
    results: ""
};

/* GET home page. */
router.get('/', function(req, res, next) {
    var callbackUrl = 'http://localhost:3003/auth/callback';

    var client = new Evernote.Client({
        consumerKey: api.key,
        consumerSecret: api.secret,
        sandbox: api.sandbox // Optional (default: true)
    });
    client.getRequestToken(callbackUrl, function(err, oauthToken, oauthTokenSecret, results) {
        // store tokens in the session
        // and then redirect to client.getAuthorizeUrl(oauthToken)
        if(err){
            console.log(err);
            res.send("获取授权错误");
            return;
        }

        req.session.oauthToken = oauthToken;
        req.session.oauthTokenSecret = oauthTokenSecret;

        res.redirect(client.getAuthorizeUrl(oauthToken));
    });
});

router.get('/callback', function (req, res, next) {
    var client = new Evernote.Client({
        consumerKey: api.key,
        consumerSecret: api.secret,
        sandbox: api.sandbox // Optional (default: true)
    });

    client.getAccessToken(req.session.oauthToken, req.session.oauthTokenSecret, req.param('oauth_verifier'), function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
        if(error) {
            console.log(error);
            res.send("获取授权错误");
            return;
        }

        req.session.oauthAccessToken = oauthAccessToken;
        req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
        req.session.edamShard = results.edam_shard;
        req.session.edamUserId = results.edam_userId;
        req.session.edamExpires = results.edam_expires;
        req.session.edamNoteStoreUrl = results.edam_noteStoreUrl;
        req.session.edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;

        console.log({
            oauthToken: req.session.oauthToken,
            oauthTokenSecret: req.session.oauthTokenSecret,
            oauthAccessToken: req.session.oauthAccessToken,
            oauthAccessTokenSecret: req.session.oauthAccessTokenSecret,
            edamShard: req.session.edamShard,
            edamUserId: req.session.edamUserId,
            edamExpires: req.session.edamExpires,
            edamNoteStoreUrl: req.session.edamNoteStoreUrl,
            edamWebApiUrlPrefix: req.session.edamWebApiUrlPrefix
        });

        res.redirect('/');
    });
});

router.get('/logout', function (req, res, next) {
    req.session.oauthToken = null;
    req.session.oauthTokenSecret = null;
    req.session.oauthAccessToken = null;
    req.session.oauthAccessTokenSecret = null;
    req.session.edamShard = null;
    req.session.edamUserId = null;
    req.session.edamExpires = null;
    req.session.edamNoteStoreUrl = null;
    req.session.edamWebApiUrlPrefix = null;

    res.redirect('/');
});

module.exports = router;