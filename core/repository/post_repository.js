module.exports.postRepository = function(http){
     var db = require('./gundb.js');
     var validator = require('validator');

     var addUpload = function(object, callback){
         var pass = true;
         // TODO validaciones
         db.Add('post', {
             title : object.title,
             description : object.description,
             magnetUri : object.magnetUri,
             imageSrc : object.imageSrc,
             tags : tags,
         }, callback)

         //if invalid
         /**
          * callback(error feoso);
          */
     }
}

/**
 * string title
 * string description
 * string magnetUri
 * string imageSrc
 * string[] tags
 */