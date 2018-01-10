$(document).ready(function(){
    ko.applyBindings(indexViewModel);
    loadLatestUploads(20,1);    
});

function loadLatestUploads(numxpage, page){
    var data = {
        numxpage,
        page
    };
    console.log("llamando...");
    $.ajax({
        url: "api/lastestuploads",
        type: "GET",
        data: data,
        contentType: "application/json",
        success: function(res) {
            indexViewModel.latestUploads(res.docs);
            //indexViewModel.pageCount(res.pages);
            //indexViewModel.actualPage(res.currentPage);
            console.log(res);
        }
    });
}

var socket = io.connect('http://192.168.1.124:3000', { 'forceNew': true });

socket.on('messages', function(data) {
  console.log(data);
});

socket.on('new', function(data) {
  console.log(data);
});