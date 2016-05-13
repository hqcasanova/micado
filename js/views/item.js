Micado.Views.Item = Marionette.ItemView.extend({
    template: '#item-card-template',
    onAction: null,

    events: {
        'click .item__action' : 'onClick'
    },

    modelEvents: {
        'change:price' : 'updatePrice'
    },

    initialize: function (options) {
        this.onAction = options.onAction.bind(this);

        _.defaults(this.options.templateHelpers, {
            
            //Outputs 'free' when price is 0 and includes currency 
            humanPrice: function () {
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

        this.priceValueEl = this.el.querySelector('.item__price__value');
    },

    //Gets rid of Marionette's wrapping div
    onRender: function () {
        this.setElement(this.el.innerHTML);
    },

    //Disables the button during the action
    onClick: function (event) {
        event.currentTarget.disabled = true;
        this.onAction(event).always(function () {
            event.currentTarget.disabled = false;
        });
    }

    updatePrice: function () {
        this.priceValueEl.textContent = this.options.templateHelpers.humanPrice.call(this.model.attributes);
    }
});