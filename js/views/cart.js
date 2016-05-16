Micado.Views.Cart = Marionette.CompositeView.extend({
    collection: null,

    events: {
        'click .empty' : 'removeAll'
    },

    templateHelpers: function () {
        return {
            total: this.collection.getTotal().toFixed(2)
        }
    },

    collectionEvents: {
        'pricing:update': 'updateTotal' 
    },

    onRender: function () {
        this.totalEl = this.el.querySelector('.total__figure');
    },

    removeAll: function () {
        _.invoke(this.collection.models, 'destroy');
    },

    updateTotal: function () {
        this.totalEl.textContent = this.templateHelpers().total;
    }
});