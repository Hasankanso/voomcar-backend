'use strict';

class Car extends Backendless.ServerCode.PersistenceItem {
  constructor() {
    super();
    
    /**
     @name Car#maxSeats
     @type Number
     */
    this.maxSeats = undefined;

    /**
     @name Car#brand
     @type String
     */
    this.brand = undefined;

    /**
     @name Car#driver
     @type String
     */
    this.driver = undefined;

    /**
     @name Car#name
     @type String
     */
    this.name = undefined;

    /**
     @name Car#color
     @type String
     */
    this.color = undefined;

    /**
     @name Car#year
     @type Number
     */
    this.year = undefined;

    /**
     @name Car#maxLuggages
     @type Number
     */
    this.maxLuggages = undefined;

    /**
     @name Car#picture
     @type File reference
     */
    this.picture = undefined;
    
    

  }
}

module.exports = Backendless.ServerCode.addType(Car);