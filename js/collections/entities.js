Micado.Collections.Entities = Backbone.Collection.extend({
    isFetched: null,        //collection fetched at least once
    localStorage: null,

    initialize: function (models, options) {
        if (options.url) {
            this.url = options.url;
        }

        if (options.localStorage) {
            this.localStorage = new Backbone.LocalStorage(options.localStorage);
        }

        this.isFetched = false;
    },

    fetch: function(options) {
        var promise;
        var that = this;

        promise = Backbone.Collection.prototype.fetch.call(this, options);

        if (!this.isFetched) {
            promise.done(function () {
                that.isFetched = true;
            });
        }

        return promise;
    }
});