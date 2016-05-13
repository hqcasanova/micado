Micado.Views.Item = Marionette.ItemView.extend({
    template: '#item-card-template',
    onAction: null,

    events: {
        'click .item__action' : 'onClick'
    },

    initialize: function (options) {
        this.onAction = options.onAction.bind(this);

        _.defaults(this.options.templateHelpers, {
            
            //Outputs 'free' when price is 0. 
            price: function () {
                if (this.price) {
                    return Micado.Currency + this.price;
                } else {
                    return 'free';
                }
            },

            //Allows reuse of item template on shop view for cart items
            isCartItem: function () {
                return typeof this.inCart === 'undefined'
            }
        });
    },

    onRender: function () {
        this.setElement(this.el.innerHTML);
    },

    onClick: function (event) {
        this.onAction(event);
    }
});