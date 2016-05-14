Micado.Views.Cart = Marionette.CompositeView.extend({
    collection: null,

    childViewOptions: {
        templateHelpers: {
            actionName: 'Remove'
        },
        onAction: function (event) {
            this.el.classList.add('item--removing');
            return this.model.destroy({wait: true});
        }
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

    updateTotal: function () {
        this.totalEl.textContent = this.templateHelpers().total;
    }
});