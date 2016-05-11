Micado.Views.ItemCard = Marionette.ItemView.extend({
    actionHandler: null,

    events: {
        '.item__action' : 'doAction'
    },

    initialize: function (options) {
        this.actionHandler = options.action.bind(this);
    },

    doAction: function (event) {
        this.actionHandler();
    }
});