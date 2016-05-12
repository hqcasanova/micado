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
        var layoutView;
        var headerView;

        Micado.Items = new Micado.Collections.Items([], {
            url: endpoints.itemsUrl
        });
        Micado.Cart = new Micado.Collections.Cart();

        //All prices assumed to be in pound sterling
        Micado.Currency = '£';

        //Caches critical templates like the error view
        cacheTemplates();

        //Includes rudimentary routing implementation
        layoutView = new Micado.Views.Layout({
            el: document.body,
            regions: {
                main: 'main'
            },
            defaultViewName: 'items',
            errorTemplate: '#error-template'
        });   

        headerView = new Micado.Views.HeaderView({
            collection: Micado.Cart,
            el: '.header',
            initPromises: [$.get(endpoints.templatesUrl, build)]    //feedback while retrieving templates
        });

        //Displays transaction feedback for every Backbone request
        backboneSync = Backbone.sync 
        Backbone.sync = function (method, model, options) {
            var synced = backboneSync(method, model, options);
            
            headerView.showFeedback(synced);
            return synced;
        };

        function build (templatesHTML) {

            //Caches external templates
            document.body.insertAdjacentHTML('beforeend', templatesHTML);
            cacheTemplates();

            //Defines app views and starts 'routing'
            _.extend(layoutView.regionViews, {
                items: new Marionette.CompositeView({
                    collection: Micado.Items,
                    template: '#items-template',
                    childView: Micado.Views.Item,
                    childViewContainer: '.list',
                    childViewOptions: {
                        templateHelpers: {actionName: 'Add'},
                        action: function (model) {
                            Micado.Cart.create(model.toJSON());
                            this.el.classList.add('added');
                        }
                    }
                }), 

                cart: new Micado.Views.Cart({
                    collection: Micado.Cart,
                    template: '#cart-template',
                    childView: Micado.Views.Item,
                    childViewContainer: '.list',
                    childViewOptions: {
                        templateHelpers: {actionName: 'Remove'},
                        action: function (model) {
                            Micado.Cart.destroy(model);
                            this.el.classList.toggle('added', Micado.Cart.contains(model));
                        }
                    }
                }) 
            });
            layoutView.start();           
        } 

        function cacheTemplates () {
            var scripts;

            scripts = Array.prototype.slice.call(document.getElementsByTagName('script'));
            scripts.forEach(function (scriptEl) {
                if (scriptEl.id) {
                    Marionette.TemplateCache.get('#' + scriptEl.id);
                }
            });
        }
    }
}