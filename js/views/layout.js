Micado.Views.Layout = Marionette.LayoutView.extend({
    regionViews: null,      //views to be rendered inside the layout's regions

    initialize: function (options) {
        this.regionViews = options.regionViews;

        window.onhashchange = this.renderMain.bind(this);
        if (!location.hash) {
            location.hash = 'items';
        }
    },

    renderMain: function () {
        var viewToShow = this.regionViews[location.hash.substring(1)];
        this.main.show(viewToShow, {preventDestroy: true});
    }
});