function indexViewModel() {
    var self = {};
    self.title = ko.observable();
    self.description = ko.observable();
    self.tags = ko.observableArray();
    self.torrent = ko.observable();
    return self;
};