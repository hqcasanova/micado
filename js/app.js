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
            hideClass: 'content--hide',
            defaultView: 'items',
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
                        inCart: function () {
                            return Micado.Cart.where({code: this.code}).length;
                        },
                        discountPromo: function () {
                            if (this.discountCode) {
                                return Mn.TemplateCache.get('#' + this.discountCode + '-template')(this);
                            }
                        },
                        actionName: 'Add'
                    },
                    onAction: function (event) {
                        var deferred = $.Deferred()
                        var that = this; 
                        
                        Micado.Cart.create(this.model.toJSON(), {
                            success: function () {
                                deferred.resolve();
                                that.el.querySelector('.item__cart__number').textContent =
                                    that.options.templateHelpers.inCart.call(that.model.attributes);
                                that.el.classList.add('item--added');
                            }
                        });
                        return deferred;
                    }
                }
            });
            cartView = Micado.Views.Cart.extend({
                collection: Micado.Cart,
                template: '#cart-template',
                childView: Micado.Views.Item,
                childViewContainer: '.list'
            });

            //Cart contents needed first thing so that items already in it are marked as added
            Micado.Cart.fetch();
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
                    Mn.TemplateCache.get('#' + scriptEl.id);
                }
            });
        }
    }
}