function indexViewModel() {
    var self = {};
    self.latestUploads = ko.observableArray();
    self.itemsXPage = ko.observable(12);
    self.actualPage = ko.observable();
    self.pageCount = ko.observable();
    return self;
};