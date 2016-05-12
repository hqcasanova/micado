Micado.Views.Item = Marionette.ItemView.extend({
    template: '#item-card-template',
    actionHandler: null,

    events: {
        'click .item__action' : 'doAction'
    },

    initialize: function (options) {
        this.actionHandler = options.action.bind(this);
    },

    doAction: function (event) {
        this.actionHandler();
    }
});