Micado.Collections.Cart = Micado.Collections.Entities.extend({
    model: Micado.Models.Item,                          
    localStorage: new Backbone.LocalStorage('Cart'),    //cart will be persisted in browser's localStorage

    //Updates prices according to the newly added/removed item's discount policy
    initialize: function (models, options) {
        this.listenTo(this, 'add', this.checkDiscount(''));
        this.listenTo(this, 'destroy', this.checkDiscount('Rev'));
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
            this.trigger('pricing:update');     //prevents calculation of total getting ahead of pricing
        }
    },

    //If an even number of 2for1 items exist, make last one added free  
    off1: function (model) {
        var numItems2for1 = this.where({discountCode: 'off1', code: model.get('code')}).length;

        if ((numItems2for1 > 1) && (numItems2for1 % 2 == 0)) {
            model.set('price', 0);
        }
    },

    //Makes sure all free items are paired with a priced one whenever possible
    off1Rev: function (model) {
        var attrs2for1 = {discountCode: 'off1', code: model.get('code')};
        var items2for1 = this.where(attrs2for1);
        var numItems2for1 = items2for1.length;
        var freeItems;
        var numFreeItems;
        var balanceRatio;

        //The collection may fall 'out of balance' when it contains 3 or more items
        if (numItems2for1 > 2) {
            freeItems = this.where(_.extend({}, attrs2for1, {price: 0}));
            numFreeItems = freeItems.length;
            balanceRatio = numFreeItems - numItems2for1 / 2;

            //There are 2 free items more than the number of priced ones => restores price for last free item
            if (balanceRatio == 1) {
                freeItems.models[numFreeItems - 1].set('price', model.get('price'));

            //There are 2 priced items more than free items => makes first priced item found free
            } else if (balanceRatio == -1) {
                items2for1.find(function (item) {return item.get('price') != 0}).set('price', 0);
            }    
        }
    },

    //If 3 or more items are added with reduced pricing, update the price of
    //all items to  that of the original 
    reduced3: function (model) {
        var itemsReduced = this.where({discountCode: 'reduced3', code: model.get('code')});
        var numItemsReduced = itemsReduced.length;
        var newPrice = model.get('discountPrice');

        //Backs original price up
        model.set('origPrice', model.get('price'));

        if (numItemsReduced > 3) {
            model.set('price', newPrice);
        
        } else if (numItemsReduced == 3) {
            itemsReduced.forEach(function (item) {
                item.set('price', newPrice);
            });
        }
    },

    //Pricing varies while removing reduced-priced items only if less than 3 left
    reduced3Rev: function (model) {
        var itemsReduced = this.where({discountCode: 'reduced3', code: model.get('code')});

        if (itemsReduced.length == 2) {
            itemsReduced.forEach(function (item) {
                item.set('price', item.get('origPrice'));
            });
        }
    }
});