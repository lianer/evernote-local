var express = require('express');
var router = express.Router();
var Evernote = require('evernote').Evernote;
var api = require('../../evernote-api');

var auth = function (req, res, next) {
    req.session.oauthToken = 'lianer.152AA3871C9.687474703A2F2F6C6F63616C686F73743A333030332F617574682F63616C6C6261636B.9FF1F086500B8307593BBBF1A0DD1F02';
    req.session.oauthTokenSecret = '9F5592E5D44F00725D965A638AF247D3';
    req.session.oauthAccessToken = 'S=s1:U=920e1:E=15a01e9a96a:C=152aa3879f0:P=185:A=lianer:V=2:H=2e28d7f3b72470a8f386c8d05b33a700';
    req.session.oauthAccessTokenSecret = '';
    req.session.edamShard = 's1';
    req.session.edamUserId = '598241';
    req.session.edamExpires = '1486090774890';
    req.session.edamNoteStoreUrl = 'https://sandbox.evernote.com/shard/s1/notestore';
    req.session.edamWebApiUrlPrefix = 'https://sandbox.evernote.com/shard/s1/';

    next();
};


/* GET home page. */
router.get('/', [auth], function(req, res, next) {
    res.render('index', {
        title: '印象笔记'
    });
});

router.get('/notestore', [auth], function (req, res, next) {
    var token = req.session.oauthAccessToken;
    var client = new Evernote.Client({
        token: token,
        sandbox: api.sandbox
    });
    var noteStore = client.getNoteStore();

    noteStore.listNotebooks(function(err, notebooks) {
        if(err){
            res.json({
                err: 1,
                message: '获取笔记错误'
            })
            return;
        }
        res.json({
            err: 0,
            message: '获取笔记成功',
            data: notebooks
        });
    });
});



module.exports = router;
