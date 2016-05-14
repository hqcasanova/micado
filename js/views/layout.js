Micado.Views.Layout = Marionette.LayoutView.extend({
    regionViews: null,      //views per route to be rendered inside the layout's regions
    hideClass: null,        //name of the class used to hide region

    initialize: function (options) {
        this.regionViews = options.regionViews || {};

        //A 'main' region must have been provided.
        //Also, hideClass, defaultView and errorTemplate are mandatory options
        try {
            this.start(this.main);
            this.hideClass = options.hideClass;
            this.defaultView = options.defaultView;
            this.regionViews.error = Marionette.ItemView.extend({template: options.errorTemplate});
        } catch (e) {
            
            //At least the error template is available => shows it
            if (this.regionViews.error) {
                this.renderRegion(this.main, 'error')
      
            //Cannot recover => exception
            } else {
                throw e;
            }
        }

        //Renders whenever hash fragment changes and, once all rendered resources are loaded, reveals them
        window.onhashchange = this.renderRegion.bind(this, this.main);
        window.onload = this.reveal.bind(this, this.main);
    },

    //Reveals rendered view once all its resources have been downloaded
    reveal: function (region) {
        if (region.hasView()) {
            region.el.classList.remove(this.hideClass);
        }
    },

    //Renders first view according to existing hash or lack of it
    start: function (region) {
        return function (routes) {
            _.extend(this.regionViews, routes);
            if (!location.hash) {           //default 'route'
                location.hash = this.defaultView;
            } else {                        //'route' already provided
                this.renderRegion(region);
            }
        }
    },

    //Renders a user-provided view inside a given region
    renderRegion: function (region, viewName) {
        var viewToShow;

        if (typeof viewName !== 'string') {
           viewName = location.hash.substring(1);
        }

        if (viewName) {

            //Renders the error view if no matches from the 'route-to-view' map
            if (!this.regionViews[viewName]) {
                viewName = 'error';   
            }
            viewToShow = new this.regionViews[viewName]();

            //Retrieves first whatever collection the view has associated if it hasn't already
            if (!viewToShow.collection || viewToShow.collection.isFetched) {
                region.show(viewToShow);
            } else {
                viewToShow.collection.fetch().done(function () {
                    region.classList.add(this.hideClass);   //Hide any previous content until all resources loaded
                    region.show(viewToShow);
                });
            }
        }
    }
});