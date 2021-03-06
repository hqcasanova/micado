Micado.Collections.Cart = Micado.Collections.Entities.extend({
    model: Micado.Models.Item,                          
    localStorage: new Backbone.LocalStorage('Cart'),    //cart will be persisted in browser's local storage

    //Starts listening for updates only after all cart items have been retrieved
    initialize: function (models, options) {
        this.listenToOnce(this, 'sync', this.monitorUpdates);
    },

    //Updates prices according to the newly added/removed item's discount policy. 
    monitorUpdates: function () {
        this.listenTo(this, 'add', this.checkDiscount(''));
        this.listenTo(this, 'destroy', this.checkDiscount('Rev'));
    },

    getTotal: function () {
        return this.reduce(function (memo, item) { 
            return memo + item.get('price'); 
        }, 0);
    },

    destroyAll: function () {
        _.each(_.clone(this.models), function (model) {
            model.destroy();
        });
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
        var items2for1 = this.where({discountCode: 'off1', code: model.get('code')});
        var numItems2for1 = items2for1.length;
        var subItems;       //subarray of items, either free or priced

        //The collection may fall 'out of balance' when the last item removed was paired with a free one
        //and the latter was the one left. To bring it into balance, it restores the last free item's price.
        if ((numItems2for1 % 2 != 0) && (model.get('price') != 0)) {
            subItems = _.filter(items2for1, function (item) {return item.get('price') == 0});
            subItems.length && subItems.pop().set('price', model.get('price'));
        
        //If there's now an even number of items and the one removed was a free one, two consecutive removals
        //of free items must have happened (one legal and the following illegal) => make one priced item free
        } else if ((numItems2for1 % 2 == 0) && (model.get('price') == 0)) {
            subItems = _.filter(items2for1, function (item) {return item.get('price') != 0});
            subItems.length && subItems.pop().set('price', 0);
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