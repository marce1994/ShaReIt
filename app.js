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
            imgLink: data.imgLink,
            description: data.description,
            timestamp: data.timestamp,
        };
        callback(obj,counter);
    });
};
////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////WEBAPI/////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

//********************************************************//
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});
//********************************************************//
app.get('/api/lastestuploads', function(req, res) {
    //console.log(req.query);
    var obj = {}
    obj.docs = [];
    getUploadsPaginated(function(doc, counter){
        //{ }, req.query.numxpage, req.query.page,
        obj.count = counter;
        obj.docs.push(doc);
        if(counter == req.query.numxpage){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(obj));
            //console.log(obj);
        }
    });
});
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
    });
},true);

setInterval(function(){
    if(update.length > 0){
        
    }
}, 1000);
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
  console.log('Server listening on port ' + process.env.PORT || 5000);
});
