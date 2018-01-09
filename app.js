////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////DBAPI//////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
var Gun = require('gun');
var gun = Gun({
    file: 'database/data.json',
});
//********************************************************//
function addUpload(magnetLink, title, description, callback){
    var uploads = gun.get('uploads_database');
    uploads.set({
            magnet: magnetLink,
            title : title,
            description : description,
            timestamp: Date.now()
        },
        function(ack)
        {
            callback(ack);
        }
    );
};
//********************************************************//
function getUploadsPaginated(callback){
    //Async -> i dont know how to put a callback into this
    //http://gun.js.org/docs/val.html
    var counter = 0;
    gun.get('uploads_database').map().val(function(data){
        counter++;
        var obj = {
            dbId: data._['#'],
            magnet: data.magnet,
            title: data.title,
            description: data.description,
            timestamp: data.timestamp,
        };
        callback(obj,counter);
    });
};
////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////WEBAPI/////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var fs = require('fs');

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

//********************************************************//
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});
//********************************************************//
app.get('/api/lastestuploads', function(req, res) {
    var obj = {}
    obj.docs = [];
    getUploadsPaginated(function(doc, counter){
        //{ }, req.query.numxpage, req.query.page,
        obj.count = counter;
        obj.docs.push(doc);
        if(counter == req.query.numxpage){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(obj));
        }
    });
});
//********************************************************//
app.post('/api/upload', function(req, res) {
    console.log(req.body.magnet, req.body.title, req.body.description);
    addUpload(req.body.magnet, req.body.title, req.body.description, function(ack){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(ack));
    });
});
//********************************************************//
var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});