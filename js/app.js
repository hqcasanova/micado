/**
 * @fileOverview 
 * 
 * @author hqcasanova develop@hqcasanova.com
 */

//Public namespace
window.Micado = {

    //Backbone component classes
    Models: {},
    Collections: {},
    Views: {},
  
    //Initialise app
    run: function (endpoints) {
        var backboneSync;
        var headerView;

        Micado.Items = new Micado.Collection.Items([], {
            url: endpoints.itemsUrl,
            feedbackView: headerView
        });
        Micado.Cart = new Micado.Collection.Cart([], {
            localStorage: 'Micado.Cart'
        });

        //All prices assumed to be in pound sterling
        Micado.Currency = '£';

        headerView = new Micado.Views.HeaderView({
            collection: Micado.Cart,
            el: '.header',
            initPromises: [$.get(endpoints.templatesUrl, build)]    //feedback while retrieving templates
        });

        //Displays transaction feedback for every Backbone request
        backboneSync = Backbone.sync 
        Backbone.sync = function (method, model, options) {
            headerView.showFeedback(backboneSync(method, model, options));
        };

        //Caches all templates and shows item list
        function build (templatesHTML) {
            var layoutView, views;

            document.body.insertAdjacentHTML('beforeend', templatesHTML);
            scripts = Array.prototype.slice.call(document.getElementsByTagName('script'));
            scripts.forEach(function (scriptEl) {
                if (scriptEl.id) {
                    Marionette.TemplateCache.get('#' + scriptEl.id);
                }
            });

            views = {
                items: new Marionette.CompositeView({
                    collection: new Micado.Items,
                    template: '#items-template',
                    childView: Micado.Views.ItemCard,
                    childViewOptions: {templateHelpers: {actionName: 'Add to cart'}},
                    childViewContainer: '.list',
                    action: function (model) {
                        Micado.Cart.create(model.toJSON());
                        this.el.classList.add('added');
                    }
                }), 

                cart: new Marionette.CompositeView({
                    collection: new Micado.Cart,
                    template: '#cart-template',
                    childView: Micado.Views.ItemCard,
                    childViewOptions: {templateHelpers: {actionName: 'Remove from cart'}},
                    childViewContainer: '.list',
                    action: function (model) {
                        Micado.Cart.destroy(model);
                        this.el.classList.toggle('added', Micado.Cart.contains(model));
                    }
                }), 
            };

            //Includes rudimentary routing implementation
            layoutView = new Marionette.LayoutView({
                regions: {
                    main: 'main'
                },
                regionViews: views
            });               
        } 
    }
}