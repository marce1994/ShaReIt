module.exports = function () {
    var Datastore = require('nedb');
    db = {};
    db.uploads = new Datastore('./web/web_db/uploads.db');
    db.uploads.loadDatabase();

    module.addUpload = function (obj) {
        db.insert(doc, function (err, newDoc) {
           if(error != null)
                console.log();
           else
               console.log("Insert successfull: " + JSON.stringify(newDoc));
        });
    };

    module.listUploads = function(filter, callback){
        db.uploads.find(filter).sort({ timestamp: -1 }, function (error, documents) {
            obj = {
                err : error,
                docs : documents
            }
            if(err != null)
                console.log(err);
            callback(obj);
        });
    };

    module.listUploads = function(filter, page, count, callback){
        db.uploads.find(filter).sort({ timestamp: -1 }).skip(count * (page-1)).limit(count).exec(function (error, documents){
            obj = {}
            if(obj.err != null){
                console.log(err);                
                obj.err = err;
            }else{
                obj.docs = documents.slice(page-1*count,count-1);
                obj.count = documents.lenght;
            }
            callback(obj);
        });
    };

    return module;
};