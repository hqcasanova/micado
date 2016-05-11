Micado.Collections.Cart = Micado.Collections.Entities.extend({
    model: Micado.Models.Item,  
    localStorage: new Backbone.LocalStorage('Cart'),            

    initialize: function (models, options) {
        this.listenTo(this, 'add', this.checkPricing);
        this.listenTo(this, 'remove', this.checkPricing);
    },

    total: function () {
        return this.reduce(function (memo, item) { 
            return memo + item.get('price'); 
        }, 0);
    },

    checkPricing: function (model) {
        var pricing = model.get('pricing');

        pricing && this[pricing].call(this);
    },

    //If an even number of 2for1 items exist, make last one added free  
    off1: function (model) {
        var numItems2for1 = this.where({pricing: 'off1'}).length;

        if ((numItems2for1 > 1) && (numItems2for1 % 2 == 0)) {
            model.set('price', 0);
        }
    },

    //If 3 or more items are added with half-price-after-three pricing, update the price of
    //subsequent items to half that of the original 
    half3: function (model) {
        var itemsHalf3 = this.where({pricing: 'half3'}).length;

        if (itemsHalf3.length > 3) {
            model.set('price', model.get('price') / 2);
        
        //Calculates the half price to be applied later on
        } else if (itemsHalf3.length == 3) {
            itemsHalf3[0].set('price', model.get('price') / 2);
            itemsHalf3[1].set('price', itemsHalf3[0].get('price'));
            itemsHalf3[2].set('price', itemsHalf3[0].get('price'));
        }
    }
});