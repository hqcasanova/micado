Micado.Views.Layout = Marionette.LayoutView.extend({
    regionViews: null,      //views per route to be rendered inside the layout's regions

    initialize: function (options) {

        //regionViews and errorTemplate are mandatory options
        try {
            this.regionViews = options.regionViews || {};
            this.defaultViewName = options.defaultViewName;
            this.regionViews.error = new Marionette.ItemView({template: options.errorTemplate});
        } catch (e) {
            
            //At least the error template is available => shows it
            if (this.regionViews.error) {
                this.renderRegion(this.main, 'error')
      
            //Cannot recover => exception
            } else {
                throw e;
            }
        }

        //Renders a view on hash change
        window.onhashchange = this.renderRegion.bind(this, this.main);
    },

    //Renders first view according to existing hash or lack of it
    start: function (routes) {
        _.extend(this.regionViews, routes);
        if (!location.hash) {           //default 'route'
            location.hash = this.defaultViewName;
        } else {                        //'route' already provided
            this.renderRegion(this.main);
        }
    },

    renderRegion: function (region, viewName) {
        var viewToShow;

        if (typeof viewName !== 'string') {
           viewName = location.hash.substring(1);
        }

        if (viewName) {

            //Renders the error view if view not found in 'route-to-view' map
            if (!this.regionViews[viewName]) {
                viewName = 'error';   
            }
            viewToShow = this.regionViews[viewName];

            //Retrieves first whatever collection the view has associated if it hasn't already
            //The current view is not destroyed to take advantage of local state
            if (viewToShow.collection) {
                if (viewToShow.collection.isFetched) {
                    region.show(viewToShow, {preventDestroy: true});
                } else {
                    viewToShow.collection.fetch().done(function () {
                        region.show(viewToShow, {preventDestroy: true});
                    });
                }

            //No collection => just shows the view
            } else {
                region.show(viewToShow);
            }
        }
    }
});