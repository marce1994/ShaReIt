//CORE
//---------------------------------------------------
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
//---------------------------------------------------
var express = require("express");
var app = express();

var webrouter = require('./web/router.js');
app.use(webrouter);

var http = require('http').createServer(app);
var io = require('socket.io')(http);

var database = require('./database/database.js')(http,io);

io.on('connection', function(client){
    client.emit('message','hello :)');

    console.log('Cliente conectado');

    client.on('message', function(data)
    {
        console.log(data);
    });

    client.on('add', function(data)
    {
        database.AddObj(data);
    });
});

/*if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {*/
    //Application run
    var port = process.env.PORT || 8080;
    http.listen(port);
    console.log(`Worker ${process.pid} started and listening on port ${port}`);
//}