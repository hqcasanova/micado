Micado.Views.Item = Marionette.ItemView.extend({
    template: '#item-card-template',
    onAction: null,

    events: {
        'click .item__action' : 'onClick'
    },

    initialize: function (options) {
        this.onAction = options.onAction.bind(this);
    },

    onClick: function (event) {
        this.onAction(event);
    }
});