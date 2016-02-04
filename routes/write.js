var express = require('express');
var router = express.Router();
var Evernote = require('evernote').Evernote;
var api = require('../../evernote-api');

var auth = function(req, res, next) {
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
    res.render('write/write', {
        title: "创建笔记"
    });
});

router.post('/save', [auth], function(req, res, next) {
    var token = req.session.oauthAccessToken;

    if(!token){
        console.log('授权错误');
        res.json({
            err: 1,
            message: '授权错误'
        });
        return;
    }

    var client = new Evernote.Client({
        token: token,
        sandbox: api.sandbox
    });
    var noteStore = client.getNoteStore();

    makeNote(noteStore, '标题', '内容', null, function (err, note) {
        // Something was wrong with the note data
        // See EDAMErrorCode enumeration for error code explanation
        // http://dev.evernote.com/documentation/reference/Errors.html#Enum_EDAMErrorCode
        if(err){
            console.log(err);
            res.json({
                err: 1,
                message: '创建笔记错误'
            });
            return;
        }
        res.json({
            err: 0,
            message: '创建笔记成功',
            data: note
        });
    });

    // 创建笔记
    function makeNote(noteStore, noteTitle, noteBody, parentNotebook, callback) {
        var nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
        nBody += "<en-note>" + noteBody + "</en-note>";

        // Create note object
        var ourNote = new Evernote.Note();
        ourNote.title = noteTitle;
        ourNote.content = nBody;

        // parentNotebook is optional; if omitted, default notebook is used
        if (parentNotebook && parentNotebook.guid) {
            ourNote.notebookGuid = parentNotebook.guid;
        }

        // Attempt to create note in Evernote account
        noteStore.createNote(ourNote, callback);
    }
});



module.exports = router;