//CORE
//---------------------------------------------------
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
//---------------------------------------------------
var express = require("express");
var app = express();

//steemit
var steem = require('steem');

/*var isValidUsername = steem.utils.validateAccountName('a1');
console.log(isValidUsername);*/

//votar
/*steem.broadcast.vote(wif, voter, author, permlink, weight, function(err, result) {
    console.log(err, result);
  });*/
  /*steem.api.getTrendingTags('anime', 10, function(err, result) {
    console.log(err, result);
  });*/
  /*steem.api.getRecentCategories('anime', 10, function(err, result) {
    console.log(err, result);
  });*/

  /*steem.api.getConfig(function(err, result) {
    console.log(err, result);
  });*/

  /*steem.api.getCurrentMedianHistoryPrice(function(err, result) {
    console.log(err, result);
  });*/
  /*steem.api.getHardforkVersion(function(err, result) {
    console.log(err, result);
  });*/
  /*steem.api.getNextScheduledHardfork(function(err, result) {
    console.log(err, result);
  });*/
  /*steem.api.login('', '', function(err, result) {
    console.log(err, result);
  });*/
  /*steem.api.getAccounts(["pablobianco"], function(err, result) {
    console.log(err, result);
  });*/
  /*steem.api.getAccountCount(function(err, result) {
    console.log(err, result);
  });*/
  /*steem.api.getOrderBook(100, function(err, result) {
    console.log(err, result);
  });*/

  //Obtiene los votos del post.
  /*steem.api.getActiveVotes("pablobianco", "shareit-network", function(err, result) {
    console.log(err, result);
  });*/
  //Obtiene los votod realizados por el usuario.
  /*steem.api.getAccountVotes("pablobianco", function(err, result) {
    console.log(err, result);
  });*/
  //Obtiene el contenido del post, titulo y practicamente todo.
  /*steem.api.getContent("pablobianco", "shareit-network", function(err, result) {
    console.log(err, result);
  });*/


  /*steem.api.getWitnessByAccount("pablobianco", function(err, result) {
    console.log(err, result);
  });*/
//steemit end...

var webrouter = require('./web/router.js');
app.use(webrouter);

var http = require('http').createServer(app);
var io = require('socket.io')(http);

var database = require('./database/database.js')(http,io);

io.on('connection', function(client){
    client.emit('message','hello :)');

    console.log('Cliente conectado');

    database.ListObj({}, function(docs){
        console.log(docs.length);
        for (var i = docs.length - 1; i >= 0; i--)
        {
            client.emit('new',docs[i]);
        }
    });

    client.on('message', function(data)
    {
        console.log(data);
    });

    client.on('add', function(data)
    {
        console.log(data);
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