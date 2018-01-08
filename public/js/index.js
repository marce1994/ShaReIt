$(document).ready(function(){
    loadLatestUploads(12,1);
    ko.applyBindings(indexViewModel);
});

function loadLatestUploads(numxpage, page){
    var data = {
        numxpage,
        page
    };
    $.ajax({
        url: "/api/lastestuploads",
        type: "GET",
        data: data,
        contentType: "application/json",
        success: function(res) {
            indexViewModel.latestUploads(res.docs);
            indexViewModel.pageCount(res.pages);
            indexViewModel.actualPage(res.currentPage);
        }
    });
}