Micado.Views.Layout = Marionette.LayoutView.extend({
    regionViews: null,      //views per route to be rendered inside the layout's regions
    defaultView: null,      //view to be shown for default 'route'
    statusView: null,       //view in charge of showing current app status

    initialize: function (options) {
        this.regionViews = options.regionViews || {};

        //A 'main' region must have been provided.
        //Also, defaultView and errorTemplate are mandatory options
        try {
            this.defaultView = options.defaultView;
            this.statusView = options.statusView;
            this.regionViews.error = Marionette.ItemView.extend({template: options.errorTemplate});

            //Sets rendering region
            this.start = this.start(this.main);

            //Renders whenever hash fragment changes
            window.onhashchange = this.renderRegion.bind(this, this.main);
            
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
    renderRegion: function (region, route) {
        var viewToShow;

        //Takes the route from the location if none provided
        if (typeof route !== 'string') {
           route = location.hash.substring(1);
        }

        //Renders the error view if no matches from the 'route-to-view' map
        if (!this.regionViews[route]) {
            route = 'error';   
        }
        viewToShow = new this.regionViews[route]();

        //Shows the view right away if no collection needs to be retrieved
        if (!viewToShow.collection || viewToShow.collection.isFetched) {
            region.show(viewToShow);
        
        //Retrieves first whatever collection the view has associated if it hasn't already   
        } else {
            viewToShow.collection.fetch().done(function () {
                region.show(viewToShow);
            });
        }

        //Updates app's status if no error
        if (route != 'error') {
            this.statusView.setActive(route);
        }
    }
});