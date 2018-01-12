var viewModel;

$(document).ready(function(){
    viewModel = indexViewModel();
    ko.applyBindings(viewModel);
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

var socket = io.connect();

socket.on('messages', function(data) {
    console.log(data);
});

socket.on('new', function(data) {
    viewModel.latestUploads.push(data);
    console.log(data);
});