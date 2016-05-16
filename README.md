# micado
Micado is a rudimentary e-commerce SPA  with flexible product discount policies. The focus is on the products, not the supermarket brand. Hence its binary colours and responsive, simple-looking interface. Under the hood, the app uses Backbone/Marionette and leverages the browser’s local storage to speed up access to the cart.

# Features
- **Flexible pricing**: every item has a discount code identifying the name of the relevant algorithm and template. The latter specifies the HTML used for the offer description appearing on the corresponding item. Changing an item’s discount policy to another is just one change away.
- **Shallow browser support**: the app has been tested on recent versions of Chrome (49+), Safari (7+), Firefox (45+).  The JavaScript codebase assumes IE10+. Support for mobile stock browsers is still work-in-progress.
- **Responsive design**: the layout chosen allows the display of multiple products at once even while on portrait mode on devices with smaller screens such as iPhone 5. Reflows due to unknown image sizes have been minimised by clipping to preset dimensions.
- **Bandwidth-agnostic**: the critical rendering path has been optimised so that initial feedback is presented to the user as quickly as possible. Additionally, any requests performed within the app are indicated at the header level, never leaving the user wondering if something at all is going on. At a code level, promises are used wherever possible.
-**API architecture**: thanks to Backbone, the codebase is independent of the underlying request verbs being used. By default, a RESTful API is assumed. Nevertheless, should Websockets need to be used instead, overwriting Backbone’s sync function should suffice. A similarly simple process is all it is needed to move the cart from local to server-side storage.

# Product Data structure
Every item is represented by the following properties:
- `name`: name of the product
- `code`: code identifying the product
- `image`: URL for the product image
- `price`: price in the currency specified by the global constant `Micado.Currency`
- `discountCode`: code identifying the pricing/discount policy
- `discountPrice`: price of the product when the discount applies
If the product is not on offer, the properties `discountCode` and `discountPrice` can be omitted

# Pricing Architecture
The `Micado.Collections.Cart` class contains the logic for the pricing policy, with two methods for each of the possible discount codes identifying the policies. The method invoked depends on the action being performed on the collection:
- Adding a new item: the method has the same name as the policy’s code
- Removing an item: the method’s name is similar to the above name with a  “Rev” suffix. 
The difference is due to the fact that the logic to be applied when an new item is added to the cart can be non-symetrical with respect to the logic needed when it is removed.
All in all, the programmer must make sure that, for a given policy code, two methods exist inside the Micado.Collections.Cart class: one named after said code and the other with a “Rev” suffix.
When it comes to the HTML used for offer description, the template to be used is required to have an id of the form `<discountCode>-template`. That template will be used automatically for every product with that discount code.

# Roadmap
- Replace the custom routing system with Backbone’s. The current one was an experiment to see if it was possible to keep view class definition outside the controller and, thus, keep references to collections at the outermost level of the codebase, thus simplifying debugging.
- Extend the class hierarchy for items, adding child classes that differentiate cart and shop items. Use those classes to encapsulate the part of the class definitions occurring in app.js and used for the routed views. 
- Take advantage of Marionette’s module system.
- Add unit tests.

