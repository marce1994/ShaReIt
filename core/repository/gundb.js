module.exports.db = function(http){
    var Gun = require('gun');
    var gunOptions = {
        file: 'database/data.json',
        peers: ['http://192.168.1.130:8080/gun','http://192.168.1.131:80/gun'],
        web: http
    }
    var gun = Gun(gunOptions);

    var Suscribe = function(key, callback){
        gun.get(key).on(function(data, _key){
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
    }

    var Add = function(key, object, callback){
        var uploads = gun.get(key);
        uploads.set(object, function(ack){
            callback(ack);
        });
    };
}