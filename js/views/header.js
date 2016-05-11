Micado.Views.HeaderView = Marionette.View.extend({
    collections: null,              //cart
    allPromises: $.Deferred(),      //queue of promises

    initialize: function (options) {
        if (options.initPromises) {
            this.allPromises = $.when.apply($, options.initPromises);
        }

        //Assumes the header's markup is critical and, therefore, already in place
        this.logoEl = this.el.querySelector('.logo');
        this.cartEl = this.el.querySelector('.cart');
        this.counterEl = this.el.querySelector('.cart__counter');

        //Changes the cart counter every time the cart is modified.
        this.listenTo(this.collection, 'update', this.updateCounter);
    },

    showFeedback: function (promise) {
        this.logoEl.classList.add('logo--loading');        

        //Appends promise to the queue
        this.allPromises = this.allPromises.then(promise);

        //Stops feedback and resets queue
        this.allPromises.done({
            this.logoEl.classList.remove('logo--loading');
            this.allPromises.resolve();                    
        })
    },

    updateCounter: function (collection) {
        var count = collection.length;

        this.cartEl.toggle('cart--empty', count);
        this.counterEl.textContent = count;
    }
});