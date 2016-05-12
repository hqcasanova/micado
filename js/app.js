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
            var itemsView;
            var cartView;

            //Caches non-critical templates retrieved from the server
            document.body.insertAdjacentHTML('beforeend', templatesHTML);
            cacheTemplates();

            //Instantiates views for every 'route'
            itemsView = Marionette.CompositeView.extend({
                collection: Micado.Items,
                template: '#items-template',
                childView: Micado.Views.Item,
                childViewContainer: '.list',
                childViewOptions: {
                    templateHelpers: {
                        addedClass: function () {
                            return Micado.Cart.contains(this)
                        },
                        discountPromo: function () {
                            if (this.discountCode) {
                                return Marionette.TemplateCache.get('#' + this.discountCode + '-template')
                            }
                        },
                        actionName: 'Add'
                    },
                    onAction: function (event) {
                        Micado.Cart.create(this.model.toJSON());
                        this.el.classList.add('added');
                    }
                }
            });
            cartView = Micado.Views.Cart.extend({
                collection: Micado.Cart,
                template: '#cart-template',
                childView: Micado.Views.Item,
                childViewContainer: '.list',
                childViewOptions: {
                    templateHelpers: {
                        actionName: 'Remove'
                    },
                    onAction: function (event) {
                        Micado.Cart.destroy(this.model);
                    }
                }
            });

            //Starts 'routing'
            layoutView.start({
                items: itemsView, 
                cart: cartView  
            });           
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