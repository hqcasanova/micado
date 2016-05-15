Micado.Views.HeaderView = Marionette.View.extend({
    collection: null,           //cart
    allPromises: null,          //queue of promises
    logoEl: null,               //DOM element for logo image
    counterEl: null,            //DOM element for counter of cart items
    liveActives: null,          //live collection for active navigation buttons

    //Changes the cart counter every time the cart is modified.
    collectionEvents: {         
        'update': 'updateCounter'
    },

    initialize: function (options) {
        
        //Assumes the header's markup is critical and, therefore, already in place
        this.logoEl = this.el.querySelector('.logo');
        this.counterEl = this.el.querySelector('.nav__cart__counter');
        this.liveActives = this.el.getElementsByClassName('nav__button--active');

        //Sets up promise queue
        if (options.initPromises) {
            this.allPromises = $.when.apply($, options.initPromises);
            this.showFeedback();
        } else {
            this.allPromises = $.Deferred().resolve();
        }
    },

    showFeedback: function (promise) {
        var that = this;

        this.logoEl.classList.add('logo--loading');        

        //Appends promise to the queue
        if (promise) {
            this.allPromises = this.allPromises.then(promise);
        }

        //Stops feedback and resets queue even if there's been an error
        this.allPromises.always(function () {
            that.logoEl.classList.remove('logo--loading');
            that.allPromises = $.Deferred().resolve();                    
        
        //Redirects to 404-like view if any error encountered
        }).fail(function () {
            location.hash = 'error';
        });
    },

    setActive: function (route) {
        this.liveActives && this.liveActives[0].classList.remove('nav__button--active');
        this.el.getElementsByClassName(route)[0].classList.add('nav__button--active');
    },

    updateCounter: function (collection) {
        var count = collection.length;

        this.counterEl.classList.toggle('nav__cart__counter--empty', !count);
        this.counterEl.textContent = count;
    }
});