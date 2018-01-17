/*$(
    function()
    {
        var client = new WebTorrent();
        var dragDrop = DragDrop();
        var element = document.getElementById('dropfile');
        var el = document.getElementById( 'dropfile' );
        alert( el.outerHTML );

        console.log(element);
        dragDrop("dropfile", function (files) {
            client.seed(files, function (torrent) {
                console.log('Client is seeding ' + torrent.magnetURI)
            })
        });
    }
);*/

var viewModel;

$(document).ready(function(){
    viewModel = indexViewModel();
    ko.applyBindings(viewModel);
});