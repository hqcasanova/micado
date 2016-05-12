Micado.Views.Item = Marionette.ItemView.extend({
    template: '#item-card-template',
    onAction: null,

    events: {
        'click .item__action' : 'onClick'
    },

    initialize: function (options) {
        this.onAction = options.onAction.bind(this);

        //Normalises template helpers so that a single template can be used
        //for any types of item.
        _.defaults(this.templateHelpers, {
            addedClass: function () {}, 
            discountPromo: function () {}
        });
    },

    onClick: function (event) {
        this.onAction(event);
    }
});