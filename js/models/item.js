Micado.Model.Item = Backbone.Model.extend({
    defaults: function () {
        return {
            name: '',
            image: '',
            price: 0,
            code: '',
            discountCode: '' 
        }
    }
});