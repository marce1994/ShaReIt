// Of course you can create multiple datastores if you need several 
// collections. In this case it's usually a good idea to use autoload for all collections.
var Datastore = require('nedb');
db = {};
db.uploads = new Datastore('database/uploads.db');
//db.robots = new Datastore('path/to/robots.db');
 
// You need to load each database (here we do it asynchronously) 
db.uploads.loadDatabase();
//db.robots.loadDatabase();

function addUpload(magnetLink, title, description, callback){
    var doc = {
        magnet: magnetLink,
        title : title,
        description : description
    };

    var insert = db.uploads.insert(doc, function(err,newDoc){
        callback(err,newDoc);
    });
};

function getUploads(filter){    
    return db.uploads.find(filter, function (err, docs) {
        console.log(err,docs);
    });
};

function getUploadsPaginated(filter, numxpage, page, callback){
    db.uploads.count(filter, function (err, count) {
        if(page < (count/numxpage)+1){
            //console.log(numxpage,page);
            db.uploads.find(filter).skip(numxpage * (page-1)).limit(numxpage).exec(function (err, docs) {
                //console.log(docs.length);
                callback(err, docs, Math.ceil(count/numxpage));
            });
        }else{
            callback("Pagina fuera de rango", undefined, Math.ceil(count/numxpage));
        }
    });
};

//****************************** */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});
 
app.get('/api/lastestuploads', function(req, res) {
    getUploadsPaginated({ }, req.query.numxpage, req.query.page, function(err, docs, pages){
        if(err == null){
            var obj = {};
            obj.pages = pages;
            obj.docs = docs;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(obj));
        }else{
            var obj = {};
            obj.pages = pages;
            obj.error = err;
            res.send(JSON.stringify(obj));
        }
    });
});

// POST http://localhost:8080/api/users
// parameters sent with 
app.post('/api/upload', function(req, res) {
    addUpload(req.body.magnet, req.body.title, req.body.description, function(err, doc){
        if(err == null){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(doc));
        }else{
            res.send("ERROR: " + err);
        }
    });
});

var server = app.listen(3000, function(){
  console.log('Server listening on port 3000');
});

/*var Datastore = require('nedb');

// Of course you can create multiple datastores if you need several
// collections. In this case it's usually a good idea to use autoload for all collections.
// Database will save all new block.
db = {};
db.blocks = new Datastore('./database/blocks.db');

// You need to load each database (here we do it asynchronously)
db.blocks.loadDatabase();

// ID(lo tomo de la db)
// PreviousHash(Hash del bloque anterior)
// Nonce/Magic number (numero calculado para que el Hash sea valido)
// Data (objeto serializado en json que contiene toda la data del bloque)
// DataLenght (numero que identifica el largo de la cadena string de data)
// Timestamp
function block(Id, P_Hash, Hash, Nonce, Data, D_Lenght, Timestamp){
    var b = {};
    b.Id = Id;
    b.PHash = P_Hash;
    b.Hash = Hash;
    b.Nonce = Nonce;
    b.Data = Data;
    b.DLength = D_Lenght;
    b.Timestamp = Timestamp;
    return b;
}
function data(){
    var d = {};
    d.Title = 'sarasa';
    d.Title = 'Some random long and good description';
    d.Title = 'tags';
    d.Title = 'magnet link';            
};

console.log(JSON.stringify(block('ub88876FVSD6Vdytasvda5f', '0','fgdfe6s6hse6hs56km5768m8d76876578', '12345', '{PITO,PATO,PUTO}', 10)));*/