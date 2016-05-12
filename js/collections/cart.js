Micado.Collections.Cart = Micado.Collections.Entities.extend({
    model: Micado.Models.Item,                          
    localStorage: new Backbone.LocalStorage('Cart'),    //cart will be persisted in browser's localStorage

    //Updates prices according to the newly added/removed item's discount policy
    initialize: function (models, options) {
        this.listenTo(this, 'add', this.checkDiscount(''));
        this.listenTo(this, 'remove', this.checkDiscount('Rev'));
    },

    getTotal: function () {
        return this.reduce(function (memo, item) { 
            return memo + item.get('price'); 
        }, 0);
    },

    checkDiscount: function (suffix) {
        return function (model) {
            var discountCode = model.get('discountCode');

            discountCode && this[discountCode + suffix](model);
        }
    },

    //If an even number of 2for1 items exist, make last one added free  
    off1: function (model) {
        var numItems2for1 = this.where({discountCode: 'off1'}).length;

        if ((numItems2for1 > 1) && (numItems2for1 % 2 == 0)) {
            model.set('price', 0);
        }
    },

    //Removal of 2for1 items doesn't have any effect on existing prices
    off1Rev: function () {},

    //If 3 or more items are added with half-price-after-three pricing, update the price of
    //subsequent items to half that of the original 
    half3: function (model) {
        var numItemsHalf3 = this.where({discountCode: 'half3'}).length;
        var newPrice = model.get('price') / 2;

        if (numItemsHalf3 > 3) {
            model.set('price', newPrice);
        
        } else if (itemsHalf3 == 3) {
            itemsHalf3.forEach(function (item) {
                item.set('price', newPrice);
            });
        }
    },

    //Pricing only varies while removing half-price-after-three items if less than 3 left
    half3Rev: function (model) {
        var numItemsHalf3 = this.where({discountCode: 'half3'}).length;

        if (numItemsHalf3 == 2) {
            itemsHalf3.forEach(function (model) {
                model.set('price', model.get('price') * 2);
            });
        }
    }
});