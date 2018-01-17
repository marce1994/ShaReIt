var express = require("express");
var path = require('path');
var uploadRepository = require("./uploads_repository")();

var router = express.Router();

router.get("/lastestuploads", function(req, res){
    uploadRepository.listUploads({}, req.query.page, req.query.numxpage, function(obj){
        if(obj.err == null){
            obj.pages = Math.ceil(obj.count/req.query.numxpage);
            obj.currentPage = req.query.page;
        }else{
            var obj = {};
            obj.error = err;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(obj));        
    });
});
module.exports = router;