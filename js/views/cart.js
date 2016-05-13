Micado.Views.Cart = Marionette.CompositeView.extend({
    collection: null,

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

    updateTotal: function () {
        this.totalEl.textContent = this.options.templateHelpers.total();
    }
});