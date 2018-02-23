function indexViewModel() {
    var self = {};
    self.latestUploads = ko.observableArray([]);
    self.newObj = ko.observable();
    return self;
};

var viewModel;
$(document).ready(function(){
    viewModel = indexViewModel();
    viewModel.newObj({
        title: 'title',
        description: 'An awsome description',
        image: 'http://via.placeholder.com/350x350',
        magnet: 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel',
        steemitposturi: 'https://steemit.com/anime/@pablobianco/shareit-network',
    });
    ko.applyBindings(viewModel);    
});

var socket = io.connect();

socket.on('messages', function(data) {
    console.log(data);
});

socket.on('new', function(data) {
    viewModel.latestUploads.push(data);
    console.log(data);
});

function AddObject(){
    socket.emit('add',viewModel.newObj());
}