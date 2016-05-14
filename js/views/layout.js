Micado.Views.Layout = Marionette.LayoutView.extend({
    regionViews: null,      //views per route to be rendered inside the layout's regions
    hideClass: null,        //name of the class used to hide region
    regionEl: null,         //DOM element for rendering region

    initialize: function (options) {
        this.regionViews = options.regionViews || {};

        //A 'main' region must have been provided.
        //Also, hideClass, defaultView and errorTemplate are mandatory options
        try {
            this.hideClass = options.hideClass;
            this.defaultView = options.defaultView;
            this.regionViews.error = Marionette.ItemView.extend({template: options.errorTemplate});

            //Sets rendering region and caches its DOM element
            this.start = this.start(this.main);
            this.regionEl = this.el.querySelector(this.main.el);

            //Renders whenever hash fragment changes and, once all rendered resources are loaded, reveals them
            window.onhashchange = this.renderRegion.bind(this, this.main);
            window.onload = this.reveal.bind(this, this.main);

        //Shows error or throws exception    
        } catch (e) {
            
            //At least the error template is available => shows it
            if (this.regionViews.error) {
                this.renderRegion(this.main, 'error')
      
            //Cannot recover => exception
            } else {
                throw e;
            }
        }
    },

    //Reveals rendered view once all its resources have been downloaded
    reveal: function (region) {
        this.regionEl.classList.remove(this.hideClass);
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
        var that = this;

        if (typeof viewName !== 'string') {
           viewName = location.hash.substring(1);
        }

        if (viewName) {

            //Renders the error view if no matches from the 'route-to-view' map
            if (!this.regionViews[viewName]) {
                viewName = 'error';   
            }
            viewToShow = new this.regionViews[viewName]();

            //Shows the view right away if no collection needs to be retrieved
            if (!viewToShow.collection || viewToShow.collection.isFetched) {
                region.show(viewToShow);
            
            //Retrieves first whatever collection the view has associated if it hasn't already
            //Hide any previous content until all resources loaded    
            } else {
                viewToShow.collection.fetch().done(function () {
                    that.regionEl.classList.add(that.hideClass);
                    region.show(viewToShow);
                });
            }
        }
    }
});