////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////DBAPI//////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var fs = require('fs');

var Gun = require('gun');

var latestUploads = [];

var gunOptions = {
  file: 'database/data.json',
  /*peers: ['http://192.168.1.130:8080/gun','http://192.168.1.131:80/gun'],*/
  web: http
}
var gun = Gun(gunOptions);
//********************************************************//
function addUpload(magnetLink, title, description, imgLink, callback){
    var uploads = gun.get('uploads_database');
    uploads.set({
            title : title,
            imgLink : imgLink,
            magnet: magnetLink,
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
function getUploadsByWords(words, callback){
    gun.get('uploads_database').map().val(function(data){
        var obj = {
            dbId: data._['#'],
            magnet: data.magnet,
            title: data.title,
            imgLink: data.imgLink,
            description: data.description,
            timestamp: data.timestamp,
        };
        var retorno = false;
        words.forEach(function(element) {
            if(data.title.includes(name))
                retorno = true;
        }, this);
        if(retorno){
            callback(obj);            
        }
    });
}
//********************************************************//
function getUploads(callback){
    //Async -> i dont know how to put a callback into this
    //http://gun.js.org/docs/val.html
    gun.get('uploads_database').map().val(function(data){
        counter++;
        var obj = {
            dbId: data._['#'],
            magnet: data.magnet,
            title: data.title,
            imgLink: data.imgLink,
            description: data.description,
            timestamp: data.timestamp,
        };
        callback(obj);
    });
};
////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////WEBAPI/////////////////////////////////////////////////////

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

//********************************************************//
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});
app.get('/play', function(req, res){
    res.sendFile(path.join(__dirname, 'views/play.html'));
});
//********************************************************//
app.get('/api/latestuploads', function(req, res) {
    var obj = {}
    obj.docs = latestUploads;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(obj));
});
//********************************************************//
/*app.get('/api/search', function(req, res) {
    var obj = {}
    obj.docs = [];
    var words = req.words.split(" ");
    getUploadsByWords(words,function(doc){
        obj.docs.push(doc);
        if(counter == req.query.numxpage){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(obj));
        }
    });
});*/
//********************************************************//
app.post('/api/upload', function(req, res) {
    addUpload(req.body.magnet, req.body.title, req.body.description, req.body.imgLink, function(ack){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(ack));
    });
});

//Socket.IO configuration
var clients = [];
var update = [];
gun.get('uploads_database').on(function(data, key){
    //gun.get(key).get()
    var puntero = data._['>'];
    var keyNames = Object.keys(puntero);
    update.push(keyNames[0]);
    gun.get(keyNames[0]).val(function(data){
        var obj = {
            dbId: data._['#'],
            magnet: data.magnet,
            title: data.title,
            imgLink: data.imgLink,
            description: data.description,
            timestamp: data.timestamp,
        };
        io.sockets.emit('new', obj);
        latestUploads.push(obj);
        if(latestUploads.length > 20){
            latestUploads.shift();
        }
    });
},true);

//cuando se conecta un cliente nuevo
io.sockets.on('connect', function (socket) {
    clients.push(socket);
    socket.emit("Connected...");
});

io.sockets.on('disconnect', function (socket) {
    socket.emit("Disconnected...");
    clients.splice(clients.indexOf(socket),1);
});
//********************************************************//
/*var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});*/

var server = http.listen(process.env.PORT || 5000, function(){
  console.log('Server listening on port ' + (process.env.PORT || 5000));
});
