Micado.Models.Item = Backbone.Model.extend({
    idAttribute: 'code',
    
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