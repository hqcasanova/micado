Micado.Models.Item = Backbone.Model.extend({
    defaults: function () {
        return {
            name: '',
            code: '',
            image: '',
            price: 0,
            discountCode: '' 
        }
    }
});