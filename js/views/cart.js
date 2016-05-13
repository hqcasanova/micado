Micado.Views.Cart = Marionette.CompositeView.extend({
    collection: null,

    templateHelpers: function () {
        return {
            total: this.collection.getTotal()
        }
    },

    collectionEvents: {
        'pricing:update': 'updateTotal' 
    },

    onRender: function () {
        this.totalEl = this.el.querySelector('.total__figure');
    },

    updateTotal: function () {
        this.totalEl.textContent = this.collection.getTotal();
    }
});