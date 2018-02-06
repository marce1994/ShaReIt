module.exports.db = function(http){
    var Gun = require('gun');
    var gunOptions = {
        file: 'database/data.json',
        peers: ['http://192.168.1.130:8080/gun','http://192.168.1.131:80/gun'],
        web: http
    }
    var gun = Gun(gunOptions);

    var Suscribe = function(key, callback){
        
    }

    var Add = function(key, object, callback){
        var uploads = gun.get(key);
        uploads.set(object, function(ack){
            callback(ack);
        });
    };
}